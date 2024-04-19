import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Lightbox, { ZoomRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { HeartOutlined, HeartFilled, ShareAltOutlined, CopyOutlined, ReadOutlined, RetweetOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, XIcon, TwitterShareButton, LinkedinShareButton, LinkedinIcon } from 'react-share';
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { Painting } from './types';
import { Button, Divider, Image, Modal, Popover, Tag } from 'antd';
import Markdown from 'react-markdown';
import { getAirtableRecord, getPaintingInfos, reportAnalytics, updateAirtableRecord } from './utils';
import { AIRTABLE_PAINTINGS_TABLE, SAVED_PAINTING_KEY } from './constants';
import DamageLevelInfoButton from './DamageLevelInfoButton';

function reportPaintingButtonClick(
  eventName: string,
  paintingId: string,
  params?: { [key: string]: string },
) {
  reportAnalytics(eventName, { paintingId, ...params });
}

async function incrementFavouriteCount(recordId: string) {
  // airtable's API does not seem to support incrementing a field
  // so we need to fetch the record, increment the field, and then PATCH it back
  try {
    const data = await getAirtableRecord(AIRTABLE_PAINTINGS_TABLE, recordId);
    if (!data || !data.fields) {
      return;
    }
    const prev = data.fields.favourite_count || 0;
    await updateAirtableRecord(AIRTABLE_PAINTINGS_TABLE, recordId, { favourite_count: prev + 1 });
  } catch (e) {
    // Not a fatal error because this doesn't prevent them from marking it as a favourite
    console.error(e);
  }
}


function SeeReverseButton(props: { painting?: Painting; }) {
  const { painting } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!painting) {
    return null;
  }
  return (
    <>
      <Modal
        title={`"${painting.title}" reverse`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        <Image
          src={painting.backPhotoUrl}
          preview={false}
          loading='lazy'
        />
      </Modal>
      <Button
        type="link"
        onClick={() => {
          setIsModalOpen(true)
          reportPaintingButtonClick('see_painting_back', painting.id);
        }}
      >
        <RetweetOutlined />
        See the back
      </Button>
    </>
  );
}

function BuyPaintingButton(props: { painting: Painting|undefined }) {
  const { painting } = props;
  if (!painting) {
    return null;
  }
  if (painting.tags.status === 'pending') {
    return (
      <Tag className="w-fit flex flex-col justify-center font-bold ml-[15px]" color="gold"><div>Pending</div></Tag>
    );
  }
  if (painting.tags.status === 'adopted') {
    return (
      <Tag className="w-fit flex flex-col justify-center font-bold ml-[15px]" color="red"><div>Adopted</div></Tag>
    );
  }
  return (
    <Button className="flex justify-center flex-col max-w-fit" type="primary" onClick={() => reportPaintingButtonClick('click_adopt_me', painting.id)}>
      <NavLink to={`/adopt?painting=${painting.id}`}>
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
    <div className="w-fit">
      <Button type="link" onClick={() => {
        setIsModalOpen(true);
        reportPaintingButtonClick('read_story', painting.id);
      }}>
        <ReadOutlined />
        Story
      </Button>
      <Modal
        title={`Story of "${painting.title}"`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>,
        ]}
      >
        <Markdown>{painting.story}</Markdown>
      </Modal>
    </div>
  );
}

function SavePaintingButton(props: { paintingId: string, airtableId?: string }) {
  const { paintingId, airtableId } = props;

  const savedPaintings = localStorage.getItem(SAVED_PAINTING_KEY)?.split(',') || [];
  const isSaved = savedPaintings.includes(paintingId);

  const [isFavourite, setIsFavourite] = React.useState(isSaved);

  function onClick() {
    // If it wasn't previously a favourite, then this painting is getting favourited
    // This block is for functions we use for tracking which paintings are favourited,
    // it's not necessary for the app to function
    if (!isFavourite) {
      reportPaintingButtonClick('favourite_painting', paintingId);
      if (airtableId) {
        incrementFavouriteCount(airtableId);
      }
    }

    setIsFavourite((prev) => !prev);
    const savedPaintings = localStorage.getItem(SAVED_PAINTING_KEY)?.split(',') || [];
    if (savedPaintings.includes(paintingId)) {
      localStorage.setItem(SAVED_PAINTING_KEY, savedPaintings.filter((p) => p !== paintingId).join(','));
    } else {
      localStorage.setItem(SAVED_PAINTING_KEY, [...savedPaintings, paintingId].join(','));

      const url = window.location.href;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  }

  return (
    <Button
      onClick={onClick}
      className="w-fit"
      type="link"
      icon={isFavourite ? <HeartFilled /> : <HeartOutlined />}
    >
      {isFavourite ? "Favourited" : "Favourite"}
    </Button>
  );
}

function ShareButton(props: { painting: Painting|undefined }) {
  const { painting } = props;
  const [open, setOpen] = useState(false);

  const afterShare = (shareDest: string) => {
    setOpen(false);
    reportPaintingButtonClick(`share`, painting?.id || '', { share_type: shareDest });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (!painting) {
    return null;
  }
  const shareUrl = window.location.href.replace("http://localhost:3000", "https://jamesgordaneer.com");
  const title = painting.title;

  const popoverContent = (
    <div className="flex flex-col Demo__some-network">
      <FacebookShareButton url={shareUrl} className="Demo__some-network__share-button">
        <FacebookIcon size={32} onClick={() => afterShare('facebook')}/>
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        onClick={() => afterShare('twitter')}
        className="Demo__some-network__share-button"
      >
        <XIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} className="Demo__some-network__share-button">
        <WhatsappIcon size={32} onClick={() => afterShare('whatsapp')} />
      </WhatsappShareButton>
      <LinkedinShareButton url={shareUrl} className="Demo__some-network__share-button">
        <LinkedinIcon size={32} round onClick={() => afterShare('linkedin')} />
      </LinkedinShareButton>
      <Button
        type="link"
        className="flex justify-center"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          afterShare('copy_link');
        }}
      >
        <CopyOutlined className="text-[20px]"/>
      </Button>
    </div>
  );
  return (
    <div className="w-fit">
      <Popover
        content={popoverContent}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="link">
          <ShareAltOutlined />
          Share
        </Button>
      </Popover>
    </div>
  );
}


