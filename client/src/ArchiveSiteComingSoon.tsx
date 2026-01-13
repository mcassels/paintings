import { Button, Badge } from "antd";
import { NavLink } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import AppFooter from "./AppFooter";
import ContactUsModal from "./ContactUsModal";
import ProjectCardResponsive from "./ProjectCardResponsive";


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
              <ProjectCardResponsive
                title="2026 calendar and blank greeting cards"
                description="Featuring the artwork of James Gordaneer, the 2026 Art of Victoria calendar supports the James Gordaneer Legacy Award. Blank greeting cards featuring some of Gordaneer’s iconic Victoria landscapes are perfect for any occasion."
                imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/calendar.webp"
                imageAlt="calendar"
                orientation="vertical"
                extraContent={
                  <div className="">
                    <Button type="primary" ghost>
                      <NavLink to="https://www.etsy.com/ca/shop/JamesGordaneerArt" target="_blank">
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
          <SectionHeader text="Projects" />
          <ProjectCardResponsive
            title="Digital archive (Launching 2026)"
            description="Between 1950 and 2016, noted Canadian abstract expressionist James Gordaneer created thousands of paintings. This digital archive aims to document as many of these works as possible, to share Gordaneer’s work with art lovers and students in Canada and around the world. Stay tuned for more."
            imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/paintings_archive.webp"
            imageAlt="painting-of-armchair-by-window"
          />
          <ProjectCardResponsive
            title="Painting adoption project"
            description="The James Gordaneer Painting Adoption project took place from April to May, 2024. The project raised funds in support of the James Gordaneer Legacy Award, a scholarship given annually by the Victoria Visual Artists Legacy Society to a Camosun College Visual Arts student. More than 100 works were included."
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