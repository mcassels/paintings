import { Divider } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React from 'react';
import ContactUsButton from './contactus/ContactUsButton';
import { MORGAN_BROOKS_WEBSITE } from '../constants';

export default function AppFooter() {
  return (
    <Footer className="shrink-0 p-1 mt-4 flex justify-center">
      <div className="flex">
        <div>
          <ContactUsButton />
        </div>
        <div className="flex flex-col justify-center ml-0">
          <Divider type="vertical" className="border-slate-400" />
        </div>
        <div className="flex flex-col justify-center text-slate-600 ml-4">
          <div>
            Images © James Gordaneer
          </div>
        </div>
        <div className="flex flex-col justify-center ml-4">
          <Divider type="vertical" className="border-slate-400" />
        </div>
        <div className="flex flex-col justify-center text-slate-600 ml-4">
          <div>
            Site © 2025&nbsp;<a href={MORGAN_BROOKS_WEBSITE} target="_blank" rel="noreferrer">Morgan Brooks</a>
          </div>
        </div>
      </div>
    </Footer>
  );
}