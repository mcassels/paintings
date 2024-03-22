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
  name?: string;
  status?: 'Available'|'Sold';
  conditionNotes?: string;
  isFramed?: boolean;
  isSigned?: boolean;
  medium?: string;
  predominantColors: string[];
  subjectMatter: string[];
}

export type PaintingsResponse = Painting[]|'error'|'loading';

export interface FAQ {
  question: string;
  answer: string;
}
export type FAQResponse = FAQ[]|'error'|'loading';