interface PaintingLightboxProps {
  paintings: Painting[];
}

export default function PaintingLightbox(props: PaintingLightboxProps) {
  const { paintings } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const zoomRef: React.MutableRefObject<ZoomRef|null> = React.useRef(null);

  // Track the painting id and not index in the query params, so that the URL can be shared
  // even when the order of the paintings changes.
  const selectedPhotoId = params.get('selected');

  useEffect(() => {
    if (selectedPhotoId) {
      reportAnalytics('view_painting', { paintingId: selectedPhotoId });
    }
  }, [selectedPhotoId]);

  const selectedPhotoIdx = selectedPhotoId ? paintings.findIndex((p) => p.id === selectedPhotoId) : undefined;
  if (!selectedPhotoId || selectedPhotoIdx === -1) {
    return null;
  }

  return (
    <Lightbox
      plugins={[Zoom]}
      zoom={{ ref: zoomRef }}
      render={{
      // slideHeader: ({ slide }) => {
      slideContainer: ({ slide, children }) => {
        const painting = paintings.find((p) => p.id === (slide as any).id); // We put the id on the slide object; so it's there even though it doesn't typecheck
        if (!painting) {
          return null;
        }
        const infos = getPaintingInfos(painting, true);
        const header = document.getElementById('lightbox-painting-header');
        const headerHeight = (header ? header.clientHeight : 32) + 30;
        let height = document.documentElement.clientHeight - headerHeight;
        let width = height * (painting.width / painting.height);

        // This case is usually for mobile where screen height is greater than screen width
        const screenWidth = document.documentElement.clientWidth;
        if (width > screenWidth) {
          width = screenWidth;
          height = width * (painting.height / painting.width);
        }
        return (
          <div className="absolute top-0">
            <div className="flex justify-center mb-2 lightbox-painting-header-container">
              <div id="lightbox-painting-header" className="flex flex-wrap space-x-4 lightbox-painting-header pt-4">
                <div className="flex flex-col lightbox-painting-info">
                  <div className="text-white text-2xl font-bold flex flex-col justify-center">
                    <div>
                      {painting.title}
                    </div>
                  </div>
                  <div className="flex flex-wrap space-x-4 lightbox-painting-description">
                    {
                      infos.map((info, i) => {
                          return (
                            <div key={info} className="flex text-white text-sm lightbox-painting-description-item">
                              {i > 0 && (
                                <div className="mr-2 flex flex-col justify-center lightbox-painting-description-divider">
                                  <Divider type="vertical" style={{ height: '1rem', border: '0.5px solid #a7a7a7' }}/>
                                </div>
                              )}
                              <div className="flex flex-col justify-center">
                                <div>
                                  {info}
                                </div>
                              </div>
                            </div>
                          );
                        })
                    }
                    <div className="mr-2 flex flex-col justify-center lightbox-painting-description-divider">
                      <Divider type="vertical" style={{ height: '1rem', border: '0.5px solid #a7a7a7' }}/>
                    </div>
                    <div className="flex space-x-2 lightbox-painting-description-item text-white text-sm">
                      <div className="flex flex-col justify-center">
                        <div>
                          {`damage level ${painting.damageLevel}`}
                        </div>
                      </div>
                      <div className="damage-level-info-button">
                        <DamageLevelInfoButton
                          selectedDamageLevel={painting.damageLevel}
                        >
                          <InfoCircleOutlined />
                        </DamageLevelInfoButton>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex painting-lightbox-buttons h-fit">
                  <SavePaintingButton key={`save-painting-${selectedPhotoId}`} paintingId={selectedPhotoId} airtableId={paintings.find((p) => p.id === selectedPhotoId)?.airtableId} />
                  <PaintingStoryButton key={`painting-story-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
                  <SeeReverseButton key={`see-reverse-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
                  <ShareButton key={`share-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
                  <BuyPaintingButton key={`buy-painting-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
                </div>
              </div>
            </div>
            {children}
          </div>
        );
      }
      }}
      open={selectedPhotoIdx !== undefined}
      close={() => {
        const nextParams = new URLSearchParams(location.search);
        nextParams.delete('selected');
        navigate({ pathname: location.pathname, search: nextParams.toString()})
      }}
      index={selectedPhotoIdx}
      slides={paintings.map((painting) => {
        const photoUrl = painting.frontPhotoUrl;

        let maxHeight = document.documentElement.clientHeight - 32;
        // TODO: revisit this and try to get the entire painting to show on mobile
        if (document.documentElement.clientWidth > 768) {
          maxHeight = document.documentElement.clientHeight - 90; // height of the header on desktop
        }

        // TODO: this ends up negative on mobile!!
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
        }
      })}
      on={{
        view: ({ index }) => {
          const nextSelectedId = paintings[index]?.id;
          if (!nextSelectedId) {
            return;
          }
          const nextParams = new URLSearchParams(location.search);
          if (nextParams.get('selected') === nextSelectedId) {
            // This occurs when you first click on the painting and open the lightbox;
            // no need to update the URL in this case.
            return;
          }
          // This case is necessary when you navigate to a different painting in the lightbox
          // using the arrows.
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