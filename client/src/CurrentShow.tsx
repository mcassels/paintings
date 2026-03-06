import { Card } from "antd";
import { SHOWS } from "./constants";

const showIsOn = process.env.REACT_APP_SHOW_IS_ON === 'true';
const showKey = process.env.REACT_APP_SHOW_KEY ?? '';
const currentShow = showIsOn ? SHOWS[showKey] : null;

export default function CurrentShow() {
  return (
    <div
      className="flex-1 min-h-screen bg-cover bg-center px-4 lg:pl-20 lg:mx-0 mx-auto"
      style={{
        backgroundImage:
          "url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)",
      }}
    >
      <div className="py-6 space-y-6">
        <Card style={{ maxWidth: "750px", borderRadius: "unset" }}>
          <div className="text-lg font-semibold py-2">{currentShow ? `Show on now: ${currentShow.title}` : 'Current Show'}</div>
          {currentShow ? (
            <div className="flex flex-col space-y-2">
              <div>{currentShow.blurb}</div>
              <a
                href={currentShow.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit {currentShow.title}
                <i className="fa-solid fa-up-right-from-square pl-2" />
              </a>
            </div>
          ) : (
            <p className="text-gray-600">No current show. Please check back soon!</p>
          )}
        </Card>
      </div>
    </div>
  );
}
