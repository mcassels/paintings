import React from "react";
import { Select, SliderSingleProps, Tag } from "antd";
import { Painting, PaintingTags } from "./types";
import { useLocation, useNavigate } from "react-router";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

interface MultiSelectFilterProps {
  paintings: Painting[];
  paramKey: string;
  tagKey: keyof PaintingTags;
  title: string;
  valueOrder?: any[];
}

function MultiSelectFilter(props: MultiSelectFilterProps) {
  const {
    paintings,
    paramKey,
    tagKey,
    title,
    valueOrder,
  } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  function handleChange(values: string[]) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(paramKey);
    values.forEach((value) => {
      searchParams.append(paramKey, value);
    });
    // Always reset to first page when filters change
    searchParams.set('page', '1');
    navigate({
      search: searchParams.toString(),
    });
  }

  return (
    <Select
      title={title}
      mode="multiple"
      allowClear
      style={{ width: '180px', fontSize: '12px'}}
      placeholder={title}
      defaultValue={params.getAll(paramKey)}
      onChange={(values) => handleChange(values)}
      options={Array.from(new Set(paintings.flatMap((p) => p.tags[tagKey])))
        .sort((a: any, b: any) => {
          if (valueOrder) {
            return valueOrder.indexOf(a) - valueOrder.indexOf(b);
          }
          return a - b;
        })
        .map((value) => { return { value, label: value }; })}
    />
  );
}


interface GalleryFiltersProps {
  paintings: Painting[];
}

export default function GalleryFilters(props: GalleryFiltersProps) {
  const { paintings } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const marks: SliderSingleProps['marks'] = {};
  for (let i = 1; i <= 5; i++) {
    marks[i] = <div className="text-xxs">{i}</div>;
  }

  return (
    <div className="mb-2 flex">
      <div className="flex flex-col justify-center">
        <div className="font-bold pr-2">
          Filters
        </div>
      </div>
      <div className="flex space-x-2 flex-wrap">
        <div className="ml-2">
          <MultiSelectFilter
            paintings={paintings}
            paramKey="decade"
            tagKey="decade"
            title="Decade"
          />
        </div>
        <MultiSelectFilter
          paintings={paintings}
          paramKey="color"
          tagKey="predominantColors"
          title="Predominant colours"
        />
        <MultiSelectFilter
          paintings={paintings}
          paramKey="subject"
          tagKey="subjectMatter"
          title="Subject matter"
        />
        <MultiSelectFilter
          paintings={paintings}
          paramKey="damage_level"
          tagKey="damageLevel"
          title="Damage level"
        />
        <MultiSelectFilter
          paintings={paintings}
          paramKey="status"
          tagKey="status"
          title="Availability"
          valueOrder={['available', 'pending', 'adopted']}
        />
        <div className="flex flex-col justify-center">
          <Tag.CheckableTag
            style={{
              height: 'fit-content',
              color: '#f5206e',
              fontWeight: params.get('favourites') === 'true' ? 'bold' : undefined,
              backgroundColor: 'unset',
            }}
            checked={params.has('favourites')}
            onChange={(checked) => {
              const searchParams = new URLSearchParams(location.search);
              if (checked) {
                searchParams.set('favourites', 'true');
              } else {
                searchParams.delete('favourites');
              }
              // Always reset to first page when filters change
              searchParams.set('page', '1');
              navigate({
                search: searchParams.toString()
              });
            }}
          >
            <div className="flex space-x-1 hover:font-bold">
              {params.get('favourites') === 'true' ? <HeartFilled className="text-xxs" /> : <HeartOutlined className="text-xxs" /> }
              <div>My Favourites</div>
            </div>
          </Tag.CheckableTag>
        </div>
      </div>
    </div>
  );
}