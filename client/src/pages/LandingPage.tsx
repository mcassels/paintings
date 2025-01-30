import { usePaintings } from "../hooks/usePaintings";
import { Button, Skeleton, Spin } from "antd";
import LandingPageFeatureImage from "../components/LandingPageFeatureImage";
import { useCurrentShow } from "../hooks/useCurrentShow";
import { NavLink } from "react-router-dom";
import { formatDate } from "../utils";
import { Badge, Card, Space } from 'antd';

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
  const show = useCurrentShow();
  if (show === 'error' || show === 'loading' || show === null) {
    return null;
  }

  return (
    <Badge.Ribbon text="Show on now!" color="blue">
      <Card size="small" className="bg-slate-50">
        <div>
          <div className="text-xl font-light">{show.name}</div>
          <div className="text-xs italic">{`${formatDate(show.startDate)} - ${formatDate(show.endDate)}`}</div>
          <div className="pt-4 text-sm">{show.description}</div>
          <div className="pt-6">
          <Button type="primary" ghost>
            <NavLink to="/show">
              Visit show
            </NavLink>
          </Button>
          </div>
        </div>
      </Card>
  </Badge.Ribbon>
  );
}


export default function LandingPage() {
  return (
    <div className="text-pretty flex justify-center w-[80%]">
      <div style={{ width: "min(650px, 100vw)" }}>
        <div className="px-[10px]">
          <div className="pb-2">
            <p>A short paragraph of text to be written by Alisa.</p>
          </div>
        </div>
        <CurrentShowDisplay />
        <FeaturedPaintingDisplay />
      </div>
    </div>
  );
}