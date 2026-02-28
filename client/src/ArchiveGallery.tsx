import { Button, Card, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { DECADE_DESCRIPTIONS } from "./constants";

interface DecadeCardConfig {
  decade: string;
  imageUrl: string;
  truncateN: number;
}

const DECADE_CARDS: Array<DecadeCardConfig> = [
  {
    decade: '1950',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg172.jpeg",
    truncateN: 15,
  },
  {
    decade: '1960',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg553.jpeg",
    truncateN: 12,
  },
  {
    decade: '1970',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg160.jpeg",
    truncateN: 11,
  },
  {
    decade: '1980',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg687.jpeg",
    truncateN: 14,
  },
  {
    decade: '1990',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg115.jpeg",
    truncateN: 16,
  },
  {
    decade: '2000',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg178.jpeg",
    truncateN: 11,
  },
  {
    decade: '2010',
    imageUrl: "https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/archive/jg277.jpeg",
    truncateN: 15,
  }
];

function firstNWords(text: string, n: number): string {
  return text
    .trim()
    .split(/\s+/)   // handles spaces, tabs, newlines
    .slice(0, n)
    .join(" ");
}

interface DecadeCardProps {
  config: DecadeCardConfig;
}

function DecadeCard(props: DecadeCardProps) {
  const { decade, imageUrl, truncateN } = props.config;
  const imageAlt = `Artwork from the ${decade}s`;
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const base = location.pathname.replace(/\/$/, ""); // remove trailing slash
    navigate(`${base}/${decade}`);
  };

  return (
    <Card
      hoverable
      key={decade}
      className="group"
      style={{ width: "min(95%, 400px)"}}
      onClick={handleClick}
    >
      <div className="
      text-lg
      font-semibold
      pb-2
      cursor-pointer
      group-hover:underline
      group-hover:text-blue-600
      transition-colors
      ">
        {`The ${decade}s`}
      </div>
      <div className="flex flex-col flex-shrink-0 space-y-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={imageUrl}
          />
          <div className="decade-read-more">
            <span>{`${firstNWords(DECADE_DESCRIPTIONS[decade], truncateN)}...`}</span>
            <span><Button type="link" onClick={handleClick}>Read More</Button></span>
          </div>
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
          <p className="max-w-[900px]">
            James Gordaneer’s artistic career spanned from the mid-1950s to the mid-2010s. His work developed and evolved as he developed his own visual language and idioms by experimenting with a vast range of artistic styles. Many recurrent themes and ideas cross the decades, demonstrating Gordaneer’s life-long passion for painting trains, horses, buildings, nudes, wrestlers, and more.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DECADE_CARDS.map((config) => (
          <div className="pb-4" key={config.decade}>
            <DecadeCard config={config} />
          </div>
        ))}
      </div>
    </div>
  );
}