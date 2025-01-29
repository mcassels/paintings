import { Show } from "../types";
import { useAirtableRecords } from "./useAirtableRecords";

function parseShow(airtableRecord: any): Show {
  const startDate = new Date(airtableRecord.fields.start_date);
  const endDate = new Date(airtableRecord.fields.end_date);
  return {
    name: airtableRecord.fields.name,
    description: airtableRecord.fields.description,
    startDate,
    endDate,
    id: airtableRecord.id,
  };
}

function getCurrentShowFromShows(shows: Show[]): Show|null {
  const now = new Date();
  for (const show of shows) {
    // TODO: handle show lasting until the end of the last day?
    if (show.startDate <= now && now <= show.endDate) {
      return show;
    }
  }
  return null;
}

export function useCurrentShow(): Show|null|'error'|'loading' {
  return useAirtableRecords('shows', parseShow, getCurrentShowFromShows);
}