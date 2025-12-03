import { Card, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

interface DecadeCardConfig {
  startYear: number;
  description: string;
  imageUrl: string;
}

const DECADE_CARDS: Array<DecadeCardConfig> = [
  {
    startYear: 1950,
    description: "description of 1950s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg172.jpeg",
  },
  {
    startYear: 1960,
    description: "description of 1960s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg553.jpeg",
  },
  {
    startYear: 1970,
    description: "description of 1970s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg160.jpeg",
  },
  {
    startYear: 1980,
    description: "description of 1980s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg687.jpeg",
  },
  {
    startYear: 1990,
    description: "description of 1990s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg115.jpeg",
  },
  {
    startYear: 2000,
    description: "description of 2000s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg178.jpeg",
  },
  {
    startYear: 2010,
    description: "description of 2010s",
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg277.jpeg",
  }
];

interface DecadeCardProps {
  config: DecadeCardConfig;
}

function DecadeCard(props: DecadeCardProps) {
  const { startYear, description, imageUrl } = props.config;
  const imageAlt = `Artwork from the ${startYear}s`;
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    debugger;
    const base = location.pathname.replace(/\/$/, ""); // remove trailing slash
    navigate(`${base}/${startYear}`);
  };

  return (
    <Card
      hoverable
      key={startYear}
      style={{ width: "min(95%, 400px)"}}
      onClick={handleClick}
    >
      <div className="text-lg font-semibold pb-2">{`The ${startYear}s`}</div>
      <div className="flex flex-col flex-shrink-0 space-y-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={imageUrl}
          />
          <div>{description}</div>
      </div>
    </Card>
  );
}

export default function ArchiveGallery() {
  return (
    <div className="text-pretty p-4">
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">The Archive</h1>
          <p className="max-w-[calc(100vw - 40px)]">
            View works by decade.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {DECADE_CARDS.map((config) => (
          <div className="pb-4" key={config.startYear}>
            <DecadeCard config={config} />
          </div>
        ))}
      </div>
    </div>
  );
}