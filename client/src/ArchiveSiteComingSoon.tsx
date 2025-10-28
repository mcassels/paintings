import { Button, Card, Image, Badge } from "antd";
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

function ProjectCard(props: { title: string; description: string; imageUrl: string; imageAlt: string; extraContent?: React.ReactNode }) {
  const { title, description, imageUrl, imageAlt, extraContent } = props;
  return (
    <Card key={title} style={{ maxWidth: "950px"}}>
      <div className="h-[150px]">
        <div className="h-full flex flex-shrink-0 space-x-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={imageUrl}
            style={{
              height: "100%",
              width: "auto",
              objectFit: "contain",
            }}
          />
          <div className="pt-2 pl-1 flex flex-col justify-between">
            <div className="pt-2 pl-4">
              <div className="text-lg font-semibold pb-2">{title}</div>
              <div>{description}</div>
            </div>
            {extraContent}
          </div>
        </div>
      </div>
    </Card>
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
           style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)'}}>
        <div className="py-6 space-y-6 flex-1">
          <div className="py-4">
            <Badge.Ribbon text="On sale now!" color="blue" placement="start">
              <ProjectCard
                title="Calendar and card sale"
                description="Support the James Gordaneer Legacy Award by purchasing a 2026 calendar or a set of greeting cards featuring the artwork of James Gordaneer."
                imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/calendar.webp"
                imageAlt="calendar"
                extraContent={
                  <div className="pl-4">
                    <Button type="primary" ghost>
                      <NavLink to="https://www.etsy.com/shop/jamesgordaneerart/" target="_blank">
                        <div>
                          Browse the shop
                          <i className="fa-solid fa-up-right-from-square pl-2"></i>
                        </div>
                      </NavLink>
                    </Button>
                  </div>
                }
              />
            </Badge.Ribbon>
          </div>
          <SectionHeader text="Other projects" />
          <ProjectCard
            title="Digital archive (coming soon!)"
            description="Between 1950 and 2016, noted Canadian abstract expressionist James Gordaneer created thousands of paintings. This archive aims to document as many of these works as possible. Stay tuned for more."
            imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/armchair_window_painting.webp"
            imageAlt="painting-of-armchair-by-window"
          />
          <ProjectCard
            title="Painting adoption project"
            description="The James Gordaneer Painting Adoption project took place April to May, 2024. The project raised funds in support of the James Gordaneer Legacy Award, a scholarship given annually to a Camosun College Visual Arts student. More than 100 works were included."
            imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/paintings-under-tarp.webp"
            imageAlt="paintings-under-tarp"
            extraContent={
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
            }
          />
        </div>
      </div>
      <AppFooter />
    </div>
  );
}