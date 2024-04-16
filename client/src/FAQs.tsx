import React from 'react';
import Markdown from 'react-markdown';
import { Collapse, CollapseProps, Spin } from 'antd';
import BrowsePaintingsButton from './BrowsePaintingsButton';
import ContactUsButton from './ContactUsButton';
import { FAQ } from './types';
import { useAirtableRecords } from './useAirtableRecords';

function parseFAQ(airtableRecord: any): FAQ {
  return {
    question: airtableRecord.fields.question,
    answer: airtableRecord.fields.answer,
    sort: airtableRecord.fields.sort,
  };
}

function sortAndFilterFAQs(parsedFaqs: FAQ[]): FAQ[] {
  const faqs = parsedFaqs.sort((a, b) => a.sort - b.sort);
  return faqs.filter((faq) => faq.question && faq.answer && faq.question.length > 0 && faq.answer.length > 0);
}

export default function FAQs() {
  const faqs = useAirtableRecords(
    'broken_painting_faqs',
    parseFAQ,
    sortAndFilterFAQs,
  )

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
    <div className="pb-8" style={{ width: "min(650px, 100%)"}}>
      <div className="m-2">
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
    </div>
  )
}