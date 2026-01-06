import { useNavigate, useParams } from "react-router-dom";
import { useArchivePaintings } from "./useArchivePaintings";
import { Card, Image, Spin } from "antd";
import LoadingError from "./LoadingError";
import { ArchivePainting } from "./archiveTypes";
import { getPaintingYearString } from "./utils";

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

// TODO: pagination
function ArchivePaintingsGallery(props: { paintings: ArchivePainting[] }) {
  const { paintings } = props;

  // TODO: use lightbox for painting detail instead, so that you can use arrow key navigation
  const navigate = useNavigate();

  return (
    <div>
      <div>{`${paintings.length} works`}</div>
      <div className="grid grid-cols-4 gap-2">
        {paintings.map((painting) => (
          <div className="pb-4" key={painting.id}>
            <ArchivePaintingCard
              painting={painting}
              onPaintingClick={() => navigate(`/work/${painting.id}`)}
            />
          </div>
        ))}
      </div>
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