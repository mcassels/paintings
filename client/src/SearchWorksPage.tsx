import { Button, Input } from "antd";
import { DecadeGalleryInner } from "./DecadeGallery";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchWorksPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const navigate = useNavigate();

  const [val, setVal] = useState("");

  function runSearch() {
    const searchParams = new URLSearchParams({"query": val.toString()});
    navigate({
      search: searchParams.toString(),
    });
  }

  return (
    <div className="text-pretty p-4">
    <div className="pb-6">
      <div>
        <h1 className="text-lg">Search Works</h1>
      </div>
      <div className="flex">
        <div className="w-[400px]">
          <Input
            placeholder="Search by title, medium, subject matter..."
            onChange={(e) => setVal(e.target.value)}
            onPressEnter={runSearch}
            onClear={() => {
              navigate({
                search: '',
              });
            }}
            allowClear
          />
        </div>
        <Button
          type="primary"
          className="ml-2 padding-x-0"
          onClick={runSearch}
          disabled={val.trim().length === 0}
        >
          <div className="flex space-x-2 items-center">
            <div>Search</div>
            <SearchOutlined className="text-lg"/>
          </div>
        </Button>
      </div>
      {query && (
        <div>
          <p className="">Displaying search results for: <span className="italic">{query}</span></p>
        </div>
      )}
    </div>
      <DecadeGalleryInner search={query || undefined} />
    </div>
  );
}