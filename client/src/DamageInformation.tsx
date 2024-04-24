import React from 'react';

import { Spin } from 'antd';
import { useDamageLevels } from './useDamageLevels';
import LoadingError from './LoadingError';

interface DamageInformationProps {
  damageLevel: number;
}

export default function DamageInformation(props: DamageInformationProps) {
  const { damageLevel } = props;

  const content = useDamageLevels();

  if (content === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (content === 'error') {
    return <LoadingError message="Error loading damage levels" />;
  }
  return (
    <div>
      <div className="text-sm flex flex-col justify-center">
        <div>
          {content.find((d) => d.level === damageLevel)?.description || 'No description'}
        </div>
      </div>
    </div>
  )
}