import { Button, Card, Image } from "antd";
import { NavLink } from "react-router-dom";
// import { getIsMobile } from "./utils";
import { Header } from "antd/es/layout/layout";
import AppFooter from "./AppFooter";
import ContactUsModal from "./ContactUsModal";


export default function ArchiveSiteComingSoon() {

  // TODO: implement layout for mobile
  // const isMobile = getIsMobile();

  return (
    <div className="min-h-svh flex flex-col items-stretch">
      <ContactUsModal />
      <Header className="bg-white flex flex-col text-4xl p-10 h-fit">
        <div className="flex flex-col pl-20 font-light">
          James Gordaneer, RCA
        </div>
      </Header>
      <div className="relative flex-1 min-h-0 pl-16 bg-cover bg-center"
           style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/morning_stretch_1987.jpeg)'}}>
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="py-6 space-y-6 flex-1">
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
                  <div className="text-lg font-semibold pb-2">Digital archive coming soon</div>
                  <div>Between 1950 and 2016, noted Canadian abstract expressionist James Gordaneer created thousands of paintings. This archive aims to showcase as many of those images as possible. Stay tuned for more.</div>
                </div>
              </div>
            </div>
          </Card>
          <Card key="past-projects" style={{ width: "min(95%, 800px)"}}>
            <div className="h-[180px]">
              <div className="h-full flex flex-shrink-0 space-x-4">
                <Image
                  title="paintings-under-tarp"
                  alt="paintings-under-tarp"
                  preview={false}
                  src="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/paintings-under-tarp.jpeg"
                  style={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <div className="pt-2 p-10 pl-1 flex flex-col justify-between">
                  <div className="pl-4">
                    <div className="text-lg font-semibold pb-2">Past projects</div>
                    <div>
                      The James Gordaneer Painting Adoption project took place from April to May, 2024. More than 100 works were included.
                    </div>
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
              </div>
            </div>
          </Card>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}