import { Button, Modal } from 'antd';
import React from 'react';
import PriceTable from './PriceTable';
import { NavLink } from 'react-router-dom';

interface DamageLevelInfoButtonProps {
  buttonText: string;
  selectedDamageLevel?: number;
}

export default function DamageLevelInfoButton(props: DamageLevelInfoButtonProps) {
  const { buttonText, selectedDamageLevel } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div>
      <Modal
        title="Damage level and pricing"
        open={isModalOpen}
        className="damage-level-modal"
        onCancel={() => setIsModalOpen(false)}
        style={{ width: 'unset' }}
        footer={[
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>,
        ]}
      >
          <div className="flex space-x-4 mb-4">
            <div className="text-sm flex flex-col justify-center">
            <div>
              The adoption fee is based on the painting's damage level.
            </div>
          </div>
          <Button type="link" onClick={() => setIsModalOpen(false)}>
            <NavLink to="/pricing">
              More info
            </NavLink>
          </Button>
        </div>
        <PriceTable selectedDamageLevel={selectedDamageLevel} />
      </Modal>
      <Button type="link" className="p-0" onClick={() => setIsModalOpen(true)}>{buttonText}</Button>
    </div>
  );
}