import { useQuery } from "@tanstack/react-query";
import { fetchAllTableRecordsArchiveSite } from "./utils";
import { ArchivePainting, ArchivePaintingsResponse } from "./archiveTypes";

// function getFetchUrl(decade: string|null): string {
//   const baseUrl = `https://api.airtable.com/v0/${process.env.REACT_APP_ARCHIVE_AIRTABLE_BASE}/${process.env.REACT_APP_ARCHIVE_AIRTABLE_TABLE}`;
//   if (!decade) {
//     return baseUrl
//   }
//   // used url encoder here https://codepen.io/airtable/full/MeXqOg
//   // With query e.g.:
//   // {decade} = "1950"
//   const filterFormula = `filterByFormula=AND(%7Bdecade%7D+%3D+%22${decade}%22)`;
//   return `${baseUrl}?${filterFormula}`;
// }

function getMedium(fields: any): string|undefined {
  let medium = fields.medium;
  if (!medium && fields.medium_multi_select && fields.substrate_multi_select) {
    medium = `${fields.medium_multi_select} on ${fields.substrate_multi_select}`;
  }
  if (!medium) {
    return undefined;
  }
  const splits = medium.split(' ');
  if (splits.length < 3) {
    return medium;
  }
  const formatted = `${splits[0].charAt(0).toUpperCase() + splits[0].substr(1).toLowerCase()} ${splits[1]} ${splits[2].charAt(0).toUpperCase() + splits[2].substr(1).toLowerCase()}`;
  if (splits.length > 3) {
    return `${formatted} ${splits.slice(3).join(' ')}`;
  }
  return formatted;
}

async function fetchArchivePaintings(): Promise<ArchivePainting[]> {
  const fetchUrl = `https://api.airtable.com/v0/${process.env.REACT_APP_ARCHIVE_AIRTABLE_BASE}/${process.env.REACT_APP_ARCHIVE_AIRTABLE_TABLE}`;
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