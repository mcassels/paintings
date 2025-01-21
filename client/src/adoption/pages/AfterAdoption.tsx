import React from 'react';
import TextPage from '../../components/TextPage';
import { AFTER_ADOPTION_KEY } from '../../constants';
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

export default function AfterAdoption() {
  return (
    <div>
      <TextPage textKey={AFTER_ADOPTION_KEY} />
      <div className="pt-6 flex justify-center">
        <Button type="primary" ghost><NavLink to="/art-conservators">Care and conservation</NavLink></Button>
      </div>
    </div>
  )
}