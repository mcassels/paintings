export interface ArchivePainting {
    id: string;
    airtableId: string; // internal identifier within airtable, need to keep track of this for updates
    title: string;
    frontPhotoUrl: string,
    backPhotoUrl?: string,
    height?: number;
    width?: number;
    damaged: boolean;
    year?: number;
    yearGuess?: number;
    bestKnownYear: number;
    decade: string;
    medium?: string;
    subjectMatter: string[];
    story?: string;
}

export type ArchivePaintingsResponse = ArchivePainting[]|'error'|'loading';