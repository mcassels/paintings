import ContactUsForm from "./ContactUsForm";

export default function ContactPage() {
  return (
    <div className="text-pretty p-4">
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">Get in touch</h1>
          <p className="max-w-[900px]">
            If you have a James Gordaneer work, are interested in acquiring one, or
            have any other questions, please send us a message.
          </p>
        </div>
        <div className="w-[800px] max-w-[95%]">
          <ContactUsForm />
        </div>
      </div>
    </div>
  )
}