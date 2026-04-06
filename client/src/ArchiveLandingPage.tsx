import { Button, Card } from "antd";
import { NavLink } from "react-router-dom";

export default function ArchiveLandingPage() {
  return (
    <div className="flex-1 min-h-0 bg-cover bg-center bg-fixed px-4 lg:pl-20 lg:mx-0 mx-auto"
         style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)' }}>
      <div className="py-6 space-y-6 flex-1">

        <Card style={{ maxWidth: "950px", borderRadius: "unset" }}>
          <div className="text-lg font-semibold py-2">The James Gordaneer Catalogue Raisonné</div>
          <div className="flex flex-col space-y-2 pt-2">
            <div>The James Gordaneer Catalogue Raisonné is an ongoing project of the Estate of James Gordaneer, Victoria, BC, Canada, committed to documenting the artistic practice of James Gordaneer (1933–2016).</div>
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <NavLink to="/gallery">
                <Button className="border-black text-black bg-white hover:!bg-gray-100 hover:!text-black hover:!border-black">
                  Explore the catalogue
                </Button>
              </NavLink>
              <NavLink to="/biography">
                <Button type="text" className="text-black hover:!text-black hover:!bg-transparent hover:!font-medium">
                  <span style={{ display: 'grid' }}>
                    <span style={{ gridArea: '1/1', fontWeight: 500, visibility: 'hidden', pointerEvents: 'none' }} aria-hidden>About James Gordaneer</span>
                    <span style={{ gridArea: '1/1' }}>About James Gordaneer</span>
                  </span>
                </Button>
              </NavLink>
              <NavLink to="/user-guide">
                <Button type="text" className="text-black hover:!text-black hover:!bg-transparent hover:!font-medium">
                  <span style={{ display: 'grid' }}>
                    <span style={{ gridArea: '1/1', fontWeight: 500, visibility: 'hidden', pointerEvents: 'none' }} aria-hidden>Visit user guide</span>
                    <span style={{ gridArea: '1/1' }}>Visit user guide</span>
                  </span>
                </Button>
              </NavLink>
            </div>
          </div>
        </Card>

        <Card style={{ maxWidth: "950px", borderRadius: "unset" }}>
          <div className="text-lg font-semibold py-2">Foreword</div>
          <div className="flex flex-col space-y-2 pt-2">
            <div>The Estate of James Gordaneer is pleased to present the James Gordaneer Catalogue Raisonné, the authoritative documentation of the artistic practice of James Gordaneer, RCA (1933–2016). This digital publication is the result of dedicated efforts to catalogue the artwork Gordaneer produced during his long and prolific career, which spanned more than six decades and encompassed thousands of works in oil, acrylic, and watercolour, distinguished throughout by rich colour, emotional intensity, and bold abstract forms. The goal of this project is to document every known work created by James Gordaneer during his lifetime. While there are numerous paintings presented here, there are many more in public and private collections that we have not been able to include by the time of publication. We welcome additions to the archive — please contact us to have your painting's image included.</div>
            <div>This digital catalogue was compiled between 2024 and 2026 by Alisa Gordaneer and Morgan Brooks, with additional support from John Barton and Joseph Hoh. The goal of this initiative is to document every known work created by Gordaneer during his lifetime. While the archive as it stands is extensive, many works have not yet been included, and the compilers warmly welcome contributions from collectors and institutions who wish to have their works added to this record.</div>
            <div>The Estate and the compilers join in expressing gratitude to the many collectors, institutions, former students, and colleagues who have opened their homes and collections to support this research. We are particularly grateful to the Victoria Visual Artists Legacy Society, whose stewardship of the James Gordaneer Legacy Award — presented annually to a promising student at Camosun College in Victoria, BC — ensures that Gordaneer's passion for teaching and mentorship continues to shape the next generation of artists in British Columbia.</div>
            <div>We hope that what follows will help you to gain further insight into the extraordinary work and enduring artistic vision of James Gordaneer.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
