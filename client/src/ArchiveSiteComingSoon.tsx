import { Button, Card, Image } from "antd";
import { NavLink } from "react-router-dom";
// import { getIsMobile } from "./utils";
import { Header } from "antd/es/layout/layout";
import AppFooter from "./AppFooter";
import ContactUsModal from "./ContactUsModal";


function SectionHeader(props: { text: string }) {
  return (
    <div className="text-xl bg-white w-fit bg-opacity-75">
      <div className="p-2">
        {props.text}
      </div>
    </div>
  );
}

export default function ArchiveSiteComingSoon() {

  // TODO: implement layout for mobile
  // const isMobile = getIsMobile();

  return (
    <div className="min-h-svh flex flex-col items-stretch archive-site-coming-soon-page">
      <ContactUsModal />
      <Header className="bg-white flex flex-col text-4xl py-10 px-0 h-fit">
        <div className="flex flex-col font-light px-4 lg:pl-20">
          James Gordaneer, RCA
        </div>
      </Header>
      <div className="flex-1 min-h-0 bg-cover bg-center px-4 lg:pl-20 lg:mx-0 mx-auto"
           style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.jpeg)'}}>
        <div className="py-6 space-y-6 flex-1">
          <SectionHeader text="Upcoming projects" />
          <Card key="about-jim" style={{ width: "min(95%, 800px)"}}>
            <div className="h-[200px]">
              <div className="h-full flex flex-shrink-0 space-x-4">
                <Image
                  title="painting-of-armchair-by-window"
                  alt="painting-of-armchair-by-window"
                  preview={false}
                  src="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/armchair_window_painting.jpeg"
                  style={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <div className="pt-2 p-10 pl-5">
                  <div className="text-lg font-semibold pb-2">Digital archive (coming soon!)</div>
                  <div>Between 1950 and 2016, noted Canadian abstract expressionist James Gordaneer created thousands of paintings. This archive aims to document as many of these works as possible. Stay tuned for more.</div>
                </div>
              </div>
            </div>
          </Card>
          <SectionHeader text="Past projects" />
          <Card key="past-projects" style={{ width: "min(95%, 800px)"}}>
            <div className="h-[200px]">
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
                    <div className="text-lg font-semibold pb-2">Painting adoption project</div>
                    <div>
                      The James Gordaneer Painting Adoption project took place April to May, 2024. Over $XXXX was raised in support of the James Gordaneer Legacy Award, a scholarship given annually to a Camosun College Visual Arts student. More than 100 works were included.
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