import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lightbox, { ZoomRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Divider } from 'antd';
import { getPaintingYearString, reportAnalytics } from './utils';
import { ArchivePainting } from './archiveTypes';
import PaintingShareButton from './PaintingShareButton';
import { PaintingStoryButton } from './PaintingStoryButton';
import { SeeReverseButton } from './SeeReverseButton';


export function getArchivePaintingInfos(p: ArchivePainting): string[] {
  const year = getPaintingYearString(p);
  const size = `${p.height} x ${p.width}`;
  const parts = [year, size];
  // TODO: use medium and substrate multiselect columns
  if (p.medium) {
    parts.push(p.medium);
  }
  return parts;
}


interface ArchivePaintingLightboxProps {
  paintings: ArchivePainting[];
}

// TODO: move shared logic into reusable Lightbox component to be shared between ArchivePaintingLightbox and PaintingLightbox
export default function ArchivePaintingLightbox(props: ArchivePaintingLightboxProps) {
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

  const painting = paintings.find((p) => p.id === selectedPhotoId);
  if (!painting) {
    return null;
  }

  // TODO: get aspect ratio either from actual painting image dynamically or calculate and store it in airtable
  const paintingWidth = painting.width || 50;
  const paintingHeight = painting.height || 50;

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
        const infos = getArchivePaintingInfos(painting);
        const header = document.getElementById('lightbox-painting-header');
        const headerHeight = (header ? header.clientHeight : 32) + 30;
        let height = document.documentElement.clientHeight - headerHeight;
        let width = height * (paintingWidth / paintingHeight);

        // This case is usually for mobile where screen height is greater than screen width
        const screenWidth = document.documentElement.clientWidth;
        if (width > screenWidth) {
          width = screenWidth;
          height = width * (paintingHeight / paintingWidth);
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
                  </div>
                </div>
                <div className="flex painting-lightbox-buttons h-fit">
                  <PaintingStoryButton key={`painting-story-${selectedPhotoId}`} painting={painting} />
                  {painting.backPhotoUrl && (<SeeReverseButton key={`see-reverse-${selectedPhotoId}`} painting={painting} />)}
                  <PaintingShareButton key={`share-${selectedPhotoId}`} painting={painting} />
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
        let width = maxHeight * (paintingWidth / paintingHeight);
        if (width > maxWidthNoOverlap) {
          width = maxWidthNoOverlap;
          height = width * (paintingHeight / paintingWidth);
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