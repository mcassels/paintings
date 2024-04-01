// import { useForm } from "react-hook-form"
// import emailjs from '@emailjs/browser';
import { useRef } from "react";
import { usePaintings } from "./usePaintings";
import { useLocation, useNavigate } from "react-router";
import { Form, Input, Button, FormInstance, Image, Spin } from 'antd';
import BrowsePaintingsButton from "./BrowsePaintingsButton";
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

enum PriceOption {
  Personal = 'Personal',
  Business = 'Business',
}

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

interface ContactFormInputs {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  priceOption: PriceOption;
  pickupOption: PickupOption;
  acknowledgeDamage: boolean;
}

// TODO: autoselect specific painting based on query params
export default function AdoptionForm() {
  const formRef = useRef<FormInstance|null>(null);

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
    if (!formRef.current) {
      onFormSubmitError();
      return;
    }
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

  // const params = new URLSearchParams(location.search);
  // const selectedPaintingId = params.get('painting');

  const paintingOptions = [<option key="default" value="">Select a painting</option>];
  for (const painting of paintings.sort((p0, p1) => {
    return Number(p0.id.substring(2)) - Number(p1.id.substring(2));
  })) {
    paintingOptions.push(<option key={painting.id} value={painting.id}>{`${painting.title} (id: ${painting.id})`}</option>);
  }

  // TODO: organize into sections with divider
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
      { painting ? (
        <div>
          <div>
            <h2>{painting.title}</h2>
            <p>{painting.year}</p>
            <p>{painting.medium}</p>
            <p>{painting.damageLevel}</p>
            <p>{painting.conditionNotes}</p>
          </div>
          <Image
            width={painting.width}
            height={painting.height}
            src={painting.frontPhotoUrl}
          />
        </div>
      ) : <BrowsePaintingsButton />}
      <Form
        style={{ maxWidth: 600 }}
        ref={formRef}
        onFinish={onSubmit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinishFailed={onFormSubmitError}
      >
        <div className="bg-red-500 h-[20px] m-8 text-white font-bold p-4">
          Hi! FORM IS CURRENTLY UNDER CONSTRUCTION -Morgan
        </div>
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
              message: 'The input is not a valid email',
            },
            {
              required: true,
              message: 'Email is required',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="InputNumber"
          name="InputNumber"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Mentions"
          name="Mentions"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <Mentions />
        </Form.Item>

        <Form.Item label="Select" name="Select" rules={[{ required: true, message: 'Please input!' }]}>
          <Select />
        </Form.Item>

        <Form.Item
          label="Cascader"
          name="Cascader"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <Cascader />
        </Form.Item>

        <Form.Item
          label="TreeSelect"
          name="TreeSelect"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <TreeSelect />
        </Form.Item>

        <Form.Item
          label="DatePicker"
          name="DatePicker"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="RangePicker"
          name="RangePicker"
          rules={[{ required: true, message: 'Please input!' }]}
        >
          <RangePicker />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}