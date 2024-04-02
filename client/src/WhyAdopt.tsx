import React from 'react';
import TextPage from './TextPage';
import { WHY_ADOPT_KEY } from './constants';
import BrowsePaintingsButton from './BrowsePaintingsButton';
import ImageCard from './ImageCard';

export default function WhyAdopt() {
  return (
    <div className="flex space-x-14">
      <div className="flex-col space-y-6">
        <TextPage textKey={WHY_ADOPT_KEY} />
        <div className="pb-6">
          <BrowsePaintingsButton />
        </div>
      </div>
      <div className="space-y-8">
        <div>
          <BrowsePaintingsButton />
        </div>
        <ImageCard
          imageKey="paintings-sunbathing"
          caption="Some of Gordaneer’s flood-soaked paintings drying in the sun, September 2021."
        />
        <ImageCard
          imageKey="paintings-under-tarp"
          caption="Flood-soaked paintings wait in triage to be assessed for damage, September 2021."
        />
      </div>
    </div>
  )
}