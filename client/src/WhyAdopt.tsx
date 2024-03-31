import React from 'react';
import TextPage from './TextPage';
import { WHY_ADOPT_KEY } from './constants';
import BrowsePaintingsButton from './BrowsePaintingsButton';

export default function WhyAdopt() {
  return (
    <div>
      <TextPage textKey={WHY_ADOPT_KEY} />
      <div className="pt-6">
        <BrowsePaintingsButton />
      </div>
    </div>
  )
}