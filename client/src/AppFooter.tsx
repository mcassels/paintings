import { Divider } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React from 'react';
import ContactUsButton from './ContactUsButton';

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
            Site © 2024&nbsp;<a href="https://mcassels.github.io/morgan/" target="_blank" rel="noreferrer">Morgan Brooks</a>
          </div>
        </div>
      </div>
    </Footer>
  );
}