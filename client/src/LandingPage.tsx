import React from "react";
import { usePaintings } from "./usePaintings";
import { Carousel, Image, Skeleton, Spin } from "antd";
import BrowsePaintingsButton from "./BrowsePaintingsButton";

function FeaturedPaintingDisplay() {
  const paintings = usePaintings();

  if (paintings === "error" || paintings.length === 0) {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Skeleton.Image />
      </div>
    );
  }
  if (paintings === "loading") {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  const height = 440;
  return (
    <Carousel className="max-w-[650px] h-[500px]" autoplay>
      {paintings.splice(0, 3).map((painting) => {
        const width = (painting.width / painting.height) * height;
        console.log(width);
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <div className="my-[30px]">
                <Image
                  width={width}
                  height={height}
                  src={painting.frontPhotoUrl}
                  preview={false}
                />
              </div>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}


export default function LandingPage() {
  return (
    <div>
      <div className="pb-2 w-[650px]">
        <h1 className="text-lg">A fundraiser for Victoria Visual Arts Legacy Society</h1>
        <p>
          Supporting the James Gordaneer Legacy Award, given annually to a Camosun College Visual Arts student.
        </p>
      </div>
      <div className="pt-2">
        <BrowsePaintingsButton />
      </div>
      <FeaturedPaintingDisplay />
    </div>
  );
}