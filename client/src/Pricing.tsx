import React from 'react';
import TextPage from './TextPage';
import PriceTable from './PriceTable';
import { Card } from 'antd';

export default function Pricing() {
  return (
    <div className="flex justify-center flex-wrap">
      <TextPage textKey="pricing" />
      <Card className="my-4" style={{ maxWidth: "min(700px, 100%)" }}>
        <PriceTable />
      </Card>
    </div>
  );
}