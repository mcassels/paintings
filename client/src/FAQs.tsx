import React from 'react';
import { useFAQs } from './useFAQs';
import Markdown from 'react-markdown';
import { Collapse, CollapseProps, Spin } from 'antd';
import BrowsePaintingsButton from './BrowsePaintingsButton';
import ContactUsButton from './ContactUsButton';

export default function FAQs() {
  const faqs = useFAQs();

  if (faqs === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (faqs === 'error') {
    return <div className="loading">Error loading FAQs</div>;
  }

  const items: CollapseProps['items'] = faqs.map((faq) => ({
    key: faq.question,
    label: faq.question,
    children: <Markdown>{faq.answer}</Markdown>,
  }));

  return (
    <div className="w-[650px] pb-8">
      <div className="flex justify-between">
        <div className="text-lg font-bold pb-10">Frequently Asked Questions</div>
        <BrowsePaintingsButton />
      </div>
      <Collapse items={items} />
      <div className="flex text-sm pt-4">
        <div className="flex flex-col justify-center">
          <div>
            Question not answered here?
          </div>
        </div>
        <ContactUsButton />
      </div>
      <div className="pt-4 pb-4">
        <BrowsePaintingsButton />
      </div>
    </div>
  )
}