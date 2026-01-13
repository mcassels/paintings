import { Button } from "antd";

export default function PageNotFound() {
  return (
    <div className="text-pretty" style={{ width: "min(650px, 100vw)" }}>
      <div className="px-[10px]">
        <div className="pb-2">
          <h1 className="text-lg">Page Not Found</h1>
          <p className="max-w-[calc(100vw - 40px)]">
            This page does not exist.
          </p>
          <Button type="link" href="/archive/home">Return Home</Button>
        </div>
      </div>
    </div>
  );
}