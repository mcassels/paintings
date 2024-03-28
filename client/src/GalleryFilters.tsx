import { Tag } from "antd";
import React from "react";
import { Painting } from "./types";
import { useNavigate } from "react-router";

interface GalleryFiltersProps {
  paintings: Painting[];
}

export default function GalleryFilters(props: GalleryFiltersProps) {
  const { paintings } = props;
  const tags: Set<string> = new Set(paintings.flatMap((p) => Array.from(p.tags)));

  const navigate = useNavigate();
  const params = new URLSearchParams(document.location.search);
  const selectedTags = params.getAll('tag');

  return (
    <div className="mb-6">
      {
        Array.from(tags).sort().map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) => {
              const searchParams = new URLSearchParams(document.location.search);
              if (checked) {
                searchParams.append('tag', tag);
              } else {
                searchParams.set('tag', selectedTags.filter((t) => t !== tag).join(','));
              }
              debugger;
              navigate({
                search: searchParams.toString()
              });
            
            }}
          >
            {tag}
          </Tag.CheckableTag>
        
        ))
      }
    </div>
  );
}