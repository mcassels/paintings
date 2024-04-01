import { Painting } from "./types";

export function getPaintingInfos(p: Painting): string[] {
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
    parts.push('Framed');
  }
  if (p.isFramed === false) { // undefined means we don't know if it's framed or not
    parts.push('Unframed');
  }
  if (p.conditionNotes) {
    parts.push(p.conditionNotes);
  }
  parts.push(`Damage level ${p.damageLevel}`);
  return parts;
}