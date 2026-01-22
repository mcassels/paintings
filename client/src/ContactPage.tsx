import ContactUsForm from "./ContactUsForm";
import { NewsletterSignup } from "./NewsletterSignup";

export default function ContactPage() {
  return (
    <div className="flex-1 min-h-0 bg-cover bg-center px-4 lg:pl-20 lg:mx-0 mx-auto"
    style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)'}}>
      <div className="flex flex-col space-y-8 py-6">
        <div className="max-w-[600px]">
          <NewsletterSignup />
        </div>
        <div className="bg-white max-w-[800px]">
          <div className="p-[24px]">
            <h1 className="text-lg font-semibold py-1">Contact us</h1>
            <p>If you have a James Gordaneer work, are interested in acquiring one, or
            have any other questions, please send us a message.</p>
          </div>
          <ContactUsForm />
        </div>
      </div>
    </div>
  )
}