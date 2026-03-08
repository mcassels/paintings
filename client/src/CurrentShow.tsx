import { Badge, Button, Card } from "antd";
import { SHOWS } from "./constants";
import { NavLink } from "react-router-dom";

const showKey = process.env.REACT_APP_CURRENT_SHOW_KEY ?? '';
const currentShow = SHOWS[showKey] ?? null;

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
        <Badge.Ribbon text={currentShow ? "Show on now!" : undefined} color="blue" placement="start">
        <Card style={{ maxWidth: "750px", borderRadius: "unset" }}>
          <div className="p-4">
            <div className="text-lg font-semibold py-2">{currentShow ? currentShow.title : 'Current Show'}</div>
            {currentShow ? (
              <div className="flex flex-col space-y-4">
                <div>{currentShow.blurb}</div>
                <div>
                  <Button type="primary" ghost>
                    <NavLink to={currentShow.url} target="_blank">
                      <div className="font-semibold">
                        Visit {currentShow.title}
                        <i className="fa-solid fa-up-right-from-square pl-2"></i>
                      </div>
                    </NavLink>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No current show. Please check back soon!</p>
            )}
          </div>
        </Card>
        </Badge.Ribbon>
      </div>
    </div>
  );
}
