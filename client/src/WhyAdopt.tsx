import React from 'react';
import TextPage from './TextPage';
import { WHY_ADOPT_KEY } from './constants';
import BrowsePaintingsButton from './BrowsePaintingsButton';
import ImageCard from './ImageCard';
import { Card, Image } from 'antd';

export default function WhyAdopt() {
  return (
    <div className="flex flex-col m-2">
      <div className="flex flex-wrap justify-center gap-x-14">
        <div className="flex-col space-y-6" style={{ maxWidth: "min(100%, 650px)"}}>
          <TextPage textKey={WHY_ADOPT_KEY} />
        </div>
        <div className="space-y-8" style={{ maxWidth: "min(100%, 500px)"}}>
          <div>
            <BrowsePaintingsButton />
          </div>
          <ImageCard
            imageKey="paintings-sunbathing"
            caption="Some of Gordaneer’s flood-soaked paintings drying in the sun, September 2022."
          />
          <ImageCard
            imageKey="paintings-under-tarp"
            caption="Flood-soaked paintings wait in triage to be assessed for damage, September 2022."
          />
          <Card key="morgan-laptop" style={{ width: "min(95%, 400px)"}}>
            <Image
              alt="Morgan helped with on-site cataloging."
              title="Morgan helped with on-site cataloging."
              preview={false}
              src={`https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/morgan-laptop.jpg`}
            />
            <div className="pt-2 text-xs">
              <div className="flex flex-col justify-center">
                <div>
                  <a href="https://mcassels.github.io/morgan/" target="_blank" rel="noreferrer">Morgan Brooks</a>&nbsp;helped with on-site cataloging.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="py-6 flex justify-center">
        <BrowsePaintingsButton />
      </div>
    </div>
  )
}