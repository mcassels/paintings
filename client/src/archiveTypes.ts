export interface ArchivePainting {
    id: string;
    airtableId: string; // internal identifier within airtable, need to keep track of this for updates
    title: string;
    frontPhotoUrl: string,
    backPhotoUrl?: string,
    height: number;
    width: number;
    damaged: boolean;
    year?: number;
    decade: number;
    conditionNotes?: string;
    isFramed: boolean;
    medium: string;
    predominantColors: string[];
    subjectMatter: string[];
}