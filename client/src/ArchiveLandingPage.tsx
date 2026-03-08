import { Button, Card } from "antd";
import GiftShopCard from "./GiftShopCard";
import { NavLink } from "react-router-dom";

export default function ArchiveLandingPage() {
  return (
      <div className="flex-1 min-h-0 bg-cover bg-center px-4 lg:pl-20 lg:mx-0 mx-auto"
           style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)'}}>
        <div className="py-6 space-y-6 flex-1">
            <Card key="welcome" style={{ maxWidth: "950px", borderRadius: "unset" }}>
              <div className="text-lg font-semibold py-2">The James Gordaneer Archive</div>
              <div className="italic pb-6">Documenting and sharing the work of Canadian artist James Gordaneer, RCA.</div>
              <div className="flex flex-shrink-0 space-x-4">
                <div className="flex flex-col space-y-2">
                  <div>Welcome.</div>
                  <div>
                    This digital archive documents the work of James Gordaneer, RCA, (1933–2016), one of British Columbia’s most prolific painters and a beloved art instructor in Victoria, B.C.
                    Over six decades, Gordaneer created thousands of oil paintings, acrylics, and watercolours distinguished by their rich colour, emotional intensity, and bold abstract forms.
                  </div>
                  <div>
                    Over his six-decade career, Gordaneer’s artistic style continually evolved, from early influences shaped by mentorship from notable Canadian artists including members of the Group of Seven and Painters Eleven, to later explorations shaped by travel, philosophy, and collaboration. Gordaneer developed his own distinct visual language that encompassed abstract expressionism, figurative work, nudes, landscapes, and dynamic series work that focused on topics like “Heads,” “Circus” and the landscape and communities of Victoria, BC. His art has been exhibited nationally and internationally, and is represented in major public and private collections across Canada and throughout the world.
                  </div>
                  <div>
                    This archive documents and shares Gordaneer’s artistic legacy, offering free digital access to the works it showcases. We invite friends, former students and colleagues, collectors, and new viewers alike to explore Gordaneer’s artistic vision, determination and passion for painting.
                  </div>
                </div>
              </div>
            </Card>
            <Card key="welcome" style={{ maxWidth: "950px", borderRadius: "unset" }}>
              <div className="text-lg font-semibold py-2">Virtual Exhibitions</div>
              <div className="flex flex-shrink-0 space-x-4 pt-4">
                <div className="flex flex-col space-y-3">
                  <div>During limited-time virtual exhibitions, selected pieces will be available to purchase. </div>
                  <div>
                    <Button type="primary" ghost>
                      <NavLink to="/archive/contact#newsletter-signup">
                        Sign up for updates
                      </NavLink>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            <GiftShopCard />
            <Card key="welcome" style={{ maxWidth: "950px", borderRadius: "unset" }}>
              <div className="text-lg font-semibold py-2">About this archive</div>
              <div className="flex flex-shrink-0 space-x-4 pt-4">
                <div className="flex flex-col space-y-2">
                  <div>This archive was compiled in 2024-2026 by Alisa Gordaneer and Morgan Brooks, with additional support from John Barton and Joseph Hoh.</div>
                  <div>
                    The goal of this project is to document every known work created by artist James Gordaneer during his lifetime, 1933-2016. While there are numerous paintings presented here, there are many more in public and private collections that we have not been able to include. We welcome additions to the archive - please contact us to have your painting’s image included.
                  </div>
                  <div>
                    All images copyright James Gordaneer Estate.
                  </div>
                </div>
              </div>
            </Card>
        </div>
      </div>
  );
}