import ContactUsForm from "./ContactUsForm";
import GiftShopCard from "./GiftShopCard";

export default function ShopPage() {
  return (
    <div
      className="flex-1 min-h-0 bg-cover bg-center px-4 lg:pl-20 lg:mx-0 mx-auto"
      style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)' }}
    >
      <div className="flex flex-col space-y-8 py-6">
        <GiftShopCard />
        <div className="bg-white max-w-[800px]">
          <div className="p-[24px]">
            <h1 className="text-lg font-semibold py-1">Interested in purchasing a painting?</h1>
            <p>If you are interested in acquiring a work by James Gordaneer, please send us a message and we will get back to you.</p>
          </div>
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
}
