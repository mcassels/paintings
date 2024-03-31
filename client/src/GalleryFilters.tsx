import { Tag } from "antd";
import React from "react";
import { Painting } from "./types";
import { useLocation, useNavigate } from "react-router";

interface GalleryFiltersProps {
  paintings: Painting[];
}

export default function GalleryFilters(props: GalleryFiltersProps) {
  const { paintings } = props;
  const tags: Set<string> = new Set(paintings.flatMap((p) => Array.from(p.tags)));

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedTags = params.getAll('tag');

  return (
    <div className="mb-4">
      {
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
      }
    </div>
  );
}