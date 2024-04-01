import React from 'react';
import { Card, Image } from 'antd';

export default function ImageCard(props: { imageKey: string; }) {
  const { imageKey } = props;
  return (
    <Card key={imageKey} className="w-[400px]">
      <Image
        alt={imageKey}
        preview={false}
        src={`https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/${imageKey}.jpeg`}
      />
    </Card>
  )
}