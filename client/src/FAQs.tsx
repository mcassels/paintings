import React from 'react';
import Faq from 'react-faq-component';
import { useFAQs } from './useFAQs';
import { zoomies } from 'ldrs';
import { Collapse, CollapseProps } from 'antd';

export default function FAQs() {
  const faqs = useFAQs();

  if (faqs === 'loading') {
    zoomies.register();
    return (
      <div className="loading">
        <l-zoomies/>
      </div>
    );
  }
  if (faqs === 'error') {
    return <div className="loading">Error loading FAQs</div>;
  }

  const items: CollapseProps['items'] = faqs.map((faq) => ({
    key: faq.question,
    label: faq.question,
    children: <p>{faq.answer}</p>,
  }));

  return (
    <div className="w-[650px]">
      <div className="text-lg font-bold pb-10">Frequently Asked Questions</div>
      <Collapse items={items} />
    </div>
  )
}