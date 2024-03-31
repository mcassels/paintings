import React from 'react';
import TextPage from './TextPage';
import { JIM_BIO_KEY } from './constants';
import { Card, Image } from 'antd';

function ImageCard(props: { imageKey: string; }) {
  const { imageKey } = props;
  return (
    <Card key={imageKey} className="w-[400px]">
      <Image
        src={`https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/${imageKey}.jpeg`}
      />
    </Card>
  )
}

export default function Biography() {
  return (
    <div className="flex space-x-14">
      <TextPage textKey={JIM_BIO_KEY} />
      <div className="space-y-4">
        <ImageCard imageKey="jim-self-portrait" />
        <ImageCard imageKey="jim-hands" />
        <ImageCard imageKey="jim-with-paints" />
        <ImageCard imageKey="jim-studio" />
      </div>
    </div>
  )
}