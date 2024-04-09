import React from "react";
import { usePaintings } from "./usePaintings";
import { Carousel, Image, Skeleton, Spin } from "antd";
import BrowsePaintingsButton from "./BrowsePaintingsButton";
import { useLocation, useNavigate } from "react-router";

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

  const maxHeight = 550;
  return (
    <Carousel
      style={{ width: "min(650px, 100%)" }}
      autoplay
    >
      {paintings.slice(0, 3).map((painting) => {
        const maxWidth = Math.min(document.body.clientWidth, 650);

        // First try the width for the max height
        let height = maxHeight;
        let width = (painting.width / painting.height) * maxHeight;
        if (width > maxWidth) {
          // If the width is too big, use the max width
          width = maxWidth;
          height = (painting.height / painting.width) * maxWidth;
        }
        return (
          <div key={painting.id}>
            <div className="my-[30px] flex justify-center">
              <Image
                className="cursor-pointer"
                width={width}
                height={height}
                src={painting.frontPhotoUrl}
                preview={false}
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search);
                  searchParams.set("selected", painting.id);
                  navigate({
                    search: searchParams.toString(),
                    pathname: "/gallery",
                  });
                }}
                alt={painting.title}
              />
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}


export default function LandingPage() {
  return (
    <div className="text-pretty" style={{ width: "min(650px, 100vw)" }}>
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
  );
}