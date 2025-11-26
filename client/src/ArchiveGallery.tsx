import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import { Painting } from './types';
import { usePaintings } from './usePaintings';
import { Empty, Pagination, Spin } from 'antd';
import GalleryFilters from './GalleryFilters';
import PaintingLightbox from './PaintingLightbox';
import { SAVED_PAINTING_KEY } from './constants';
import { getPaintingAltText, reportAnalytics } from './utils';
import LoadingError from './LoadingError';
import { PhotoGalleryImpl } from './PhotoGallery';
import { usePaintingsGeneric } from './usePaintings';

export default function ArchiveGallery() {
  const paintings = usePaintingsGeneric("my_tabl");

  if (paintings === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (paintings === 'error') {
    return <LoadingError message="Error loading paintings" />;
  }

  return (
    <PhotoGalleryImpl paintings={paintings} />
  );
}