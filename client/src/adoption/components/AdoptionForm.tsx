import emailjs from '@emailjs/browser';
import { usePaintings } from "../../hooks/usePaintings";
import { useLocation, useNavigate } from "react-router";
import { Form, Input, Button, Spin, Divider, Cascader, Checkbox, Radio, Space } from 'antd';
import { useEffect, useState } from "react";
import { getAirtableRecord, getPriceFromDamageLevel, reportAnalytics, updateAirtableRecord } from '../../utils';
import { NavLink } from 'react-router-dom';
import DamageLevelInfoButton from './DamageLevelInfoButton';
import DamageInformation from './DamageInformation';
import { ADOPTABLE_PAINTINGS_TABLE } from '../../constants';
import LoadingError from '../../components/LoadingError';

async function getIsPaintingAvailable(recordId: string): Promise<boolean> {
  const record = await getAirtableRecord(ADOPTABLE_PAINTINGS_TABLE, recordId);
  // If it's pending or red_dot then it is not available
  return !record?.fields?.adoption_pending && !record?.fields?.red_dot;
}

async function updatePaintingAirtable(recordId: string, pickupOption: string|null) {
  const fields = {
    adoption_pending: true,
    selected_pickup_option: pickupOption || '',
  };

  try {
    await updateAirtableRecord(ADOPTABLE_PAINTINGS_TABLE, recordId, fields);
  } catch (e) {
    // Not a fatal error because we will still get the adoption form submission
    // and the adoption can be marked Pending manually
    console.error(e);
  }
}

enum PriceOption {
  Personal = 'Personal',
  Business = 'Business',
}

enum TransferOption {
  Etransfer = 'Etransfer',
  Paypal = 'Paypal',
}

enum PickupOption {
  InPersonMay17 = 'InPersonMay17',
  InPersonJune1 = 'InPersonJune1',
  AlternateDate = 'AlternateDate',
  ShipCanada = 'ShipCanada',
  ShipInternational = 'ShipInternational',
}

function getPickupOptionFromCascaderValue(cascaderValue: string[]|undefined): PickupOption|null {
  if (!cascaderValue || cascaderValue.length < 2) {
    return null;
  }
  return cascaderValue[1] as PickupOption;
}

function getPickupDetails(cascaderOptions: string[]|undefined): string|null {
  const pickupOption = getPickupOptionFromCascaderValue(cascaderOptions)
  switch (pickupOption) {
    case PickupOption.InPersonMay17:
      return "You have chosen to pick up your painting and receipt on Friday May 17, 11am-2pm. The pickup address will be sent in a confirmation email once we have confirmed your e-transfer or Paypal. Please add it to your calendar now!";
    case PickupOption.InPersonJune1:
      return "You have chosen to pick up your painting and receipt on Saturday June 1, noon-3pm. The pickup address will be sent in a confirmation email once we have confirmed your e-transfer or Paypal. Please add it to your calendar now!";
    case PickupOption.AlternateDate:
      return "We will be in touch to arrange a pickup date.";
    case PickupOption.ShipCanada:
      return "We will be in touch to arrange transport to your location.";
    case PickupOption.ShipInternational:
      return "We will be in touch to arrange transport to your location.";
  }
  return null;
}

function getPickupOptionSubtitle(cascaderOptions: string[]|undefined): string|null {
  const pickupOption = getPickupOptionFromCascaderValue(cascaderOptions)
  switch (pickupOption) {
    case PickupOption.InPersonMay17:
      return "I will pick up the work in person in Victoria on Friday May 17, 11am-2pm. The pickup address will be sent in a confirmation email.";
    case PickupOption.InPersonJune1:
      return "I will pick up the work in person in Victoria on Saturday June 1, noon-3pm. The pickup address will be sent in a confirmation email.";
    case PickupOption.AlternateDate:
      return "I am unable to pick up the work in person on either of the set days. Please contact me once you have decided on an alternate pickup date.";
    case PickupOption.ShipCanada:
      return "I am unable to pick up the work in person and would like to have it shipped within Canada. I will include the $20 processing fee in my e-transfer or Paypal. Please contact me to arrange COD for the shipping cost.";
    case PickupOption.ShipInternational:
      return "I am unable to pick up the work in person and would like to have it shipped internationally. I will e-transfer or Paypal any applicable shipping fees once they are determined.";
  }
  return null;
}

