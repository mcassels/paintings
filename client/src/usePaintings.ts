import { useQuery } from "@tanstack/react-query";
import { Painting, PaintingsResponse, PaintingStatus, PaintingTags } from "./types";

// used url encoder here https://codepen.io/airtable/full/MeXqOg
const paintingsTableUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblY6WWDZPflob9MC?filterByFormula=AND(%7Bhidden%7D+!%3D+TRUE()%2C+%7Bdamage_level%7D+%3E+0)";

function getTags(painting: Omit<Painting, 'tags'>): PaintingTags {
  // We have previously filtered out paintings without a year or yearGuess
  const year: number = (painting.year || painting.yearGuess)!;
  const decade = `${Math.floor(year / 10) * 10}s`;
  return {
    decade,
    damageLevel: painting.damageLevel,
    predominantColors: painting.predominantColors,
    status: painting.status,
  };
}

async function fetchAllTableRecords(tableUrl: string): Promise<any[]> {
  const records: any[] = [];
  let offset: string|undefined = undefined;

  let i = 0;
  while (true && i < 1000) { // 1000 is an arbitrary limit to prevent infinite loops
    const response: any = await fetch(
      `${tableUrl}${offset ? `&offset=${offset}` : ''}`,
      { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
    );

    const data: any = await response.json();
    records.push(...data.records);
    if (!data.offset) {
      break;
    }
    offset = data.offset;
    i++;
  }
  return records;
}

async function fetchPaintings(): Promise<Painting[]> {
  const records = await fetchAllTableRecords(paintingsTableUrl);

  const paintings: Painting[] = [];

  for (const record of records) {
    try {
      const fields = record.fields;
      if (!fields.id || !fields.title || !fields.front_photo_url || !fields.width || !fields.height) {
        // IF we need to handle paintings that have width and/or height missing,
        // we need to account for this in the photo gallery so that the photos don't show up massive.
        console.error('Skipping painting with missing fields', fields);
        continue;
      }

      // Every painting must either have a year or a year guess
      if (!fields.year && !fields.year_guess) {
        console.error('Skipping painting with missing year', fields);
        continue;
      }
      let status: PaintingStatus = 'Available';
      if (fields.adoption_pending) {
        status = 'Pending';
      } else if (fields.red_dot) {
        status = 'Sold';
      }
      // TODO: later, once these are act
      const painting: Omit<Painting, 'tags'> = {
        id: fields.id.toUpperCase(),
        title: fields.title,
        frontPhotoUrl: fields.front_photo_url,
        backPhotoUrl: fields.back_photo_url,
        year: fields.year,
        yearGuess: fields.year_guess,
        damageLevel: Math.ceil(fields.damage_level),
        medium: fields.medium,
        height: fields.height,
        width: fields.width,
        predominantColors: fields.predominant_color || [],
        subjectMatter: fields.subject_matter || [],
        conditionNotes: fields.condition_notes,
        isFramed: fields.is_framed,
        status,
      };
      paintings.push({
        ...painting,
        tags: getTags(painting),
      });
    } catch (e) {
      console.error('Error parsing painting', record, e);
      continue;
    }
  }
  return paintings.sort((a, b) => {
    return Number(a.id.slice(2, undefined)) - Number((b.id.slice(2, undefined)));
  });
  // TODO: uncomment this!
  // return paintings.sort(() => {
  //   // Random number between -1 and 1
  //   return (Math.random() * 2) - 1;
  // });
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