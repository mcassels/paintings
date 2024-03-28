import React from 'react';
import TextPage from './TextPage';
import { WHY_ADOPT_KEY } from './constants';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

export default function WhyAdopt() {
  return (
    <div>
      <TextPage textKey={WHY_ADOPT_KEY} />
      <div className="pt-6">
        <Button><NavLink to="/gallery">Browse adoptable paintings</NavLink></Button>
      </div>
    </div>
  )
}