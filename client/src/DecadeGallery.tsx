import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useArchivePaintings } from "./useArchivePaintings";
import { Card, Dropdown, Image, MenuProps, Pagination, Space, Spin } from "antd";
import LoadingError from "./LoadingError";
import { ArchivePainting } from "./archiveTypes";
import { getPaintingYearString, reportAnalytics } from "./utils";
import ArchivePaintingLightbox from "./ArchivePaintingLightbox";
import { DECADE_DESCRIPTIONS } from "./constants";
import PageNotFound from "./PageNotFound";
import { DownOutlined } from "@ant-design/icons";

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
      <div className="pb-4 pl-2 italic">
        <div>{`${paintings.length} works`}</div>
      </div>
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

function filterPaintings(paintings: ArchivePainting[], decade: string|undefined, search: string|undefined) {
  if (decade) {
    return paintings.filter(p => p.decade === decade);
  }
  // TODO: use a fuzzy search library if necessary
  if (search) {
    const lowerSearch = search.toLowerCase();
    return paintings.filter(p => {
      const paintingString = `${p.title}${p.medium}${p.bestKnownYear}${p.subjectMatter.join("")}${p.story}`.toLowerCase();
      return paintingString.includes(lowerSearch);
    });
  }
  return paintings;
}

// TODO: pull this out to a separate component
export function DecadeGalleryInner(props: { decade?: string, search?: string }) {
  const { decade, search } = props;
  const paintings = useArchivePaintings();

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
  // There are not that many painting records, like less than 1000. So just fetching them all and then doing the filtering
  // here is more efficient cause it reduces the number of airtable requests required.
  return (
    <div>
      <ArchivePaintingsGallery paintings={sortPaintings(filterPaintings(paintings, decade, search))} />
    </div>
  );
}

const dropdownItems: MenuProps['items'] = Object.keys(DECADE_DESCRIPTIONS).map((decade) => ({
  key: decade,
  label: (
      <a href={`/archive/gallery/${decade}`}>
        {`The ${decade}s`}
      </a>
    ),
}));

export default function DecadeGallery() {
  const { decade } = useParams<{ decade: string }>();

  if (!decade || !(decade in DECADE_DESCRIPTIONS)) {
    return PageNotFound();
  }

  return (
    <div className="text-pretty p-4">
      <div className="px-[10px]">
        <div className="pb-2">
          <div className="flex justify-between max-w-[900px]">
            <h1 className="text-lg">{`The ${decade}s`}</h1>
            <Dropdown menu={{ items: dropdownItems }}>
              <Space>
                Explore other decades
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
          <p className="max-w-[900px]">
            {DECADE_DESCRIPTIONS[decade]}
          </p>
        </div>
      </div>
      <DecadeGalleryInner decade={decade} />
    </div>
  );
}