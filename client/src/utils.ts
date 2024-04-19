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

export function getIsMobile(): boolean {
  // This is the same check that the css file uses to determine mobile
  const isSizeForMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
  // However, if you are on a computer and you resize the window to be smaller than 768px, we do not want
  // to show the mobile layout, so we need to check if the window is actually a mobile device
  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
  const isMobile = isSizeForMobile && isMobileDevice;
  return isMobile;
}

export async function getAirtableTableRows(tableName: string): Promise<any> {
  const tableUrl = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE}/${tableName}/`;
  const response = await fetch(
    tableUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();
  return data;
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