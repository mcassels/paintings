import { useParams } from "react-router-dom";

export default function DecadeDetailPage() {
  const { year } = useParams<{ year: string }>();

  return (
    <div>{`Artwork from the ${year}s`}</div>
  );
}