import { useQuery } from "@tanstack/react-query";
import { fetchAllTableRecords } from "../utils";

/*
Given the name of a table in the airtable base, and a function to transform
the raw airtable record into type T, fetch all records from the table and
return them as an array of T.

This function uses react-query to cache the results and avoid refetching
the data. It uses staleTime: Infinity to ensure that the data is only fetched
once per session.

This hook is intended for fetching records from tables that are expected to change
very infrequently, such as the damage_level_descriptions table.
*/
export function useAirtableRecords<T, S>(
  airtableTableName: string,
  recordTransformer: (record: any) => T,
  outputTransformer?: (records: T[]) => S,
): S|'error'|'loading' {

  async function fetchRecords(): Promise<S> {
    const data = await fetchAllTableRecords(airtableTableName);
    const records = data.map(recordTransformer);
    return outputTransformer ? outputTransformer(records) : (records as S);
  }

  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: [airtableTableName],
    queryFn: fetchRecords,
    // This query should only be made once per session!
    // Never need to refetch this.
    staleTime: Infinity,
    retry: 3, // Retry 3 times in case of network connectivity issues
  });

  if (isLoading) {
    return 'loading';
  }
  if (isError) {
    return 'error';
  }

  return data || 'error';
}