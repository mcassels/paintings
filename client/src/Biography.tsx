import React from 'react';
import TextPage from './TextPage';
import { JIM_BIO_KEY } from './constants';
import ImageCard from './ImageCard';
import { useBiographyLinks } from './useBiographyLinks';
import { List, Spin } from 'antd';
import BrowsePaintingsButton from './BrowsePaintingsButton';

export default function Biography() {
  const bioLinks = useBiographyLinks();
  return (
    <div className="flex flex-col m-2">
      <div className="flex flex-wrap justify-center gap-x-14">
        <div className="flex-col space-y-6 pb-6" style={{ maxWidth: "min(100%, 650px)"}}>
          <TextPage textKey={JIM_BIO_KEY} />
          <div>
            {
              bioLinks === 'loading' ? (
                <Spin />
              ) : bioLinks === 'error' ? (
                <div>Failed to load links</div>
              ) : (
                <div>
                  <List
                    size="small"
                    header={<div className="font-bold">Links</div>}
                    bordered
                  >
                    {bioLinks.map(({ description, url }) => (
                      <List.Item key={url}>
                        <a href={url} target  = "_blank" rel="noreferrer">{description}</a>
                      </List.Item>
                    ))}
                  </List>
                </div>
              )
            }
          </div>
        </div>
        <div className="space-y-8" style={{ maxWidth: "min(100%, 500px)"}}>
          <div>
            <BrowsePaintingsButton />
          </div>
          <ImageCard
            imageKey="jim-self-portrait"
            caption="James Gordaneer, 1991. Self-Portrait. Oil on canvas. Collection of the Gordaneer family."
          />
          <ImageCard
            imageKey="jim-hands"
            caption="Jim was never far from a sketchbook or palette, be it watercolor, oils, or acrylics, even when he was in hospital. "
          />
          <ImageCard
            imageKey="jim-with-paints"
            caption="In 2015, when he returned to his studio after a long hospitalization, Jim couldn’t wait to get back to the painting he’d left on the easel — in this case, one of his beloved locomotives."
          />
          <ImageCard
            imageKey="jim-studio"
            caption="Jim’s studio, March 10, 2016, the day after he passed away."
          />
        </div>
      </div>
      <div className="py-6 flex justify-center">
        <BrowsePaintingsButton />
      </div>
    </div>
  );
}