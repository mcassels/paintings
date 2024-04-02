import React from 'react';
import TextPage from './TextPage';
import PriceTable from './PriceTable';
import { Card } from 'antd';

export default function Pricing() {
  return (
    <div>
      <TextPage textKey="pricing" />
      <Card className="w-[700px] my-4">
        <PriceTable />
      </Card>
    </div>
  );
}