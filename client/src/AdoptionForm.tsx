import { useForm, SubmitHandler } from "react-hook-form"
import emailjs from '@emailjs/browser';
import { useRef } from "react";
import { Painting } from "./types";
import { usePaintings } from "./usePaintings";
import { zoomies } from "ldrs";

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

function onFormSubmitError() {
  window.alert("Error submitting form! Please contact gordaneer@gmail.com");
}

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

interface ContactFormInputs {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  paintingId: string;
  priceOption: PriceOption;
  pickupOption: PickupOption;
  acknowledgeDamage: boolean;
}

// TODO: autoselect specific painting based on query params
export default function AdoptionForm() {
  const formRef = useRef<HTMLFormElement|null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  async function onSubmit(data: ContactFormInputs) {
    debugger;
    if (!formRef.current) {
      onFormSubmitError();
      return;
    }
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId) {
      onFormSubmitError();
      return;
    }
    // TODO: format message content
    const res = await emailjs.sendForm(serviceId, templateId, formRef.current, {
      publicKey,
    });
    if (res.status < 200 || res.status >= 300) {
      window.alert("Form submitted successfully!");
    }
  }

  const paintings = usePaintings();
  if (paintings === 'loading') {
    zoomies.register();
    return (
      <div className="loading">
        <l-zoomies/>
      </div>
    );
  }
  if (paintings === 'error') {
    return <div className="loading">Error loading paintings</div>;
  }

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <label>Name</label>
        <input {...register("name", { required: true })} />
        <label>Address</label>
        <input {...register("address")} />
        <label>Phone Number</label>
        <input {...register("phoneNumber", { validate: (phone) => phone.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im) !== null})} />
        <label>Email</label>
        <input {...register("email", { validate: (email) => email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null })} />
        <label>Painting</label>
        <select {...register("paintingId")}>
          {
            paintings.map((p) => {
              return <option value={p.id}>{p.title}</option>
            })
          }
        </select>
        <label>Price Option</label>
        <select {...register("priceOption")}>
          <option value={PriceOption.Personal}>Personal</option>
          <option value={PriceOption.Business}>Business</option>
        </select>
        <label>Pickup Option</label>
        <select {...register("pickupOption")}>
          <option value={PickupOption.InPersonMay17}>In Person May 17</option>
          <option value={PickupOption.InPersonMay18}>In Person May 18</option>
          <option value={PickupOption.AlternateDate}>Alternate Date</option>
          <option value={PickupOption.ShipCanada}>Ship Canada</option>
          <option value={PickupOption.ShipInternational}>Ship International</option>
        </select>
        <label>Acknowledge Damage</label>
        <input type="checkbox" {...register("acknowledgeDamage")} />
        <input type="submit" />
        </form>
    </div>
  );
}