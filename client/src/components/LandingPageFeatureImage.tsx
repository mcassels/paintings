import { Image } from "antd";
import { Painting } from "../types";
import { getPaintingAltText } from "../utils";

interface LandingPageFeatureImageProps {
  painting: Painting;
  onClick?: () => void;
}

export default function LandingPageFeatureImage(props: LandingPageFeatureImageProps) {
  const { painting, onClick } = props;
  const maxHeight = 550;
  const maxWidth = Math.min(document.body.clientWidth, 650);

  // First try the width for the max height
  let height = maxHeight;
  let width = (painting.width / painting.height) * maxHeight;
  if (width > maxWidth) {
    // If the width is too big, use the max width
    width = maxWidth;
    height = (painting.height / painting.width) * maxWidth;
  }
  const altText = getPaintingAltText(painting);
  return (
    <div key={painting.id}>
      <div className="my-[30px] flex justify-center">
        <Image
          className="cursor-pointer"
          width={width}
          height={height}
          src={painting.frontPhotoUrl}
          preview={false}
          title={altText}
          onClick={onClick}
          alt={altText}
        />
      </div>
    </div>
  );
}