interface ContactFormInputs {
  name: string;
  address: string;
  phone: string;
  email: string;
  priceOption: PriceOption;
  pickupOption: PickupOption;
  acknowledgeDamage: boolean;
  transferOption: TransferOption;
}


export default function AdoptionForm() {
  const [form] = Form.useForm<ContactFormInputs>();
  const pickupValue = Form.useWatch('pickupOption', form);

  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const navigate = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);


  function onFormSubmitError() {
    window.alert("Error submitting form! Please contact gordaneer@gmail.com");
    navigate("/");
  }

  const paintings = usePaintings();
  if (paintings === 'loading') {
    return (
      <div className="h-[500px] flex items-center justify-center" style={{ width: "min(650px, 100%)" }}>
        <Spin />
      </div>
    );
  }
  if (paintings === 'error') {
    return <LoadingError message="Error loading paintings" />;
  }

  const paintingId = searchParams.get('painting');
  const painting = paintings.find((p) => p.id === paintingId);

  async function onSubmit(data: ContactFormInputs) {
    reportAnalytics('submit_adoption', { paintingId });
    if (!painting) {
      onFormSubmitError();
      return;
    }

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_ADOPTION_NOTIFICATION_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    const pickupOption = getPickupOptionSubtitle(pickupValue as any);

    let price = getPriceFromDamageLevel(painting.damageLevel);
    if (data.priceOption === PriceOption.Business) {
      price = 200;
    }

    // Keys must correspond to template fields set up in emailjs template
    const emailTemplate = {
      name: data.name,
      year: painting.year,
      address: data.address,
      phone: data.phone,
      email: data.email,
      bpid: painting.id,
      price,
      pickup_option: pickupOption,
      painting_name: painting.title,
      pickup_details: getPickupDetails(pickupValue as any),
      is_business: data.priceOption === PriceOption.Business,
      painting_link: `https://jamesgordaneer.com/gallery?selected=${painting.id}`,
      transfer_option: data.transferOption,
    };

    if (!serviceId || !templateId) {
      onFormSubmitError();
      return;
    }
    try {
      const paintingIsAvailable = await getIsPaintingAvailable(painting.airtableId);
      if (!paintingIsAvailable) {
        window.alert("Sorry, this painting is no longer available.");
        navigate("/gallery");
        return;
      }
      const res = await emailjs.send(serviceId, templateId, emailTemplate, {
        publicKey,
      });
      if (res.status < 200 || res.status >= 300) {
        onFormSubmitError();
      } else {
        updatePaintingAirtable(painting.airtableId, getPickupOptionFromCascaderValue(pickupValue as any));
        window.alert("Thank you! Your adoption is being processed.");
        navigate("/after-adoption")
      }
    } catch (e) {
      console.error(e);
      onFormSubmitError();
    }
  }

  return (
    <div className="pt-8">
      <Form
        style={{ maxWidth: "min(600px, 100%)" }}
        form={form}
        onFinish={onSubmit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinishFailed={onFormSubmitError}
      >
        <Form.Item
          name="name"
          label="Your Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'not a valid email',
            },
            {
              required: true,
              message: 'Email is required',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              type: 'regexp',
              pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
              message: 'Not a valid phone number',
            },
            {
              required: true,
              message: 'Phone is required',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div id="donation" style={{ width: "min(650px, 100%)" }}>
          <Divider className="border-slate-400" orientation="left">Adoption fee</Divider>
        </div>
        {
          painting ? (
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col">
                <div className="flex flex-col w-1/2">
                  <div className="flex space-x-2 text-base" style={{ width: "min(500px, 80%)" }}>
                    <div className="font-bold">
                      Adoption fee:
                    </div>
                    <div>
                      {`$${getPriceFromDamageLevel(painting.damageLevel)} CAD`}
                    </div>
                  </div>
                  <DamageLevelInfoButton selectedDamageLevel={painting.damageLevel}>{`Damage level ${painting.damageLevel}`}</DamageLevelInfoButton>
                </div>
                <div className="italic">
                  <DamageInformation damageLevel={painting.damageLevel}/>
                </div>
              </div>
              {
                getPriceFromDamageLevel(painting.damageLevel) === 100 && (
                  <div className="pt-4">
                    <Form.Item
                      name="priceOption"
                      style={{ width: "min(700px, 100%)" }}
                    >
                      <Radio.Group defaultValue={PriceOption.Personal}>
                        <Space direction="vertical">
                          <Radio value={PriceOption.Personal}>I will send an e-transfer or Paypal of $100.</Radio>
                          <Radio value={PriceOption.Business}>I will send an e-transfer or Paypal of $200 because I plan to display this work at my place of business and will deduct 100% of the cost of this work on my business taxes next year.</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                )
              }
              <div className="ml-4" style={{ width: "min(650px, 100%)" }}>
                <p>Please watch for a confirmation email with e-transfer and Paypal details.</p>
                <div className="pt-2">
                  <Form.Item
                    name="transferOption"
                    style={{ width: "min(700px, 100%)" }}
                  >
                    <Radio.Group defaultValue={TransferOption.Etransfer}>
                      <Space direction="vertical">
                        <Radio value={TransferOption.Etransfer}>I plan to pay by e-transfer.</Radio>
                        <Radio value={TransferOption.Paypal}>I plan to pay by Paypal.</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div className="text-sm flex flex-col justify-center">
                <div>
                  The adoption fee is based on the painting's damage level.
                </div>
              </div>
              <Button type="link">
                <NavLink to="/pricing">
                  More info
                </NavLink>
              </Button>
            </div>
          )
        }
        <div id="pickup" style={{ width: "min(650px, 100%)" }}>
          <Divider className="border-slate-400" orientation="left">Pickup / shipping</Divider>
        </div>
        <Form.Item
          name="pickupOption"
          className="ml-8"
          rules={[
            { required: true, message: 'Pickup or shipping option is required' },
          ]}
        >
          <Cascader
            placeholder="Select a pickup or shipping option"
            options={[
              {
                value: 'Pickup in Victoria BC',
                label: 'Pickup in Victoria BC',
                children: [
                  {
                    value: PickupOption.InPersonMay17,
                    label: 'Friday May 17, 11am-2pm',
                  },
                  {
                    value: PickupOption.InPersonJune1,
                    label: 'Saturday June 1, noon-3pm',
                  },
                  {
                    value: PickupOption.AlternateDate,
                    label: 'Alternate Date',
                  },
                ],
              },
              {
                value: 'Shipping',
                label: 'Shipping',
                children: [
                  {
                    value: PickupOption.ShipCanada,
                    label: 'Ship within Canada',
                  },
                  {
                    value: PickupOption.ShipInternational,
                    label: 'Ship internationally',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <div className="flex justify-center pb-4">
          <div style={{ width: "min(500px, 100%)" }}>
            {getPickupOptionSubtitle(pickupValue as any)}
          </div>
        </div>
        {
          (getPickupOptionFromCascaderValue(pickupValue as any) === PickupOption.ShipCanada || getPickupOptionFromCascaderValue(pickupValue as any) ===PickupOption.ShipInternational) && (
            <Form.Item
              name="address"
              label="Shipping Address"
              rules={[
                {
                  required: true,
                  message: 'Shipping address is required',
                },
              ]}
            >
              <Input />
            </Form.Item>
          )
        }
        <div id="acknowledgement" style={{ width: "min(650px, 100%)" }}>
          <Divider className="border-slate-400" orientation="left">Acknowledgement</Divider>
        </div>
        <Form.Item
          name="acknowledgeDamage"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Acknowledgement is required')),
            },
          ]}
        >
          <Checkbox>
            <div className="ml-4 font-bold" style={{ width: "min(650px, 80vw)" }}>
              I acknowledge that the artwork I am adopting has some degree of damage and am aware that this damage may or may not include mold spores. I agree that I am accepting the artwork “as is” and will not hold the Gordaneer estate or family responsible for any negative impact that may result.
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item className="pt-4 flex justify-center">
          <div>
            <Button type="primary" htmlType="submit" disabled={!submittable || !painting}>
              Submit
            </Button>
            {
              !painting && (
                <div className="text-sm mt-4 text-slate-500 w-fit text-nowrap">
                  Please <a href="#painting-selection">select a painting</a> to adopt.
                </div>
              )
            }
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}