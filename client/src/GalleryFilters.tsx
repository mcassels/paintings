import { Select, Tag } from "antd";
import React from "react";
import { Painting } from "./types";
import { useLocation, useNavigate } from "react-router";

interface GalleryFiltersProps {
  paintings: Painting[];
}

export default function GalleryFilters(props: GalleryFiltersProps) {
  const { paintings } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  function handleChange(key: string, values: string[]) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(key);
    values.forEach((value) => {
      searchParams.append(key, value);
    });
    navigate({
      search: searchParams.toString(),
    });
  }

  return (
    <div className="mb-4">
      <div className="w-[300px]">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Decades"
          defaultValue={params.getAll('decade')}
          onChange={(values) => handleChange('decade', values)}
          options={Array.from(new Set(paintings.map((p) => p.tags.decade))).sort().map((decade) => { return { value: decade, label: decade }; })}
        />
      </div>
      {/* {
        Array.from(tags).sort().map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) => {
              const searchParams = new URLSearchParams(location.search);
              if (checked) {
                searchParams.append('tag', tag);
              } else {
                const nextSelected = selectedTags.filter((t) => t !== tag);
                if (nextSelected.length === 0) {
                  searchParams.delete('tag');
                } else {
                  searchParams.set('tag', nextSelected.join(','));
                }
              }
              // Always reset to first page when filters change
              searchParams.set('page', '1');
              navigate({
                search: searchParams.toString()
              });
            
            }}
          >
            {tag}
          </Tag.CheckableTag>
        
        ))
      } */}
    </div>
  );
}