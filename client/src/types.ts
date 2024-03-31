export type PaintingStatus = 'Available'|'Pending'|'Sold';

export interface PaintingTags {
  decade: string;
  damageLevel: number;
  predominantColors: string[];
  status: PaintingStatus;
}
export interface Painting {
  id: string;
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
}

export type PaintingsResponse = Painting[]|'error'|'loading';

export interface FAQ {
  question: string;
  answer: string;
}
export type FAQResponse = FAQ[]|'error'|'loading';

export type TextContentId = 'jim_bio'|'why_adopt'|'how_to_adopt'|'after_adoption';
export interface TextContent {
  id: TextContentId;
  title: string;
  body: string;
}
export type TextContentResponse = TextContent|'error'|'loading';

export interface ArtConservator {
  name: string;
  bio: string; // This contains markdown
}

export type ArtConservatorResponse = ArtConservator[]|'error'|'loading';