import { Painting } from "../types";
import { getPaintingInfos } from "../utils";
import { Divider } from "antd";

interface PaintingInformationProps {
  painting: Painting;
}

export default function PaintingInformation({ painting }: PaintingInformationProps) {
  const infos = getPaintingInfos(painting);
  return (
    <div className="text-sm flex space-x-1 font-normal flex-wrap">
      {
        infos.map((info, i) => {
          return (
            <div key={info} className="flex">
              {i > 0 && (
                <div className="mr-2">
                  <Divider type="vertical" style={{ height: '1rem', border: '0.5px solid #a7a7a7' }}/>
                </div>
              )}
              {info}
            </div>
          );
        })
      }
  </div>
  )
}