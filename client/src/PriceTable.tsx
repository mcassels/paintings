import React from 'react';
import { getIsMobile, getPriceFromDamageLevel } from './utils';
import { Button, Spin, Table } from 'antd';
import { NavLink } from 'react-router-dom';
import { useDamageLevels } from './useDamageLevelDescriptions';

interface PriceTableProps {
  selectedDamageLevel?: number;
}

export default function PriceTable(props: PriceTableProps) {
  const content = useDamageLevels();

  if (content === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (content === 'error') {
    return <div className="loading">Error loading damage levels</div>;
  }
  const isMobile = getIsMobile();

  const dataSource = Array.from(Array(5).keys()).map((idx) => {
    const damageLevel = idx + 1;
    const price = getPriceFromDamageLevel(damageLevel);
    const description = content.find((d) => d.level === damageLevel)?.description || 'No description';

    return {
      key: damageLevel,
      damageLevel,
      damageLevelDisplay: isMobile ? damageLevel : `Level ${damageLevel}`,
      price: `$${price}`,
      description,
      browse: (
        <Button type="link">
          <NavLink to={`/gallery?damage_min=${damageLevel}&damage_max=${damageLevel}`}>
            <div>
              Browse
            </div>
          </NavLink>
        </Button>
      )
    }
  });

  const columns = [
    {
      title: 'Damage level',
      dataIndex: 'damageLevelDisplay',
      key: 'damageLevelDisplay',
    },
    {
      title: 'Adoption fee',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      dataIndex: 'browse',
      key: 'browse',
    },
  ];

  const { selectedDamageLevel } = props;

  return (
    <Table
      rowClassName={(record, _) => record.damageLevel === selectedDamageLevel ? 'font-bold' : ''}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      className="price-table"
    />
  )
}