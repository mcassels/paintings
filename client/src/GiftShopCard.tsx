import { Button } from "antd";
import { NavLink } from "react-router-dom";
import ProjectCardResponsive from "./ProjectCardResponsive";

export default function GiftShopCard() {
  return (
    <ProjectCardResponsive
      title="Online gift shop"
      description="Proceeds from sales of cards, calendars, and more support the James Gordaneer Legacy Award, presented annually by the Victoria Visual Artists Legacy Society to a promising art student attending Camosun College."
      imageUrl="https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/calendar.webp"
      imageAlt="calendar"
      orientation="vertical"
      extraContent={
        <div>
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
  );
}
