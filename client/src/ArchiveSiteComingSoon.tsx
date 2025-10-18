import { Button } from "antd";
import { NavLink } from "react-router-dom";


export default function ArchiveSiteComingSoon() {
  return (
    <div className="text-pretty" style={{ width: "min(650px, 100vw)" }}>
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">Archive site coming soon!</h1>
          <p className="max-w-[calc(100vw - 40px)]">
            Some info about it.
          </p>
        </div>
      </div>
      <Button type="link" ghost>
        <NavLink to="/adoption-project" target="_blank">
          Visit the Adoption Project site
        </NavLink>
      </Button>
    </div>
  );
}