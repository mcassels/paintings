import { useQuery } from "@tanstack/react-query";
import { fetchAllTableRecordsArchiveSite } from "./utils";
import { ArchivePainting, ArchivePaintingsResponse } from "./archiveTypes";

function getFetchUrl(decade: string|null): string {
  const baseUrl = `https://api.airtable.com/v0/${process.env.REACT_APP_ARCHIVE_AIRTABLE_BASE}/${process.env.REACT_APP_ARCHIVE_AIRTABLE_TABLE}`;
  if (!decade) {
    return baseUrl
  }
  // used url encoder here https://codepen.io/airtable/full/MeXqOg
  // With query e.g.:
  // {decade} = "1950"
  const filterFormula = `filterByFormula=AND(%7Bdecade%7D+%3D+%22${decade}%22)`;
  return `${baseUrl}?${filterFormula}`;
}

async function fetchArchivePaintings(decade: string|null): Promise<ArchivePainting[]> {
  const fetchUrl = getFetchUrl(decade);
  const records = await fetchAllTableRecordsArchiveSite(fetchUrl);

  const paintings: ArchivePainting[] = [];

  for (const record of records) {
    try {
      const fields = record.fields;
      if (!fields.id || !fields.title || !fields.front_photo_url || !fields.best_known_year || !fields.decade) {
        console.error('Skipping painting with missing required fields', fields);
        continue;
      }

      const painting: ArchivePainting = {
        id: fields.id.toUpperCase(),
        airtableId: record.id,
        title: fields.title,
        frontPhotoUrl: fields.front_photo_url,
        backPhotoUrl: fields.back_photo_url,
        year: fields.year,
        yearGuess: fields.year_guess,
        bestKnownYear: fields.best_known_year,
        decade: fields.decade,
        medium: fields.medium,
        height: fields.height_inches,
        width: fields.width_inches,
        predominantColors: fields.predominant_color?.map((s: string) => s.trim()) || [],
        subjectMatter: fields.subject_matter?.map((s: string) => s.trim()) || [],
        conditionNotes: fields.condition_notes,
        isFramed: fields.framed === true,
        story: fields.story,
        damaged: fields.damaged === true,
      };
      paintings.push(painting);
    } catch (e) {
      console.error('Error parsing painting', record, e);
      continue;
    }
  }
  return paintings;
}

export function useArchivePaintings(decade: string|null): ArchivePaintingsResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['paintings', decade],
    queryFn: () => fetchArchivePaintings(decade),
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