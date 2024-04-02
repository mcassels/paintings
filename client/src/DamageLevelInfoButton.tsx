import { Button, Modal } from 'antd';
import React from 'react';
import PriceTable from './PriceTable';

interface DamageLevelInfoButtonProps {
  buttonText: string;
}

export default function DamageLevelInfoButton(props: DamageLevelInfoButtonProps) {
  const { buttonText } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div>
      <Modal
        title="Damage level and pricing"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>,
        ]}
      >
        <PriceTable />
      </Modal>
      <Button type="link" onClick={() => setIsModalOpen(true)}>{buttonText}</Button>
    </div>
  );
}