import React from 'react';
import { useLocation } from 'react-router';
import { usePaintings } from '../../hooks/usePaintings';
import { Card, Spin, Image, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import PaintingInformation from '../../components/PaintingInformation';
import LoadingError from '../../components/LoadingError';

export default function SelectAPainting() {
  const location = useLocation();
  const paintings = usePaintings();

  const params = new URLSearchParams(location.search);
  const paintingId = params.get('painting');

  if (!paintingId) {
    return (
      <Card
        className="flex flex-col justify-center"
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
      <div className="h-[500px] flex items-center justify-center" style={{ width: "min(650px, 100%)" }}>
        <Spin />
      </div>
    );
  }
  if (paintings === 'error') {
    return <LoadingError message="Error loading paintings" />;
  }
  const painting = paintings.find((p) => p.id === paintingId);
  if (!painting) {
    return <div className="loading">Painting not found</div>;
  }

  return (
    <Card
      title={
        <div className="py-3">
            <div className="text-lg font-bold pb-3 text-pretty">{painting.title}</div>
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
      style={{ width: "min(650px, 100%)" }}
    >
      <Image
        width="min(400px, 100%)"
        alt={painting.title}
        title={painting.title}
        src={painting.frontPhotoUrl}
      />
    </Card>
  );
}