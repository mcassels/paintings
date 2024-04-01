// import { useForm } from "react-hook-form"
// import emailjs from '@emailjs/browser';
import { usePaintings } from "./usePaintings";
import { useLocation, useNavigate } from "react-router";
import { Form, Input, Button, Spin, Divider, Cascader, Checkbox, Table } from 'antd';
import { NavLink } from "react-router-dom";
// const FormItem = Form.Item;
// const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;

// Name
// Address
// Phone number
// Email

// I would like to adopt this painting [can it correspond to the number somehow?]. 
// - I have sent an e-transfer of $100
// [or] 
// - I have sent an e-transfer of $200 because I plan to display this work at my place of business and will deduct 100% of the cost of this work on my business taxes next year.

// Send e-transfers to gordaneer@gmail.com

// [pick one]
// - I, or my representative, will pick up the work in person in Victoria on the following (pick one).

// 	May 17, 1pm-3pm 
// May 18, noon-3pm. 

// - I am unable to pick up the work in person on either of the set days. Please contact me once you have decided on an alternate pickup date.

// - I am unable to pick up the work in person and would like to have it shipped within Canada. I have included the $20 processing fee in my e-transfer. Please contact me to arrange COD for the shipping cost.

// - I am unable to pick up the work in person and would like to have it shipped internationally. I will e-transfer any applicable fees once they are determined. 

// [required] 
// I acknowledge that the artwork I am adopting has some degree of damage and am aware that this damage may or may not include mold spores. I agree that I will not hold the Gordaneer estate or family responsible for any negative impact that may result. 

// enum PriceOption {
//   Personal = 'Personal',
//   Business = 'Business',
// }

enum PickupOption {
  InPersonMay17 = 'InPersonMay17',
  InPersonMay18 = 'InPersonMay18',
  AlternateDate = 'AlternateDate',
  ShipCanada = 'ShipCanada',
  ShipInternational = 'ShipInternational',
}

// interface PickupRadioButtonProps {
//   value: PickupOption;
//   label: string;
// }
// function PickupRadioButton(props: PickupRadioButtonProps) {
//   const { value, label } = props;
//   return (
//     <div className="radio-button-wrapper">
//       <div className="labelcol">
//         <input name="pickupOption" type="radio" id={value} value={value} />
//       </div>
//       <label className="inputcol" htmlFor={value}>{label}</label>
//     </div>
//   )
// }

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
      return "I will pick up the work in person in Victoria on May 17, 1pm-3pm";
    case PickupOption.InPersonMay18:
      return "I will pick up the work in person in Victoria on May 18, noon-3pm";
    case PickupOption.AlternateDate:
      return "I am unable to pick up the work in person on either of the set days. Please contact me once you have decided on an alternate pickup date.";
    case PickupOption.ShipCanada:
      return "I am unable to pick up the work in person and would like to have it shipped within Canada. I have included the $20 processing fee in my e-transfer. Please contact me to arrange COD for the shipping cost.";
    case PickupOption.ShipInternational:
      return "I am unable to pick up the work in person and would like to have it shipped internationally. I will e-transfer any applicable fees once they are determined.";
  }
  return null;
}

function getPriceFromDamageLevel(damageLevel: number): number {
  let price = 500; // damage level 1
  if (damageLevel > 1 && damageLevel <= 2) {
    price = 300;
  } else if (damageLevel > 2 && damageLevel <= 3) {
    price = 200;
  } else if (damageLevel > 3) {
    price = 100;
  }
  return price;
}

