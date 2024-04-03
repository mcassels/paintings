import emailjs from '@emailjs/browser';
import { usePaintings } from "./usePaintings";
import { useLocation, useNavigate } from "react-router";
import { Form, Input, Button, Spin, Divider, Cascader, Checkbox, Radio, Space } from 'antd';
import { useEffect, useState } from "react";
import { areAdoptionsOpen, getPriceFromDamageLevel } from './utils';
import PriceTable from './PriceTable';
import { NavLink } from 'react-router-dom';

enum PriceOption {
  Personal = 'Personal',
  Business = 'Business',
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
      return "I am unable to pick up the work in person and would like to have it shipped within Canada. I have included the $20 processing fee in my e-transfer. Please contact me to arrange COD for the shipping cost.";
    case PickupOption.ShipInternational:
      return "I am unable to pick up the work in person and would like to have it shipped internationally. I will e-transfer any applicable fees once they are determined.";
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
  etransferSent: boolean;
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
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (paintings === 'error') {
    return <div className="loading">Error loading paintings</div>;
  }

  const paintingId = searchParams.get('painting');
  const painting = paintings.find((p) => p.id === paintingId);

  async function onSubmit(data: ContactFormInputs) {
    if (!painting) {
      onFormSubmitError();
      return;
    }
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    const pickupOption = getPickupOptionSubtitle(pickupValue as any);

    let price = getPriceFromDamageLevel(painting.damageLevel);
    if (data.priceOption === PriceOption.Business) {
      price = 200;
    }

    // Keys must correspond to template fields set up in emailjs template
    const emailTemplate = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      bpid: painting.id,
      price: price,
      pickup_option: pickupOption,
      painting_name: painting.title,
      is_business: data.priceOption === PriceOption.Business,
    };
    if (!serviceId || !templateId) {
      onFormSubmitError();
      return;
    }
    try {
      const res = await emailjs.send(serviceId, templateId, emailTemplate, {
        publicKey,
      });
      if (res.status < 200 || res.status >= 300) {
        onFormSubmitError();
      } else {
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
        style={{ maxWidth: 600 }}
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
        <div id="donation" className="w-[650px]">
          <Divider className="border-slate-400" orientation="left">Adoption fee</Divider>
        </div>
        {
          painting ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-center">
                <div className="flex flex-col w-1/2">
                  <div className="w-[500px] flex space-x-2 text-base">
                    <div className="font-bold">
                      Adoption fee:
                    </div>
                    <div>
                      {`$${getPriceFromDamageLevel(painting.damageLevel)} CAD`}
                    </div>
                  </div>
                  <div className="w-[500px] flex space-x-2 text-base">
                    <div>
                      {`(Damage level ${painting.damageLevel})`}
                    </div>
                  </div>
                </div>
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
              </div>
              {
                getPriceFromDamageLevel(painting.damageLevel) === 100 ? (
                  <div className="pt-4">
                    <Form.Item
                      name="priceOption"
                      className="w-[700px]"
                      rules={
                        [
                          { required: true, message: 'Selection is required' },
                        ]
                      }
                    >
                      <Radio.Group value={PriceOption.Personal}>
                        <Space direction="vertical">
                          <Radio value={PriceOption.Personal}>I have sent an e-transfer of $100</Radio>
                          <Radio value={PriceOption.Business}>I have sent an e-transfer of $200 because I plan to display this work at my place of business and will deduct 100% of the cost of this work on my business taxes next year.</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    <div><p>Please send e-transfers to <a href="mailto:gordaneer@gmail.com">gordaneer@gmail.com</a>.</p></div>
                  </div>
                ) : (
                  <Form.Item
                    name="etransferSent"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value ? Promise.resolve() : Promise.reject(new Error('Please send an etransfer in order to adopt the painting')),
                      },
                    ]}
                  >
                    <Checkbox>
                      <div className="w-[650px] ml-4">
                      <p>{`I have sent an e-transfer of $${getPriceFromDamageLevel(painting.damageLevel)} to `}<a href="mailto:gordaneer@gmail.com">gordaneer@gmail.com</a>.</p> 
                      </div>
                    </Checkbox>
                  </Form.Item>
                )
              }
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
        <div className="py-4">
          <PriceTable selectedDamageLevel={painting?.damageLevel}/>
        </div>
        <div id="pickup" className="w-[650px]">
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
          <div className="w-[500px]">
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
        <div id="acknowledgement" className="w-[650px]">
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
            <div className="w-[650px] ml-4 font-bold">
              I acknowledge that the artwork I am adopting has some degree of damage and am aware that this damage may or may not include mold spores. I agree that I am accepting the artwork “as is” and will not hold the Gordaneer estate or family responsible for any negative impact that may result. 
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item className="pt-4" wrapperCol={{ offset: 6, span: 16 }}>
          {
            areAdoptionsOpen() ? (
              <div>
                <Button type="primary" htmlType="submit" disabled={!submittable || !painting}>
                  Submit
                </Button>
                {
                  !painting && (
                    <div className="text-sm mt-4 text-slate-500">
                      Please <a href="#painting-selection">select a painting</a> to adopt.
                    </div>
                  )
                }
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button type="primary" htmlType="submit" disabled={true}>
                  Submit
                </Button>
                <div className="text-red-500 align-middle">
                  Adoptions open April 10th!
                </div>
              </div>
            )
          }
        </Form.Item>
      </Form>
    </div>
  );
}