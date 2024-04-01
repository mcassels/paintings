import React from 'react';
import { useFAQs } from './useFAQs';
import Markdown from 'react-markdown';
import { Collapse, CollapseProps, Spin } from 'antd';

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
      <div className="text-lg font-bold pb-10">Frequently Asked Questions</div>
      <Collapse items={items} />
    </div>
  )
}