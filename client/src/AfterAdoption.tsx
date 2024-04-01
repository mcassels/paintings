import React from 'react';
import TextPage from './TextPage';
import { AFTER_ADOPTION_KEY } from './constants';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

export default function AfterAdoption() {
  return (
    <div>
      <TextPage textKey={AFTER_ADOPTION_KEY} />
      <div className="pt-6">
        <Button type="primary" ghost><NavLink to="/art-conservators">See supporting art conservators</NavLink></Button>
      </div>
    </div>
  )
}