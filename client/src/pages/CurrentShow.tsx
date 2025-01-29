import { Spin } from "antd";
import { useCurrentShow } from "../hooks/useCurrentShow";
import LoadingError from "../components/LoadingError";
import { Painting, Show } from "../types";
import PhotoGallery from "./PhotoGallery";

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}


function CurrentShowImpl(props: { show: Show }) {
  const { show } = props;

  const inShowFilter = (painting: Painting) => {
    return painting.shows.some((showId) => showId === show.id);
  };

  // TODO: max width might not work on responsive.
  return (
    <div className="max-w-[calc(100vw-300px)]">
      <div className="mb-6 bg-amber-100 rounded-md">
        <div className="p-6">
          <div className="text-3xl font-bold">{show.name}</div>
          <div className="italic pt-2 text-sm">{`Show runs ${formatDate(show.startDate)} to ${formatDate(show.endDate)}`}</div>
          <div className="pt-4">{show.description}</div>
        </div>
      </div>
      <PhotoGallery paintingFilterFn={inShowFilter} />
    </div>
  );
}

export default function CurrentShow() {
  const currentShow = useCurrentShow();
  if (currentShow === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (currentShow === 'error') {
    return <LoadingError message="An error occured. Please contact an administrator." />;
  }
  if (currentShow === null) {
    return (<div>There is no show on at the moment. Please check back soon!</div>)
  }
  return <CurrentShowImpl show={currentShow} />;
}