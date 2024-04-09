import React from 'react';
import { Card, Image } from 'antd';

interface ImageCardProps {
  imageKey: string;
  caption?: string;
}

export default function ImageCard(props: ImageCardProps) {
  const { imageKey, caption } = props;
  return (
    <Card key={imageKey} style={{ width: "min(95%, 400px)"}}>
      <Image
        title={caption}
        alt={caption}
        preview={false}
        src={`https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/${imageKey}.jpeg`}
      />
      <div className="pt-2 text-xs">
        {caption}
      </div>
    </Card>
  )
}