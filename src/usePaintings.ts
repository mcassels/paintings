import { useQuery } from "@tanstack/react-query";
import { Painting, PaintingsResponse, Photo } from "./types";

const paintingsTableUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblAePvviV6Sd00Ez";

async function fetchPaintings(): Promise<Painting[]> {
  const response = await fetch(
    paintingsTableUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );
  debugger;
  const data = await response.json();
  const paintings: Painting[] = [];

  for (const record of data.records) {
    const photos = record.fields.photo;
    if (!photos || photos.length !== 1) { // Each painting must have exactly one primary photo. TODO: do we want multiple photos per painting?
      continue;
    }
    const photo: Photo = {
      url: photos[0].url,
      height: photos[0].height,
      width: photos[0].width,
    }

    const painting: Painting = {
      id: record.fields.painting_number,
      photo,
      year: record.fields.year,
      name: record.fields.name,
      size: record.fields.size,
      status: record.fields.status,
      conditionNotes: record.fields.condition_notes,
      isFramed: record.fields.framed,
      medium: record.fields.medium,
    };
    debugger;
    paintings.push(painting);
  }
  return paintings;
}

export function usePaintings(): PaintingsResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['paintings'],
    queryFn: fetchPaintings,
    // This query should only be made once per session!
    // Never need to refetch this.
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) {
    return 'loading';
  }
  if (isError) {
    return 'error';
  }

  return data || 'error';
}