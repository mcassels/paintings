import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import { Painting } from './types';
import { usePaintings } from './usePaintings';
import { zoomies } from 'ldrs';

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
  // type?: "image";
  // /** image URL */
  // src: string;
  // /** image 'alt' attribute */
  // alt?: string;
  // /** image width in pixels */
  // width?: number;
  // /** image height in pixels */
  // height?: number;
  // /** `object-fit` setting */
  // imageFit?: ImageFit;
  // /** alternative images to be passed to the 'srcSet' */
  // srcSet?: ImageSource[];

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
  const selectedPaintingId = params.get('selected');
  const selectedPainting = selectedPaintingId && paintings.find((p) => p.id === selectedPaintingId);

  const photos = paintings.map((p) => {
    return {
      id: p.id,
      src: p.frontPhotoUrl,
      width: p.width, // These are inches not pixels, but the ratio should be the same... will this work? lol
      height: p.height,
      alt: p.title,
      key: p.id,
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
      {selectedPainting && <PaintingLightBox painting={selectedPainting} />}
    </div>
  )
}

export default function PhotoGallery() {
  const paintings = usePaintings();

  zoomies.register()
  return (
    <div>
    {
      paintings === 'loading' ? (
        <div className="loading">
          <l-zoomies/>
        </div>
      ) : paintings === 'error' ? (
        <div className="loading">Error loading paintings</div>
      ) : <PhotoGalleryImpl paintings={paintings} />
    }
    </div>
  )
}