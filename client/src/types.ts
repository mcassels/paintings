export interface Photo {
  url: string;
  height: number;
  width: number;
}
export interface Painting {
  id: number;
  photo: Photo;
  year?: number;
  name?: string;
  size?: string; // e.g. 50"x48"
  status?: 'Available'|'Sold';
  conditionNotes?: string;
  isFramed?: boolean;
  medium?: string;
}

export type PaintingsResponse = Painting[]|'error'|'loading';