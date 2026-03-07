import { useQuery } from "@tanstack/react-query";
import { fetchAllTableRecords, fetchAllTableRecordsArchiveSite } from "./utils";
import { ArchivePainting, ArchivePaintingsResponse } from "./archiveTypes";
import { AIRTABLE_PAINTINGS_TABLE } from "./constants";

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
  const [archiveRecords, brokenRecords] = await Promise.all([
    fetchAllTableRecordsArchiveSite(process.env.REACT_APP_ARCHIVE_AIRTABLE_TABLE!),
    // AND({hidden} != TRUE(), {damage_level} > 0)
    fetchAllTableRecords(`${AIRTABLE_PAINTINGS_TABLE}?filterByFormula=AND(%7Bhidden%7D+!%3D+TRUE()%2C+%7Bdamage_level%7D+%3E+0)`),
  ]);

  const paintings: ArchivePainting[] = [];

  for (const record of archiveRecords) {
    try {
      const fields = record.fields;
      if (fields.hide === true) {
        continue;
      }

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

  for (const record of brokenRecords) {
    try {
      const fields = record.fields;

      if (!fields.id || !fields.title || !fields.front_photo_url) {
        console.error('Skipping broken painting with missing required fields', fields);
        continue;
      }

      const bestKnownYear: number|undefined = fields.year || fields.year_guess;
      if (!bestKnownYear) {
        console.error('Skipping broken painting with missing year', fields);
        continue;
      }

      const decade = `${Math.floor(bestKnownYear / 10) * 10}`;

      const painting: ArchivePainting = {
        id: fields.id.toUpperCase(),
        airtableId: record.id,
        title: fields.title,
        frontPhotoUrl: fields.front_photo_url,
        backPhotoUrl: fields.back_photo_url,
        year: fields.year,
        yearGuess: fields.year_guess,
        bestKnownYear,
        decade,
        medium: fields.medium,
        height: fields.height,
        width: fields.width,
        subjectMatter: fields.subject_matter?.map((s: string) => s.trim()) || [],
        story: fields.story,
        damaged: true,
      };
      paintings.push(painting);
    } catch (e) {
      console.error('Error parsing broken painting', record, e);
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