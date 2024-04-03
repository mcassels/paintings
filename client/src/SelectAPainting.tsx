import React from 'react';
import { useLocation } from 'react-router';
import { usePaintings } from './usePaintings';
import { Card, Spin, Image, Divider, Button } from 'antd';
import { getPaintingInfos } from './utils';
import { NavLink } from 'react-router-dom';

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

  const infos = getPaintingInfos(painting);

  return (
    <Card
      title={
        <div className="py-3">
            <div className="text-lg font-bold pb-3">{painting.title}</div>
            <div className="text-sm flex space-x-1 font-normal">
              {
                infos.map((info, i) => {
                  return (
                    <div key={info} className="flex">
                      {i > 0 && (
                        <div className="mr-2">
                          <Divider type="vertical" style={{ height: '1rem', border: '0.5px solid #a7a7a7' }}/>
                        </div>
                      )}
                      {info}
                    </div>
                  );
                })
              }
          </div>
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