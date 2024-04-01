import React, { useState } from 'react';
import { createSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery'
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import { Painting } from './types';
import { usePaintings } from './usePaintings';
import { Button, Empty, Modal, Pagination, Spin, Tag } from 'antd';
import GalleryFilters from './GalleryFilters';
import Markdown from 'react-markdown';
import { getPaintingInfos } from './utils';

function SeeReverseButton(props: { setShowReverse: React.Dispatch<React.SetStateAction<boolean>>, showReverse: boolean }) {
  const { setShowReverse, showReverse } = props;
  return (
    <Button
      type="link"
      className="w-[105px]"
      onClick={() => setShowReverse((prev) => !prev)}
    >
      {showReverse ? "See the front" : "See the back"}
    </Button>
  );
}

function BuyPaintingButton(props: { painting: Painting|undefined }) {
  if (!props.painting) {
    return null;
  }
  if (props.painting.tags.status === 'pending') {
    return (
      <Tag className="w-[125px] h-fit flex justify-center" color="gold"><div>Pending</div></Tag>
    );
  }
  if (props.painting.tags.status === 'sold') {
    return (
      <Tag className="w-[125px] h-fit flex justify-center" color="red"><div>Sold</div></Tag>
    );
  }
  return (
    <Button className="flex justify-center" type="primary">
      <NavLink to={`/adopt?painting=${props.painting.id}`}>
        Adopt me!
      </NavLink>
    </Button>
  );
}

function PaintingStoryButton(props: { painting: Painting|undefined }) {
  const { painting } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!painting || !painting.story) {
    return null;
  }
  return (
    <>
      <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
        Read story
      </Button>
      <Modal
        title={`Story of "${painting.title}"`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>,
        ]}
      >
        <Markdown>{painting.story}</Markdown>
      </Modal>
    </>
  );
}

const savedPaintingKey = 'GORDANEER_SAVED_PAINTINGS';

function SavePaintingButton(props: { paintingId: string }) {
  const savedPaintings = localStorage.getItem(savedPaintingKey)?.split(',') || [];
  const isSaved = savedPaintings.includes(props.paintingId);

  const [isFavourite, setIsFavourite] = React.useState(isSaved);

  function onClick() {
    const savedPaintings = localStorage.getItem(savedPaintingKey)?.split(',') || [];
    if (savedPaintings.includes(props.paintingId)) {
      localStorage.setItem(savedPaintingKey, savedPaintings.filter((p) => p !== props.paintingId).join(','));
    } else {
      localStorage.setItem(savedPaintingKey, [...savedPaintings, props.paintingId].join(','));

      const url = window.location.href;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
    setIsFavourite((prev) => !prev);
  }
  console.log(`Painting ${props.paintingId} is ${isFavourite ? 'favourited' : 'not favourited'}`);

  return (
    <Button
      className="mr-2"
      onClick={onClick}
      type="link"
      style={{
        color: '#f5206e',
        fontWeight: isFavourite ? "bold" : "normal",
        width: '125px',
      }}
      icon={isFavourite ? <HeartFilled /> : <HeartOutlined />}
    >
      {isFavourite ? "favourited" : "favourite"}
    </Button>
  );
}

function getPaintingDescription(p: Painting): string {
  const parts = [p.title, ...getPaintingInfos(p)];
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

  let favourited: string[]|null = null;
  if (searchParams.get('favourites') === 'true') {
    favourited = localStorage.getItem(savedPaintingKey)?.split(',') || [];
  }

  // If no filters are set, return all paintings
  if (decades.length === 0 && (minDamageLevel === 1 && maxDamageLevel === 5) && colors.length === 0 && statuses.length === 0 && !favourited) {
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

  const [showReverse, setShowReverse] = useState<boolean>(false);

  return (
    <div>
      <div>
        <GalleryFilters paintings={allPaintings}/>
      </div>
      <div style={{ maxHeight: "calc(100vh - 200px)", minHeight:"calc(100vh - 200px)", overflow: "scroll" }}>
        {
          galleryPhotos.length === 0 ? (
            <div style={{ minHeight:"calc(100vh - 200px)" }} className="flex justify-center items-center">
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
                  const nextParams = new URLSearchParams(params);
                  nextParams.set('selected', nextSelectedId);
                  navigate({
                    pathname: location.pathname,
                    search: nextParams.toString()
                  });
                }
              }}
            />
          )
        }
      </div>
      <Lightbox
        styles={{
          captionsTitleContainer: {
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
          },
          captionsDescriptionContainer: { backgroundColor: 'transparent' },
          captionsDescription: {
            paddingLeft: '40px',
            paddingBottom: '100px',
            height: '200px',
            width: '300px',
            textAlign: 'right',
          },
        }}
        carousel={{
          padding: '60px',
        }}
        toolbar={{
          buttons: selectedPhotoId ? [
            <div className="custom-button mt-4 mr-4">
              <div className="left-col">
                <SavePaintingButton key="save-painting" paintingId={selectedPhotoId} />
              </div>
              <div className="right-col flex flex-col justify-center space-y-4">
                <BuyPaintingButton key="buy-painting" painting={paintings.find((p) => p.id === selectedPhotoId)} />
                <PaintingStoryButton key="painting-story" painting={paintings.find((p) => p.id === selectedPhotoId)} />
                <SeeReverseButton key="see-reverse" showReverse={showReverse} setShowReverse={setShowReverse} />
              </div>
            </div>,
            "close",
          ] : [],

        }}
        open={selectedPhotoIdx !== undefined}
        close={() => {
          const nextParams = new URLSearchParams(params);
          nextParams.delete('selected');
          navigate({ pathname: location.pathname, search: nextParams.toString()})
          setShowReverse(false);
        }}
        index={selectedPhotoIdx}
        slides={paintings.map((painting) => {
          const photoUrl = showReverse ? painting.backPhotoUrl : painting.frontPhotoUrl;

          // The lightbox photos must take up a document.documentElement.clientHeight - 32 x document.documentElement.clientHeight - 32
          // square space, so that there is enough room for the title and toolbar, etc.
          const maxHeight = document.documentElement.clientHeight - 32;
          const maxWidthNoOverlap = document.documentElement.clientWidth - 400;

          let height = maxHeight;
          let width = maxHeight * (painting.width / painting.height);
          if (width > maxWidthNoOverlap) {
            width = maxWidthNoOverlap;
            height = width * (painting.height / painting.width);
          }
          return {
            src: photoUrl,
            width,
            height,
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
              setShowReverse(false);
            }
          }
        }}
      />
      <div className="pt-4 min-w-[calc(100vw-200px)]">
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