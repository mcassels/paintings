import { usePaintings } from "../hooks/usePaintings";
import { Button, Skeleton, Spin } from "antd";
import LandingPageFeatureImage from "../components/LandingPageFeatureImage";
import { useCurrentShow } from "../hooks/useCurrentShow";
import { NavLink } from "react-router-dom";

const FEATURE_PAINTING_ID = 'BP120';

function FeaturedPaintingDisplay() {
  const paintings = usePaintings();

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

function CurrentShowDisplay() {
  const currentShow = useCurrentShow();
  if (currentShow === 'error' || currentShow === 'loading' || currentShow === null) {
    return null;
  }

  return (
    <Button type="link">
      <NavLink to="/show" className="italic">
       {`Show "${currentShow.name}" on now!`}
      </NavLink>
    </Button>
  );
}


export default function LandingPage() {
  return (
    <div className="text-pretty flex justify-center w-[80%]">
      <div style={{ width: "min(650px, 100vw)" }}>
        <div className="px-[10px]">
          <div className="pb-2">
            <p>Some text to be filled in by Alisa</p>
          </div>
        </div>
        <CurrentShowDisplay />
        <FeaturedPaintingDisplay />
      </div>
    </div>
  );
}