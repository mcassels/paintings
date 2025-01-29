import { usePaintings } from "../../hooks/usePaintings";
import { Carousel, Skeleton, Spin } from "antd";
import BrowsePaintingsButton from "../../components/BrowsePaintingsButton";
import { useLocation, useNavigate } from "react-router";
import LandingPageFeatureImage from "../../components/LandingPageFeatureImage";

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

  return (
    <Carousel
      style={{ width: "min(650px, 100%)" }}
      autoplay
    >
      {paintings.slice(0, 3).map((painting) => {
        const onClick = () => {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set("selected", painting.id);
          navigate({
            search: searchParams.toString(),
            pathname: "/gallery",
          });
        };
        return <LandingPageFeatureImage painting={painting} onClick={onClick} />;
      })}
    </Carousel>
  );
}


export default function LandingPage() {
  return (
    <div className="text-pretty flex justify-center w-[80%]">
      <div style={{ width: "min(650px, 100vw)" }}>
        <div className="px-[10px]">
          <div className="pb-2">
            <h1 className="text-lg">A fundraiser for Victoria Visual Arts Legacy Society</h1>
            <p className="max-w-[calc(100vw - 40px)]">
              Supporting the James Gordaneer Legacy Award, given annually to a Camosun College Visual Arts student.
            </p>
          </div>
          <div className="pt-2">
            <BrowsePaintingsButton />
          </div>
        </div>
        <FeaturedPaintingDisplay />
      </div>
    </div>
  );
}