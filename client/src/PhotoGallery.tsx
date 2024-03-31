import React from 'react';
import { createSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import { Painting } from './types';
import { usePaintings } from './usePaintings';
import { zoomies } from 'ldrs';
import { Button, Pagination } from 'antd';
import GalleryFilters from './GalleryFilters';
import { Footer } from 'antd/es/layout/layout';

function SeeReverseButton(props: { paintingId: string, paintings: Painting[] }) {
  const { paintingId, paintings } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const painting = paintings.find((p) => p.id === paintingId);
  if (!painting) {
    return null;
  }
  if (!painting.backPhotoUrl) {
    return null;
  }
  const params = new URLSearchParams(location.search);
  const isReversed = params.get('reverse') === 'true';

  return (
    <Button
      className="mr-4"
      type="link"
      onClick={() => {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({
            selected: paintingId,
            reverse: isReversed ? 'false' : 'true',
          }).toString()
        });
      }}
    >
      {isReversed ? "See painting" : "See reverse"}
    </Button>
  );
}

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
      {isFavourite ? "favourited" : "favourite"}
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

function filterPaintings(
  searchParams: URLSearchParams,
  paintings: Painting[],
): Painting[] {
  const decades = searchParams.getAll('decade').filter((d) => d !== '');
  const minDamageLevelParam = searchParams.get('damage_min');
  const maxDamageLevelParam = searchParams.get('damage_max');
  const minDamageLevel = minDamageLevelParam ? parseInt(minDamageLevelParam) : 1;
  const maxDamageLevel = maxDamageLevelParam ? parseInt(maxDamageLevelParam) : 5;
  const colors = searchParams.getAll('color').filter((d) => d !== '');
  const statuses = searchParams.getAll('status').filter((d) => d !== '') as ('available'|'pending'|'sold')[];

  // If no filters are set, return all paintings
  if (decades.length === 0 && (minDamageLevel === 1 && maxDamageLevel === 5) && colors.length === 0 && statuses.length === 0) {
    return paintings;
  }
  // The filters for each of decade, damage, color, and status are ANDed together
  // FOR EACH FILTER THAT IS SET.
  // The options within each filter are ORed together.
  return paintings.filter((p: Painting) => {
    if (p.damageLevel < minDamageLevel || p.damageLevel > maxDamageLevel) {
      return false;
    }
    if (decades.length > 0 && !decades.includes(p.tags.decade)) {
      return false;
    }
    if (colors.length > 0 && !colors.some((c) => p.tags.predominantColors.includes(c))) {
      return false;
    }
    if (statuses.length > 0 && !statuses.includes(p.tags.status)) {
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
  // Do not let user go to a page greater than the last page
  // TODO: redirect invalid or unset page numbers such that the url updates?
  const pageNum = Math.min(pageNumFromParams ? parseInt(pageNumFromParams) : 1, Math.ceil(allPaintings.length / PAGE_SIZE));

  function setPageNum(pageNum: number) {
    navigate({
      search: createSearchParams({
        ...params,
        page: pageNum.toString(),
      }).toString()
    });
  }

  const paintings = filterPaintings(params, allPaintings);

  // Track the painting id and not index in the header, so that the URL can be shared
  // even when the order of the paintings changes.
  const selectedPhotoId = params.get('selected');
  const selectedPhotoIdx = selectedPhotoId ? paintings.findIndex((p) => p.id === selectedPhotoId) : undefined;
  const showReverse = params.get('reverse') === 'true';

  const galleryPhotos = paintings.map((p) => {
    return {
      id: p.id,
      src: p.frontPhotoUrl,
      width: p.width, // These are inches not pixels, but the ratio should be the same... will this work? lol
      height: p.height,
      caption: p.title,
      title: p.title,
      description: getPaintingDescription(p),
    };
  }).slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

  return (
    <div>
      <div>
        <GalleryFilters paintings={allPaintings}/>
      </div>
      <div style={{ maxHeight: "calc(100vh - 200px)", minHeight:"calc(100vh - 200px)", overflow: "scroll" }}>
        <Gallery
          photos={galleryPhotos}
          onClick={(e, { index }) => {
            const nextSelectedId = galleryPhotos[index]?.id;
            if (nextSelectedId) {
              const nextParams = new URLSearchParams(params);
              nextParams.set('selected', nextSelectedId);
              navigate({
                pathname: location.pathname,
                search: nextParams.toString()
              });
            }
          }}
        />
      </div>
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
            <SeeReverseButton key="see-reverse" paintingId={selectedPhotoId} paintings={paintings} />,
            <SavePaintingButton key="save-painting" paintingId={selectedPhotoId} />,
            <BuyPaintingButton key="buy-painting" paintingId={selectedPhotoId} />,
            "close",
          ] : [],
        }}
        open={selectedPhotoIdx !== undefined}
        close={() => {
          const nextParams = new URLSearchParams(params);
          nextParams.delete('selected');
          navigate({ pathname: location.pathname, search: nextParams.toString()})
        }}
        index={selectedPhotoIdx}
        slides={paintings.map((painting) => {
          const photoUrl = showReverse ? painting.backPhotoUrl : painting.frontPhotoUrl;
          return {
            src: photoUrl,
            width: painting.width * 100,
            height: painting.height * 100,
            caption: painting.title,
            id: painting.id,
            title: `${showReverse ? '(VERSO) ' : ''}${painting.title}`,
            description: getPaintingDescription(painting),
          }
        })}
        plugins={[Captions]}
        on={{
          view: ({ index }) => {
            const nextSelectedId = galleryPhotos[index]?.id;
            if (nextSelectedId) {
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...params,
                  selected: nextSelectedId.toString(),
                }).toString()
              });
            }
          }
        }}
      />
      <div className="pt-4 min-w-[calc(100vw-154px)]">
        <div className="flex justify-center">
            <Pagination
            defaultCurrent={pageNum}
            total={paintings.length}
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

  return (
    <PhotoGalleryImpl paintings={paintings} />
  );
}