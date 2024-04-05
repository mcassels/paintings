import React from 'react';
import { useLocation } from 'react-router';
import { usePaintings } from './usePaintings';
import { Card, Spin, Image, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import PaintingInformation from './PaintingInformation';

export default function SelectAPainting() {
  const location = useLocation();
  const paintings = usePaintings();

  const params = new URLSearchParams(location.search);
  const paintingId = params.get('painting');

  if (!paintingId) {
    return (
      <Card
        className="w-[650px] flex flex-col justify-center w-400"
      >
        <div>
          <Button type="primary">
            <NavLink to="/gallery">
              Browse paintings
            </NavLink>
          </Button>
        </div>
      </Card>
    );
  }
  if (paintings === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (paintings === 'error') {
    return <div className="loading">Error loading paintings</div>;
  }
  const painting = paintings.find((p) => p.id === paintingId);
  if (!painting) {
    return <div className="loading">Painting not found</div>;
  }

  return (
    <Card
      title={
        <div className="py-3">
            <div className="text-lg font-bold pb-3">{painting.title}</div>
            <PaintingInformation painting={painting} />
        </div>
      }
      extra={
        <Button type="link">
          <NavLink to="/gallery">
            Change selection
          </NavLink>
        </Button>
      }
      className="w-[650px]"
    >
      <Image
        width={400}
        alt={painting.title}
        src={painting.frontPhotoUrl}
      />
    </Card>
  );
}