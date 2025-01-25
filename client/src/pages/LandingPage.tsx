import { usePaintings } from "../hooks/usePaintings";
import { Image, Skeleton, Spin } from "antd";
import { useLocation, useNavigate } from "react-router";
import { getPaintingAltText } from "../utils";
import LandingPageFeatureImage from "../components/LandingPageFeatureImage";
import { useCurrentShow } from "../hooks/useCurrentShow";

const FEATURE_PAINTING_ID = 'BP120';

function FeaturedPaintingDisplay() {
  const paintings = usePaintings();

  const location = useLocation();
  const navigate = useNavigate();

  if (paintings === "error" || paintings.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center" style={{ width: "min(650px, 100%)" }}>
        <Skeleton.Image />
      </div>
    );
  }
  if (paintings === "loading") {
    return (
      <div className="h-[500px] flex items-center justify-center" style={{ width: "min(650px, 100%)" }}>
        <Spin />
      </div>
    );
  }
  let painting = paintings.find((painting) => painting.id === FEATURE_PAINTING_ID);
  if (!painting && paintings.length > 0) {
    // If the featured painting is not found, just use the first painting
    painting = paintings[0];
  }
  if (!painting) {
    return null;
  }

  return <LandingPageFeatureImage painting={painting} />;
}


export default function LandingPage() {
  const show = useCurrentShow();
  return (
    <div className="text-pretty" style={{ width: "min(650px, 100vw)" }}>
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">Some text to be filled in by Alisa</h1>
          <p className="max-w-[calc(100vw - 40px)]">
            Possibly some more text.
          </p>
        </div>
      </div>
      <FeaturedPaintingDisplay />
    </div>
  );
}