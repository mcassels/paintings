import { Show } from "../types";
import { useAirtableRecords } from "./useAirtableRecords";

function parseShow(airtableRecord: any): Show {
  debugger;
  const startDate = new Date(airtableRecord.fields.start_date);
  const endDate = new Date(airtableRecord.fields.end_date);
  return {
    name: airtableRecord.fields.name,
    description: airtableRecord.fields.description,
    startDate: airtableRecord.fields.start_date,
    endDate: airtableRecord.fields.end_date,
  };
}

function getCurrentShowFromShows(shows: Show[]): Show|null {
  const now = new Date();
  for (const show of shows) {
    const startDate = new Date(show.startDate);
    const endDate = new Date(show.endDate);
    if (startDate <= now && now <= endDate) {
      return show;
    }
  }
  return null;
}

export function useCurrentShow(): Show|null|'error'|'loading' {
  return useAirtableRecords('shows', parseShow, getCurrentShowFromShows);
}