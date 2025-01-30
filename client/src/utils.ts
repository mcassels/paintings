import { Painting } from "./types";

export function getPaintingInfos(p: Painting, excludeDamageLevel?: boolean): string[] {
  let year = p.year ? p.year.toString() : undefined;
  if (!year) {
    const estimated = p.yearGuess ? ` (estimated ${p.yearGuess})` : '';
    year = `ND${estimated}`;
  }
  const size = `${p.height} x ${p.width}`;
  const parts = [year, size];
  if (p.medium) {
    parts.push(p.medium);
  }
  if (p.isFramed) {
    parts.push('framed');
  }
  if (p.isFramed === false) { // undefined means we don't know if it's framed or not
    parts.push('unframed');
  }
  if (p.conditionNotes) {
    parts.push(p.conditionNotes);
  }
  if (!excludeDamageLevel) {
    parts.push(`damage level ${p.damageLevel}`);
  }
  return parts;
}

export function areAdoptionsOpen(): boolean {
  if (process.env.REACT_APP_ADOPTIONS_ARE_OPEN === 'false') {
    return false;
  }
  return true;
}

export function getPriceFromDamageLevel(damageLevel: number): number {
  for (let i = 1; i <= 5; i++) {
    if (damageLevel <= i) {
      return 600 - (100 * i);
    }
  }
  return 100;
}

export function getPaintingAltText(p: Painting): string {
  let text = `"${p.title}" by James Gordaneer. ${p.year || p.yearGuess || 'ND'}. ${p.medium}. ${p.height} x ${p.width}. Damage level: ${p.damageLevel}.`;
  if (p.conditionNotes) {
    text += ` ${p.conditionNotes}.`;
  }
  if (p.isFramed) {
    text += ' Framed.';
  }
  if (p.isFramed === false) {
    text += ' Unframed.';
  }
  if (p.status === 'adopted') {
    text += ' Adopted.';
  } else if (p.status === 'pending') {
    text += ' Adoption pending.';
  } else {
    text += ' Available.';
  }
  if (p.tags.predominantColors.length > 0) {
    text += ` Predominant colors: ${p.tags.predominantColors.join(', ')}.`;
  }
  if (p.tags.subjectMatter.length > 0) {
    text += ` Subjects: ${p.tags.subjectMatter.join(', ')}.`;
  }
  if (p.story) {
    text += ` ${p.story}.`;
  }
  return text;
}

export function getIsMobile(): boolean {
  // This is the same check that the css file uses to determine mobile
  const isSizeForMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
  // However, if you are on a computer and you resize the window to be smaller than 768px, we do not want
  // to show the mobile layout, so we need to check if the window is actually a mobile device
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
  const isMobile = isSizeForMobile && isMobileDevice;
  return isMobile;
}

// When fetching directly from airtable we need to handle pagination ourselves
async function fetchAllTableRecordsFromAirtable(fetchUrl: string): Promise<any[]> {
  const records: any[] = [];
  let offset: string|undefined = undefined;
  let i = 0;
  while (true && i < 1000) { // 1000 is an arbitrary limit to prevent infinite loops
    // TODO: Creating the url in this way is not really safe cause we're not guaranteed that
    // the fetchUrl will already have a query string in the cases where the results are paginated.
    // However currently in practice, this is the case because only the paintings fetch request
    // returns more than 100 records.
    const response: any = await fetch(
      `${fetchUrl}${offset ? `&offset=${offset}` : ''}`,
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

// The proxy server handles pagination for us.
async function fetchAllTableRecordsFromProxyServer(fetchUrl: string): Promise<any[]> {
  const response = await fetch(fetchUrl, {});
  const data = await response.json();
  return data;
}

// We don't need to handle the airtable pagination ourselves,
// because the airtable-server rust server handles it for us (within list_records).
export async function fetchAllTableRecords(
  tableAndParams: string,
): Promise<any[]> {
  const url = `${process.env.REACT_APP_AIRTABLE_FETCH_URL}${tableAndParams}`;
  const isRawAirtable = url.startsWith('https://api.airtable.com');

  if (isRawAirtable) {
    return fetchAllTableRecordsFromAirtable(url);
  }
  return fetchAllTableRecordsFromProxyServer(url);
}

export function updateAirtableRecord(
  tableName: string,
  recordId: string,
  fields: { [key: string]: string|number|boolean },
): Promise<any> {
  return fetch(
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/${tableName}/${recordId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    },
  );
}

// We do not use the airtable rust server for this because we do NOT
// want the cached value. Additionally, this is not used on first load
// of any page so it isn't needed for google SEO.
export async function getAirtableRecord(
  tableName: string,
  recordId: string,
): Promise<any> {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/${tableName}/${recordId}`,
    {
      headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` },
    },
  );
  return await res.json();
}

export function reportAnalytics(
  eventName: string,
  eventProperties: { [key: string]: string|number|boolean|null },
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics event:', eventName, eventProperties);
    return;
  }
  window.gtag('event', eventName, eventProperties);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}
