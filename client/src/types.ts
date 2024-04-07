export type PaintingStatus = 'available'|'pending'|'adopted';

export interface PaintingTags {
  decade: string;
  damageLevel: number;
  predominantColors: string[];
  status: PaintingStatus;
  subjectMatter: string[];
}
export interface Painting {
  id: string;
  airtableId: string; // internal identifier within airtable, need to keep track of this for updates
  title: string;
  frontPhotoUrl: string,
  backPhotoUrl: string,
  height: number;
  width: number; // float between 0 and 5
  damageLevel: number;
  year?: number;
  yearGuess?: number; // only used if year is unknown
  status: PaintingStatus;
  conditionNotes?: string;
  isFramed: boolean;
  medium: string;
  predominantColors: string[];
  subjectMatter: string[];
  tags: PaintingTags;
  story?: string;
}

export type PaintingsResponse = Painting[]|'error'|'loading';

export interface FAQ {
  question: string;
  answer: string;
}
export type FAQResponse = FAQ[]|'error'|'loading';

export type TextContentId = 'jim_bio'|'why_adopt'|'how_to_adopt'|'after_adoption'|'pricing'|'care_and_conservation';
export interface TextContent {
  id: TextContentId;
  title: string;
  body: string;
}
export type TextContentResponse = TextContent|'error'|'loading';

export interface BiographyLink {
  description: string;
  url: string;
}

export type BiographyLinksResponse = BiographyLink[]|'error'|'loading';

export interface DamageLevel {
  level: number;
  description: string;
}
export type DamageLevelResponse = DamageLevel[]|'error'|'loading';