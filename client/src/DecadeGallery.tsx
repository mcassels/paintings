import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useArchivePaintings } from "./useArchivePaintings";
import { Card, Image, Pagination, Spin } from "antd";
import LoadingError from "./LoadingError";
import { ArchivePainting } from "./archiveTypes";
import { getPaintingYearString, reportAnalytics } from "./utils";
import ArchivePaintingLightbox from "./ArchivePaintingLightbox";

function sortPaintings(paintings: ArchivePainting[]) {
  return paintings.sort((a, b) => {
    if (a.bestKnownYear !== b.bestKnownYear) {
      return a.bestKnownYear - b.bestKnownYear;
    }
    return a.title.localeCompare(b.title);
  });
}

function getPaintingDescription(painting: ArchivePainting) {
  return `${painting.title}, ${getPaintingYearString(painting)}`;
}

interface ArchivePaintingCardProps {
  painting: ArchivePainting;
  onPaintingClick: () => void;
}

function ArchivePaintingCard(props: ArchivePaintingCardProps) {
  const { painting, onPaintingClick } = props;
  const imageAlt = `Painting titled "${painting.title}" from ${painting.year}`;

  return (
    <Card
      hoverable
      key={painting.id}
      className="group"
      style={{ width: "min(95%, 400px)" }}
      onClick={onPaintingClick}
    >
      <div className="flex flex-col flex-shrink-0 space-y-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={painting.frontPhotoUrl}
          />
          <div>{getPaintingDescription(painting)}</div>
      </div>
    </Card>
  );
}

const PAGE_SIZE = 15;

function ArchivePaintingsGallery(props: { paintings: ArchivePainting[] }) {
  const { paintings } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const pageNumFromParams = params.get('page');
  const pageNum = Math.min(pageNumFromParams ? parseInt(pageNumFromParams) : 1, Math.ceil(paintings.length / PAGE_SIZE));

  function setPageNum(pageNum: number) {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set('page', pageNum.toString());
    navigate({
      search: nextParams.toString()
    });
  }

  return (
    <div>
      <div>{`${paintings.length} works`}</div>
      <div className="grid grid-cols-4 gap-2">
        {paintings.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE).map((painting) => (
          <div className="pb-4" key={painting.id}>
            <ArchivePaintingCard
              painting={painting}
              onPaintingClick={() => {
                const nextParams = new URLSearchParams(location.search);
                nextParams.set('selected', painting.id);
                reportAnalytics('click_painting', { painting_id: painting.id });
                navigate({
                  pathname: location.pathname,
                  search: nextParams.toString()
                });
              }}
            />
          </div>
        ))}
      </div>
      <div className="py-4 min-w-[calc(100vw-200px)]">
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
      <ArchivePaintingLightbox paintings={paintings} />
    </div>
  );
}

function DecadeGalleryInner(props: { decade: string|null}) {
  const { decade } = props;
  const paintings = useArchivePaintings(decade ? decade : null);

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
    <div>
      <ArchivePaintingsGallery paintings={sortPaintings(paintings)} />
    </div>
  );
}

export default function DecadeGallery() {
  const { decade } = useParams<{ decade: string }>();

  return (
    <div>
      <div>{`Artwork from the ${decade}s`}</div>
      <DecadeGalleryInner decade={decade || null} />
    </div>
  );
}