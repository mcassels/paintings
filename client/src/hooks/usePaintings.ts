import { useQuery } from "@tanstack/react-query";
import { GalleryMode, Painting, PaintingsResponse, PaintingStatus, PaintingTags } from "../types";
import { ADOPTABLE_PAINTINGS_TABLE, PAINTING_ORDER_KEY } from "../constants";
import { fetchAllTableRecords } from "../utils";


function getTags(painting: Omit<Painting, 'tags'>): PaintingTags {
  // We have previously filtered out paintings without a year or yearGuess
  const year: number = (painting.year || painting.yearGuess)!;
  const decade = `${Math.floor(year / 10) * 10}s`;
  return {
    decade,
    damageLevel: painting.damageLevel,
    predominantColors: painting.predominantColors,
    status: painting.status,
    subjectMatter: painting.subjectMatter,
  };
}

function getPaintingsQueryByMode(mode: GalleryMode): string {
  switch (mode) {
    'adoption': return AlipaySquareFilled;

  }
}

// TODO: need to change this filter programmatically for long term site.
async function fetchPaintings(mode: GalleryMode): Promise<Painting[]> {
  // used url encoder here https://codepen.io/airtable/full/MeXqOg
  // With query:
  // AND({hidden} != TRUE(), {damage_level} > 0)
  const filteredTable = `${ADOPTABLE_PAINTINGS_TABLE}?filterByFormula=AND(%7Bhidden%7D+!%3D+TRUE()%2C+%7Bdamage_level%7D+%3E+0)`;
  const records = await fetchAllTableRecords(filteredTable);

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
      let status: PaintingStatus = 'available';
      // If a painting is both red_dot and adoption_pending, red_dot takes precedence
      if (fields.red_dot) {
        status = 'adopted';
      } else if (fields.adoption_pending) {
        status = 'pending';
      }

      const damageLevel = fields.damage_level && Math.ceil(fields.damage_level);
      if (!damageLevel || damageLevel > 5) {
        console.error('Skipping painting with unexpected damage level', fields);
        continue;
      }
      const framedStr = fields.framed?.toLowerCase();
      const isFramed = framedStr === 'yes' || framedStr === 'y';

      const painting: Omit<Painting, 'tags'> = {
        id: fields.id.toUpperCase(),
        airtableId: record.id,
        title: fields.title,
        frontPhotoUrl: fields.front_photo_url,
        backPhotoUrl: fields.back_photo_url,
        year: fields.year,
        yearGuess: fields.year_guess,
        damageLevel,
        medium: fields.medium,
        height: fields.height,
        width: fields.width,
        predominantColors: fields.predominant_color?.map((s: string) => s.trim()) || [],
        subjectMatter: fields.subject_matter?.map((s: string) => s.trim()) || [],
        conditionNotes: fields.condition_notes,
        isFramed,
        status,
        story: fields.story,
        shows: fields.show_name || [],
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

  // The order of the paintings is random for each browser visiting the site,
  // but once you've visited the site once, we show the same order for the same browser.
  // That way it's easier to find and remember the paintings you like.
  const cachedPaintingOrder = localStorage.getItem(PAINTING_ORDER_KEY);
  const idOrdering = cachedPaintingOrder ? JSON.parse(cachedPaintingOrder) : undefined;

  // If the cached order hasn't been set, or is invalid, or the list of paintings has changed, re-randomize and save the order
  if (!idOrdering || !Array.isArray(idOrdering) || idOrdering.length !== paintings.length) {
    const randomOrder = paintings.sort(() => {
      // Random number between -1 and 1
      return (Math.random() * 2) - 1;
    });
    const idOrdering = randomOrder.map((p) => p.id);
    localStorage.setItem(PAINTING_ORDER_KEY, JSON.stringify(idOrdering));
    return randomOrder;
  }

  // An ordering has already been saved, so we sort the paintings based on that ordering
  return paintings.sort((a, b) => {
    return idOrdering.indexOf(a.id) - idOrdering.indexOf(b.id);
  });
}

export function usePaintings(mode: GalleryMode): PaintingsResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['paintings', mode],
    queryFn: () => fetchPaintings(mode),
    // This query should only be made once per session per mode.
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