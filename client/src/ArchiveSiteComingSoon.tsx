import { Button, Card, Image } from "antd";
import { NavLink } from "react-router-dom";
import { getIsMobile } from "./utils";
import { Header } from "antd/es/layout/layout";
import AppFooter from "./AppFooter";
import ContactUsModal from "./ContactUsModal";


export default function ArchiveSiteComingSoon() {

  // TODO: implement layout for mobile
  const isMobile = getIsMobile();

  return (
    <div className="min-h-svh flex flex-col items-stretch">
      <ContactUsModal />
      <Header className="bg-[#193259] text-white flex flex-col text-3xl p-10 h-fit mb-6">
        <div className="flex flex-col pl-20">
          <div> James Gordaneer, RCA</div>
          <div className="text-sm flex pt-4 italic">
            Digital archive coming soon.
          </div>
        </div>
      </Header>
      <div className="flex-1 pl-16 space-y-6">
        <div className="pt-2 p-10 w-[800px]">
          <div className="pl-4">
            The James Gordaneer Painting Adoption project took place from April to May, 2024. More than 100 works were included.
          </div>
          <div>
            <Button type="link" ghost>
              <NavLink to="/adoption-project" target="_blank">
                <div>
                  Visit the Adoption Project collection
                  <i className="fa-solid fa-up-right-from-square pl-2"></i>
                </div>
              </NavLink>
            </Button>
          </div>
        </div>
        <Card key="about-jim" style={{ width: "min(95%, 800px)"}}>
          <div className="h-[300px]">
            <div className="h-full flex flex-shrink-0 space-x-4">
              <Image
                title="jim-self-portrait"
                alt="jim-self-portrait"
                preview={false}
                src="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/jim-self-portrait.jpeg"
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <div className="pt-2 p-10 pl-5">
                <div className="text-lg font-semibold pb-2">About the artist</div>
                <div>Between 1950 and 2016, noted Canadian abstract expressionist James Gordaneer created thousands of paintings. This archive aims to showcase as many of those images as possible. Stay tuned for more.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <AppFooter />
    </div>
  );
}