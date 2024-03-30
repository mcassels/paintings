import React from "react";
import { usePaintings } from "./usePaintings";
import { Carousel, Image } from "antd";

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

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
  return (
    <Carousel className="max-w-650px" autoplay>
      {paintings.slice(0, 3).map((painting) => (
        <div key={painting.id} style={contentStyle}>
          {/* <Image
            width={200}
            height={200}
            src={painting.frontPhotoUrl}
          /> */}
          Hello
        </div>
      ))}
    </Carousel>
  );
}


export default function LandingPage() {
  return (
    <div>
      <h1>A fundraiser for Victoria Visual Arts Legacy Society</h1>
      <p>
        Supporting the James Gordaneer Legacy Award, given annually to a Camosun College Visual Arts student.
      </p>
      <p>
        To get started, visit the <a href="/gallery">gallery</a>.
      </p>
      <FeaturedPaintingDisplay />
    </div>
  );
}