import { useQuery } from "@tanstack/react-query";
import { Painting, PaintingsResponse } from "./types";

const paintingsTableUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblY6WWDZPflob9MC";

function getTags(painting: Omit<Painting, 'tags'>): Set<string> {
  const tags = new Set<string>();
  painting.subjectMatter.forEach((tag) => tags.add(tag));
  if (painting.year) {
    const decade = Math.floor(painting.year / 10) * 10;
    tags.add(`${decade}s`);
  }
  return tags;
}

async function fetchPaintings(): Promise<Painting[]> {
  const response = await fetch(
    paintingsTableUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  // TODO: THIS IS ONLY RETURNING FIRST 100
  // Need to handle pagination!!
  const data = await response.json();

  const paintings: Painting[] = [];

  for (const record of data.records) {
    const fields = record.fields;
    const painting: Omit<Painting, 'tags'> = {
      id: fields.id.toUpperCase(),
      title: fields.title,
      frontPhotoUrl: fields.front_photo_url,
      backPhotoUrl: fields.back_photo_url,
      year: fields.year,
      yearGuess: fields.year_guess,
      damageLevel: fields.damage_level,
      medium: fields.medium,
      height: fields.height,
      width: fields.width,
      predominantColors: fields.predominant_color || [],
      subjectMatter: fields.subject_matter || [],
      conditionNotes: fields.condition_notes,
    };
    paintings.push({
      ...painting,
      tags: getTags(painting),
    });
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