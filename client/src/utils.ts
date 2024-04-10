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
  if (process.env.REACT_APP_ADOPTIONS_ARE_OPEN === 'true') {
    return true;
  }
  const aprilTenthTenAmPacific = new Date('2024-04-10T10:00:00-07:00');
  return Date.now() >= aprilTenthTenAmPacific.getTime();
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