import React from 'react';
import Faq from 'react-faq-component';
import { useFAQs } from './useFAQs';
import { zoomies } from 'ldrs';

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

  const data = {
      title: "Frequently Asked Questions",
      rows: faqs.map((faq) => ({
          title: faq.question,
          content: faq.answer,
      })),
  };

  // TODO: style this later
  const styles = {
      // bgColor: 'white',
      titleTextColor: "blue",
      rowTitleColor: "blue",
      rowContentColor: 'grey',
      // arrowColor: "red",
  };

  const config = {
      animate: true,
      arrowIcon: <i className="fa-solid fa-caret-down text-lg font-bold text-black" />,
      tabFocus: true
  };
  return (
    <div>
      <Faq
        data={data}
        styles={styles}
        config={config}
      />
    </div>
  )
}