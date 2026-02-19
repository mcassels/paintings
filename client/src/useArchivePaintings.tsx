import { useQuery } from "@tanstack/react-query";
import { fetchAllTableRecordsArchiveSite } from "./utils";
import { ArchivePainting, ArchivePaintingsResponse } from "./archiveTypes";

function getMedium(fields: any): string|undefined {
  let medium = fields.medium;
  if (!medium && fields.medium_multi_select && fields.substrate_multi_select) {
    medium = `${fields.medium_multi_select} on ${fields.substrate_multi_select}`;
  }
  if (!medium) {
    return undefined;
  }
  return `${medium.charAt(0).toUpperCase() + medium.substr(1).toLowerCase()}`;
}

async function fetchArchivePaintings(): Promise<ArchivePainting[]> {
  const records = await fetchAllTableRecordsArchiveSite(process.env.REACT_APP_ARCHIVE_AIRTABLE_TABLE!);

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
        medium: getMedium(fields),
        height: fields.height_inches,
        width: fields.width_inches,
        subjectMatter: fields.subject_matter?.map((s: string) => s.trim()) || [],
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

export function useArchivePaintings(): ArchivePaintingsResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['archive-paintings'],
    queryFn: () => fetchArchivePaintings(),
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