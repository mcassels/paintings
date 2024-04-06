import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { HeartOutlined, HeartFilled, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon, FacebookMessengerShareButton, FacebookMessengerIcon, XIcon, TwitterShareButton } from 'react-share';

import { Painting } from './types';
import { Button, Divider, Image, Modal, Popover, Tag } from 'antd';
import Markdown from 'react-markdown';
import { getPaintingInfos } from './utils';
import { SAVED_PAINTING_KEY } from './constants';
import DamageLevelInfoButton from './DamageLevelInfoButton';


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
        className="w-[105px]"
        onClick={() => setIsModalOpen(true)}
      >
        See the back
      </Button>
    </>
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
  if (props.painting.tags.status === 'adopted') {
    return (
      <Tag className="w-[125px] h-fit flex justify-center" color="red"><div>Adopted</div></Tag>
    );
  }
  return (
    <Button className="flex justify-center flex-col max-w-fit" type="primary">
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
    <div className="w-fit">
      <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
        Read story
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

function SavePaintingButton(props: { paintingId: string }) {
  const { paintingId } = props;
  const savedPaintings = localStorage.getItem(SAVED_PAINTING_KEY)?.split(',') || [];
  const isSaved = savedPaintings.includes(paintingId);

  const [isFavourite, setIsFavourite] = React.useState(isSaved);

  function onClick() {
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
      className="mr-2 favourite-button"
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

function ShareButton(props: { painting: Painting|undefined }) {
  const { painting } = props;
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (!painting) {
    return null;
  }
  const shareUrl = window.location.href; // TODO: should this be something else?
  const title = painting.title;

  const popoverContent = (
    <div className="flex flex-col Demo__some-network">
      <FacebookShareButton url={shareUrl} className="Demo__some-network__share-button">
        <FacebookIcon size={32} onClick={hide}/>
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        onClick={hide}
        className="Demo__some-network__share-button"
      >
        <XIcon size={32} round />
      </TwitterShareButton>
      <FacebookMessengerShareButton
        url={shareUrl}
        onClick={hide}
        appId="521270401588372"
        className="Demo__some-network__share-button"
      >
        <FacebookMessengerIcon size={32} round />
      </FacebookMessengerShareButton>
      <WhatsappShareButton url={shareUrl} className="Demo__some-network__share-button">
        <WhatsappIcon size={32} onClick={hide} />
      </WhatsappShareButton>
      <EmailShareButton
        url={shareUrl}
        subject={title}
        onClick={hide}
        body="body"
        className="Demo__some-network__share-button"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
      <Button
        type="link"
        className="flex justify-center"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          hide();
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

  // Track the painting id and not index in the query params, so that the URL can be shared
  // even when the order of the paintings changes.
  const selectedPhotoId = params.get('selected');
  const selectedPhotoIdx = selectedPhotoId ? paintings.findIndex((p) => p.id === selectedPhotoId) : undefined;
  if (!selectedPhotoId || !selectedPhotoIdx) {
    return null;
  }

  return (
    <Lightbox
      render={{
      slideContainer: ({ slide }) => {
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
          <div>
            <div id="lightbox-painting-header" className="top-0 sticky flex flex-wrap space-x-4 lightbox-painting-header">
              <div className="flex flex-col">
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
                  <div className="flex flex-col justify-center lightbox-painting-description-item">
                    <DamageLevelInfoButton
                      buttonText={`Damage level ${painting.damageLevel}`}
                      selectedDamageLevel={painting.damageLevel}
                    />
                  </div>
                </div>
              </div>
              <div>
                
              </div>

              <SavePaintingButton key={`save-painting-${selectedPhotoId}`} paintingId={selectedPhotoId} />
              <PaintingStoryButton key={`painting-story-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
              <SeeReverseButton key={`see-reverse-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
              <ShareButton key={`share-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
              <BuyPaintingButton key={`buy-painting-${selectedPhotoId}`} painting={paintings.find((p) => p.id === selectedPhotoId)} />
            </div>
            <div className="flex justify-center">
              <Image
                src={slide.src}
                title={painting.title}
                height={height}
                width={width}
                preview={false}
              />
            </div>
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
        }
      })}
      // plugins={[Captions]}
      on={{
        view: ({ index }) => {
          const nextSelectedId = paintings[index]?.id;
          if (nextSelectedId) {
            const nextParams = new URLSearchParams(location.search);
            nextParams.set('selected', nextSelectedId);
            navigate({
              pathname: location.pathname,
              search: nextParams.toString()
            });
          }
        }
      }}
    />
  )
}