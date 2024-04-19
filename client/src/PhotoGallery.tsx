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
import { reportAnalytics } from './utils';

// TODO: could probably make the code in here more generic
function filterPaintings(
  searchParams: URLSearchParams,
  paintings: Painting[],
): Painting[] {
  const decades = searchParams.getAll('decade').filter((d) => d !== '');
  const colors = searchParams.getAll('color').filter((d) => d !== '');
  const subjects = searchParams.getAll('subject').filter((d) => d !== '');
  const statuses = searchParams.getAll('status').filter((d) => d !== '') as ('available'|'pending'|'adopted')[];
  const damageLevels = searchParams.getAll('damage_level').filter((d) => d !== '');

  let favourited: string[]|null = null;
  if (searchParams.get('favourites') === 'true') {
    favourited = localStorage.getItem(SAVED_PAINTING_KEY)?.split(',') || [];
  }

  // If no filters are set, return all paintings
  if (decades.length === 0 && colors.length === 0 && statuses.length === 0 && !favourited && subjects.length === 0 && damageLevels.length === 0) {
    return paintings;
  }
  // The filters for each of decade, damage, color, subject, and status are ANDed together
  // FOR EACH FILTER THAT IS SET.
  // The options within each filter are ORed together.
  return paintings.filter((p: Painting) => {
    if (damageLevels.length > 0 && !damageLevels.includes(p.damageLevel.toString())) {
      return false;
    }
    if (decades.length > 0 && !decades.includes(p.tags.decade)) {
      return false;
    }
    if (colors.length > 0 && !colors.some((c) => p.tags.predominantColors.includes(c))) {
      return false;
    }
    if (subjects.length > 0 && !subjects.some((s) => p.tags.subjectMatter.includes(s))) {
      return false;
    }
    if (statuses.length > 0 && !statuses.includes(p.tags.status)) {
      return false;
    }
    if (favourited && !favourited.includes(p.id)) {
      return false;
    }
    return true;
  });
}

const PAGE_SIZE = 15;

interface PhotoGalleryProps {
  paintings: Painting[];
}

function PhotoGalleryImpl(props: PhotoGalleryProps) {
  const { paintings: allPaintings } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const pageNumFromParams = params.get('page');
  const pageNum = Math.min(pageNumFromParams ? parseInt(pageNumFromParams) : 1, Math.ceil(allPaintings.length / PAGE_SIZE));

  function setPageNum(pageNum: number) {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set('page', pageNum.toString());
    navigate({
      search: nextParams.toString()
    });
  }

  const filteredPaintings = filterPaintings(params, allPaintings);
  const galleryPhotos = filteredPaintings.map((p) => {
    return {
      id: p.id,
      src: p.frontPhotoUrl,
      width: p.width, // These are inches not pixels, but the ratio should be the same... will this work? lol
      height: p.height,
      title: p.title,
      alt: p.title,
    };
  }).slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

  return (
    <div>
      <PaintingLightbox paintings={filteredPaintings} />
      <div className="mb-4">
        <GalleryFilters paintings={allPaintings}/>
      </div>
      <div>
        {
          galleryPhotos.length === 0 ? (
            <div className="flex justify-center align-middle pt-[20vh] pb-[30vh]">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No paintings match your filters."
              />
            </div>
          ) : (
            <Gallery
              photos={galleryPhotos}
              onClick={(e, { index }) => {
                const nextSelectedId = galleryPhotos[index]?.id;
                if (nextSelectedId) {
                  const nextParams = new URLSearchParams(location.search);
                  nextParams.set('selected', nextSelectedId);
                  reportAnalytics('click_painting', { painting_id: nextSelectedId });
                  navigate({
                    pathname: location.pathname,
                    search: nextParams.toString()
                  });
                }
              }}
              direction="row"
              targetRowHeight={300}
            />
          )
        }
      </div>
      <div className="pt-4 min-w-[calc(100vw-200px)]">
        <div className="flex justify-center">
          <Pagination
            defaultCurrent={pageNum}
            total={filteredPaintings.length}
            showSizeChanger={false}
            defaultPageSize={PAGE_SIZE}
            onChange={(page) => setPageNum(page)}
          />
        </div>
      </div>
    </div>
  )
}

export default function PhotoGallery() {
  const paintings = usePaintings();

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

  return (
    <PhotoGalleryImpl paintings={paintings} />
  );
}