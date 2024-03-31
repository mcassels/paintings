import { Divider, Flex, Select, Slider, SliderSingleProps, Tag } from "antd";
import React, { ReactNode } from "react";
import { Painting, PaintingStatus } from "./types";
import { useLocation, useNavigate } from "react-router";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const statusStylesAndColors: { [K in PaintingStatus]: { color: string, style: string }} = {
  available: {
    color: '#52c41a',
    style: 'ant-tag-green'
  },
  pending: {
    color: '#faad14',
    style: 'ant-tag-gold'
  },
  sold: {
    color: '#cf1322',
    style: 'ant-tag-red'
  },
};
const statuses: PaintingStatus[] = ['available', 'pending', 'sold'];


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
    // Always reset to first page when filters change
    searchParams.set('page', '1');
    navigate({
      search: searchParams.toString(),
    });
  }

  const marks: SliderSingleProps['marks'] = {};
  for (let i = 1; i <= 5; i++) {
    marks[i] = <div className="text-xxs">{i}</div>;
  }

  return (
    <div className="mb-4 flex">
      <div>
        {
          Array.from(new Set(paintings.map((p) => p.tags.decade))).sort().map((tag) => (
            <Tag.CheckableTag
              key={tag}
              checked={params.getAll('decade').includes(tag)}
              onChange={(checked) => {
                const searchParams = new URLSearchParams(location.search);
                if (checked) {
                  searchParams.append('decade', tag);
                } else {
                  const nextSelected = searchParams.getAll('decade').filter((t) => t !== tag);
                  if (nextSelected.length === 0) {
                    searchParams.delete('decade');
                  } else {
                    searchParams.set('decade', nextSelected.join(','));
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
      <div className="mr-2">
        <Divider type="vertical" style={{ height: '1.4rem', border: '0.5px solid black' }}/>
      </div>
      <div className="flex space-x-4 ml-2">
        <div className="text-xs">
          Damage level:
        </div>
        <div className="w-[200px]">
          <Slider
            range
            min={1}
            max={5}
            marks={marks}
            value={[parseInt(params.get('damage_min') || '1'), parseInt(params.get('damage_max') || '5')]}
            onChange={(values) => {
              if (values.length !== 2) {
                return;
              }
              const [min, max] = values;
              const searchParams = new URLSearchParams(location.search);
              searchParams.set('damage_min', min.toString());
              searchParams.set('damage_max', max.toString());
              // Always reset to first page when filters change
              searchParams.set('page', '1');
              navigate({
                search: searchParams.toString()
              });
            }}
          />
        </div>
        <div className="mr-2">
          <Divider type="vertical" style={{ height: '1.4rem', border: '0.5px solid black' }}/>
        </div>
        <Select
          title="Predominant colours"
          mode="multiple"
          allowClear
          // TODO: fix this translate hack later
          style={{ width: '220px', fontSize: '12px', transform: 'translateY(-6px)'}}
          placeholder="Predominant colours"
          defaultValue={params.getAll('color')}
          onChange={(values) => handleChange('color', values)}
          options={Array.from(new Set(paintings.flatMap((p) => p.tags.predominantColors))).sort().map((value) => { return { value, label: value }; })}
        />
        <div className="mr-2">
          <Divider type="vertical" style={{ height: '1.4rem', border: '0.5px solid black' }}/>
        </div>
        <div>
          {
            statuses.map((status: PaintingStatus) => {
              return (
                <Tag.CheckableTag
                  key={status}
                  className={params.getAll('status').includes(status) ? `${status} ${status}-checked` : status}
                  style={{
                    textTransform: 'capitalize',
                    color: params.getAll('status').includes(status) ? undefined : statusStylesAndColors[status].color,
                  }}
                  checked={params.getAll('status').includes(status)}
                  onChange={(checked) => {
                    const searchParams = new URLSearchParams(location.search);
                    const statuses = new Set(searchParams.getAll('status'));
                    if (checked) {
                      statuses.add(status);
                    } else {
                      statuses.delete(status);
                    }
                    searchParams.delete('status');
                    statuses.forEach((status) => {
                      searchParams.append('status', status);
                    });
                    // Always reset to first page when filters change
                    searchParams.set('page', '1');
                    navigate({
                      search: searchParams.toString()
                    });
                  }}
                >
                  {status}
                </Tag.CheckableTag>
              );
            })
          }
        </div>
        <div className="mr-2">
          <Divider type="vertical" style={{ height: '1.4rem', border: '0.5px solid black' }}/>
        </div>
        <Tag.CheckableTag
          style={{
            height: 'fit-content',
            color: params.get('favourites') === 'true' ? 'white' : '#f5206e',
            backgroundColor: params.get('favourites') === 'true' ? '#f5206e' : 'white',
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
          <div className="flex space-x-1">
            {params.get('favourites') === 'true' ? <HeartFilled className="text-xxs" /> : <HeartOutlined className="text-xxs" /> }
            <div>Favourites</div>
          </div>
        </Tag.CheckableTag>
      </div>
    </div>
  );
}