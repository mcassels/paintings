import React from 'react';
import { createSearchParams, NavLink, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import { Painting } from './types';
import { usePaintings } from './usePaintings';
import { zoomies } from 'ldrs';
import { Button, ConfigProvider } from 'antd';

function BuyPaintingButton(props: { paintingId: string }) {
  return (
    <Button type="primary"><NavLink to={`/adopt?painting=${props.paintingId}`}>Adopt me!</NavLink></Button>
  );
}

function SavePaintingButton(props: { paintingId: string }) {
  const savedPaintingKey = 'GORDANEER_SAVED_PAINTINGS';
  const savedPaintings = localStorage.getItem(savedPaintingKey)?.split(',') || [];
  const isSaved = savedPaintings.includes(props.paintingId);

  const [isFavourite, setIsFavourite] = React.useState(isSaved);

  function onClick() {
    const savedPaintings = localStorage.getItem(savedPaintingKey)?.split(',') || [];
    if (savedPaintings.includes(props.paintingId)) {
      localStorage.setItem(savedPaintingKey, savedPaintings.filter((p) => p !== props.paintingId).join(','));
    } else {
      localStorage.setItem(savedPaintingKey, [...savedPaintings, props.paintingId].join(','));
    }
    setIsFavourite((prev) => !prev);
  }

  return (
    <Button
      className="mr-6"
      onClick={onClick}
      type="primary"
      ghost
      icon={isFavourite ? <HeartFilled /> : <HeartOutlined />}
    >
      {isFavourite ? "unfavourite" : "favourite"}
    </Button>
  );
}

/*
TODO:
* click on painting makes it flip
* can click through lightbox to go to all photos using next
*/

function getPaintingDescription(p: Painting) {
  const year = (p.year || p.yearGuess || 'ND').toString();
  const size = `${p.height} x ${p.width}`;
  const parts = [year, size];
  if (p.medium) {
    parts.push(p.medium);
  }
  if (p.isFramed) {
    parts.push('Framed');
  }
  if (p.isFramed === false) { // undefined means we don't know if it's framed or not
    parts.push('Unframed');
  }
  if (p.conditionNotes) {
    parts.push(p.conditionNotes);
  }
  if (p.status) {
    parts.push(p.status);
  }
  parts.push(`Damage level: ${p.damageLevel}`);
  // TODO: for some reason, this shows an ellipses at the end of only the third line.
  // Possibly may need to do this properly as a component and not just text, by adding a plugin?
  // See https://yet-another-react-lightbox.com/advanced#Modules
  // For now, I'm right-aligning the text, which makes the ellipses disappear.
  return `${parts.map((p) => p.replaceAll('\n', '')).join('\n')}`;
}

interface PaintingLightBoxProps {
  painting: Painting;
}

function PaintingLightBox(props: PaintingLightBoxProps) {
  const { painting } = props;

  const navigate = useNavigate();

  // We show front and back photos in the lightbox
  const photos = [
    {
      src: painting.frontPhotoUrl,
      width: painting.width * 100,
      height: painting.height * 100,
      caption: painting.title,
      id: painting.id,
      title: painting.title,
      description: getPaintingDescription(painting),
    },
  ];
  if (painting.backPhotoUrl) {
    photos.push({
      src: painting.backPhotoUrl,
      width: painting.width * 100,
      height: painting.height * 100,
      caption: painting.title,
      id: painting.id,
      title: `(VERSO) ${painting.title}`,
      description: getPaintingDescription(painting),
    });
  }
  return (
    <Lightbox
      styles={{
        captionsTitleContainer: { backgroundColor: 'transparent' },
        captionsTitle: { paddingLeft: '60px', paddingTop: '40px' },
        captionsDescriptionContainer: { backgroundColor: 'transparent' },
        captionsDescription: {
          paddingLeft: '40px',
          height: '200px',
          width: '300px',
          textAlign: 'right',
        }
      }}
      open={true}
      close={() => navigate({ pathname: document.location.pathname })}
      slides={photos}
      plugins={[Captions]}
    />
  )
}

interface PhotoGalleryProps {
  paintings: Painting[];
}

function PhotoGalleryImpl(props: PhotoGalleryProps) {
  const { paintings } = props;

  const navigate = useNavigate();

  const params = new URLSearchParams(document.location.search);
  // Track the painting id and not index in the header, so that the URL can be shared
  // even when the order of the paintings changes.
  const selectedPhotoId = params.get('selected');
  const selectedPhotoIdx = selectedPhotoId ? paintings.findIndex((p) => p.id === selectedPhotoId) : undefined;

  const photos = paintings.map((p) => {
    return {
      id: p.id,
      src: p.frontPhotoUrl,
      width: p.width, // These are inches not pixels, but the ratio should be the same... will this work? lol
      height: p.height,
      source: p.frontPhotoUrl,
      caption: p.title,
      original: p.frontPhotoUrl,
      thumbnail: p.frontPhotoUrl,
      title: p.title,
      description: getPaintingDescription(p),
    };
  });

  return (
    <div>
      <Gallery
        photos={photos}
        onClick={(e, { index }) => {
          const nextSelectedId = photos[index]?.id;
          if (nextSelectedId) {
            navigate({
              pathname: document.location.pathname,
              search: createSearchParams({
                selected: nextSelectedId.toString(),
              }).toString()
            });
          }
        }}
      />
      <Lightbox
        styles={{
          captionsTitleContainer: { backgroundColor: 'transparent' },
          captionsTitle: { paddingLeft: '60px', paddingTop: '40px' },
          captionsDescriptionContainer: { backgroundColor: 'transparent' },
          captionsDescription: {
            paddingLeft: '40px',
            height: '200px',
            width: '300px',
            textAlign: 'right',
          }
        }}
        toolbar={{
          buttons: selectedPhotoId ? [
            <SavePaintingButton key="save-painting" paintingId={selectedPhotoId} />,
            <BuyPaintingButton key="buy-painting" paintingId={selectedPhotoId} />,
            "close",
          ] : [],
        }}
        open={selectedPhotoIdx !== undefined}
        close={() => navigate({ pathname: document.location.pathname })}
        index={selectedPhotoIdx}
        slides={photos.map((photo) => {
          return {
            ...photo,
            height: photo.height * 100,
            width: photo.width * 100,
          };
        })}
        plugins={[Captions]}
        on={{
          view: ({ index }) => {
            const nextSelectedId = photos[index]?.id;
            if (nextSelectedId) {
              navigate({
                pathname: document.location.pathname,
                search: createSearchParams({
                  selected: nextSelectedId.toString(),
                }).toString()
              });
            }
          }
        }}
      />
    </div>
  )
}

export default function PhotoGallery() {
  const paintings = usePaintings();

  if (paintings === 'loading') {
    zoomies.register();
    return (
      <div className="loading">
        <l-zoomies/>
      </div>
    );
  }
  if (paintings === 'error') {
    return <div className="loading">Error loading paintings</div>;
  }
  return <PhotoGalleryImpl paintings={paintings} />;
}