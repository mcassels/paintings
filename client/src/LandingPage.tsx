import React from "react";
import { usePaintings } from "./usePaintings";
import { Carousel, Image } from "antd";

function FeaturedPaintingDisplay() {
  const paintings = usePaintings();
  if (paintings.length === 0) {
    return null;
  }
  if (paintings === "error") {
    return <div>There was an error loading the paintings.</div>;
  }
  if (paintings === "loading") {
    return <div>Loading...</div>;
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
      <div className="mb-4">
        <h1>A fundraiser for Victoria Visual Arts Legacy Society</h1>
        <p>
          Supporting the James Gordaneer Legacy Award, given annually to a Camosun College Visual Arts student.
        </p>
        <p>
          To get started, visit the <a href="/gallery">gallery</a>.
        </p>
      </div>
      <FeaturedPaintingDisplay />
    </div>
  );
}