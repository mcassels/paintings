import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import { Painting } from './types';

function getPaintingTitle(p: Painting) {
  let title = `#${p.id}`;
  if (p.name) {
    title += ` - ${p.name}`;
  }
  if (p.year) {
    title += ` (${p.year})`;
  }
  return title;
}

function getPaintingDescription(p: Painting) {
  const parts = [];
  if (p.size) {
    parts.push(p.size);
  }
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
  return parts.map((p) => p.replaceAll('\n', '')).join('\n');
}

interface PhotoGalleryProps {
  paintings: Painting[];
}

export default function PhotoGallery(props: PhotoGalleryProps) {
  const { paintings } = props;

  const navigate = useNavigate();

  const params = new URLSearchParams(document.location.search);
  // Track the painting id and not index in the header, so that the URL can be shared
  // even when the order of the paintings changes.
  const selectedPhotoId = params.get('selected');
  const selectedPhotoIdx = selectedPhotoId ? paintings.findIndex((p) => p.id === parseInt(selectedPhotoId)) : undefined;
  debugger;

  const photos = paintings.map((p) => {
    const title = getPaintingTitle(p);
    return {
      src: p.photo.url,
      width: p.photo.width,
      height: p.photo.height,
      source: p.photo.url,
      caption: title,
      original: p.photo.url,
      thumbnail: p.photo.url,
      id: p.id,
      title,
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
          captionsTitle: { paddingLeft: '40px', paddingTop: '40px' },
          captionsDescriptionContainer: { backgroundColor: 'transparent' },
          captionsDescription: {
            paddingLeft: '40px',
            height: '200px',
            width: '400px',
            overflow: 'hidden',
          }
        }}
        open={selectedPhotoIdx !== undefined}
        close={() => navigate({ pathname: document.location.pathname })}
        index={selectedPhotoIdx}
        slides={photos}
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