function PriceTable() {
  const dataSource = Array.from(Array(5).keys()).map((idx) => {
    const damageLevel = idx + 1;
    const price = getPriceFromDamageLevel(damageLevel);

    return {
      key: damageLevel,
      damageLevel: `Damage level ${damageLevel}`,
      price: `$${price}`,
      browse: (
        <Button type="link">
          <NavLink to={`/gallery?damage_min=${damageLevel}&damage_max=${damageLevel}`}>
            Browse paintings
          </NavLink>
        </Button>
      ),
    }
  })
  
  const columns = [
    {
      title: 'Damage level',
      dataIndex: 'damageLevel',
      key: 'damageLevel',
    },
    {
      title: 'Donation amount',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Browse paintings',
      dataIndex: 'browse',
      key: 'browse',
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  )
}

interface ContactFormInputs {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  // priceOption: PriceOption;
  pickupOption: PickupOption;
  acknowledgeDamage: boolean;
  etransferSent: boolean;
}

// TODO: autoselect specific painting based on query params
export default function AdoptionForm() {
  const [form] = Form.useForm<ContactFormInputs>();
  const pickupValue = Form.useWatch('pickupOption', form);

  const navigate = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);


  function onFormSubmitError() {
    window.alert("Error submitting form! Please contact gordaneer@gmail.com");
    navigate("/");
  }

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isValid },
  // } = useForm<ContactFormInputs>();

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
    // if (!formRef.current) {
    //   onFormSubmitError();
    //   return;
    // }
    return;
    // const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    // const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    // const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    // // Keys must correspond to template fields set up in emailjs template
    // const emailTemplate = {
    //   name: data.name,
    //   address: data.address,
    //   phone: data.phoneNumber,
    //   email: data.email,
    //   bpid: data.paintingId,
    //   price_option: data.priceOption,
    //   pickup_option: data.pickupOption,
    //   painting_name: Array.isArray(paintings) && paintings.find((p) => p.id === data.paintingId)?.title,
    // };
    // if (!serviceId || !templateId) {
    //   onFormSubmitError();
    //   return;
    // }
    // try {
    //   const res = await emailjs.send(serviceId, templateId, emailTemplate, {
    //     publicKey,
    //   });
    //   if (res.status < 200 || res.status >= 300) {
    //     onFormSubmitError();
    //   } else {
    //     window.alert("Your adoption has been submitted!");
    //     navigate("/after-adoption")
    //   }
    // } catch (e) {
    //   console.error(e);
    //   onFormSubmitError();
    // }
  }

  return (
    <div className="pt-8">
        {/* <form onSubmit={handleSubmit(onSubmit)} ref={oldRef}>
          <div className="form-wrapper">
            <label className="labelcol">Painting</label>
            <div className="inputcol">
              <select {...register("paintingId", { required: true })} defaultValue={selectedPaintingId || ""}>
                {paintingOptions}
              </select>
              <p>{errors.paintingId?.message}</p>
            </div>
            <label className="labelcol">Name:</label>
            <div className="inputcol">
              <input placeholder="Name" type="text" {...register("name", { required: true })} aria-invalid={errors.name ? "true" : "false"} />
              {errors.name?.type === "required" && (
                <p role="alert">Name is required</p>
              )}
            </div>
            <label className="labelcol">Address:</label>
            <input placeholder="Address" className="inputcol" type="text" {...register("address")} />
            <label className="labelcol">Phone Number</label>
            <div className="inputcol">
              <input placeholder="Phone Number" type="tel" {...register("phoneNumber", { validate: (phone) => phone.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im) !== null})} />
              {errors.phoneNumber && (<p>{errors.phoneNumber.message}</p>)}
            </div>
            <label className="labelcol">Email</label>
            <div className="inputcol">
              <input placeholder="Email" type="email" {...register("email", { validate: (email) => email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null, required: true })} />
              {errors.email && (<p>{errors.email.message}</p>)}
            </div>
          </div>
          <div className="pt-4 mt-4 mb-4 w-[650px] text-left border-y-1 border-x-0 border-solid border-[#BCC4C4]">
            Payment -- choose one:
            <fieldset className="border-none space-y-2" {...register("priceOption", { required: true })}>
              <div className="radio-button-wrapper">
                <div className="labelcol">
                  <input name="priceOption" type="radio" id={PriceOption.Personal} value={PriceOption.Personal} defaultChecked />
                </div>
                <label className="inputcol" htmlFor={PriceOption.Personal}>I have sent an e-transfer of $100</label>
              </div>
              <div className="radio-button-wrapper">
                <div className="labelcol">
                  <input name="priceOption" type="radio" id={PriceOption.Business} value={PriceOption.Business} />
                </div>
                <label className="inputcol" htmlFor={PriceOption.Business}>
                  I have sent an e-transfer of $200 because I plan to display this work at my place of business and will deduct 100% of the cost of this work on my business taxes next year.
                </label>
              </div>
            </fieldset>
            <div>
              <p>Please send e-transfers to <a href="mailto:gordaneer@gmail.com">gordaneer@gmail.com</a>.</p>
            </div>
          </div>
          <div className="mb-4 pb-4 w-[650px] text-left border-y-1 border-t-0 border-x-0 border-solid border-[#BCC4C4]">
            Pickup -- choose one:
            <fieldset className="border-none space-y-2" {...register("pickupOption", { required: true })}>
              <div className="radio-button-wrapper">
                <div className="labelcol">
                  <input name="pickupOption" type="radio" id={PickupOption.InPersonMay17} value={PickupOption.InPersonMay17} defaultChecked />
                </div>
                <label className="inputcol" htmlFor={PickupOption.InPersonMay17}>I will pick up the work in person in Victoria on May 17, 1pm-3pm</label>
              </div>
              <PickupRadioButton value={PickupOption.InPersonMay18} label="I will pick up the work in person in Victoria on May 18, noon-3pm" />
              <PickupRadioButton value={PickupOption.AlternateDate} label="I am unable to pick up the work in person on either of the set days. Please contact me once you have decided on an alternate pickup date." />
              <PickupRadioButton value={PickupOption.ShipCanada} label="I am unable to pick up the work in person and would like to have it shipped within Canada. I have included the $20 processing fee in my e-transfer. Please contact me to arrange COD for the shipping cost." />
              <PickupRadioButton value={PickupOption.ShipInternational} label="I am unable to pick up the work in person and would like to have it shipped internationally. I will e-transfer any applicable fees once they are determined." />
            </fieldset>
            {errors.pickupOption && (<p>{errors.pickupOption?.message}</p>)}
          </div>
        <div className="text-left">
          <div className="pb-4">Acknowledgment</div>
          <div className="radio-button-wrapper">
            <div className="labelcol">
              <input type="checkbox" {...register("acknowledgeDamage", { required: true })} />
            </div>
            <div className="inputcol">
              I acknowledge that the artwork I am adopting has some degree of damage and am aware that this damage may or may not include mold spores. I agree that I will not hold the Gordaneer estate or family responsible for any negative impact that may result. 
            </div>
            {errors.acknowledgeDamage && (<p>{errors.acknowledgeDamage?.message}</p>)}
          </div>
          <div className="pt-4">
            <button type="submit" disabled={!isValid}>Submit</button>
          </div>
        </div>
      </form> */}
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
          <Divider className="border-slate-400" orientation="left">Donation</Divider>
        </div>
        {
          painting && (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-center">
                <div className="flex flex-col w-1/2">
                  <div className="w-[500px] flex space-x-2 text-base">
                    <div className="font-bold">
                      Adoption amount:
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
                <div className="text-sm">
                  Refer to table below showing adoption amounts based on damage level.
                </div>
              </div>
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
            </div>
          )
        }
        <div className="py-4">
          <PriceTable />
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
                    label: 'May 17, 1pm-3pm',
                  },
                  {
                    value: PickupOption.InPersonMay18,
                    label: 'May 18, noon-3pm',
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
            {/* TODO: figure out how to send only the leaf nodes as selected in cascader */}
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
            <div className="w-[650px] ml-4">
              I acknowledge that the artwork I am adopting has some degree of damage and am aware that this damage may or may not include mold spores. I agree that I will not hold the Gordaneer estate or family responsible for any negative impact that may result. 
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item className="pt-4" wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}