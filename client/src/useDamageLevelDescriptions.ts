import { useQuery } from "@tanstack/react-query";
import { DamageLevel, DamageLevelResponse } from "./types";

// TODO: amalgamate this with useFAQs
// Also maybe Pass table names instead of ids and use a smarter query to query by table name?

async function fetchDamageLevels(): Promise<DamageLevel[]> {
  const faqsUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblzUHgWHgNqroJuy";
  const response = await fetch(
    faqsUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();

  const damageLevels: DamageLevel[] = data.records.map((record: any) => ({
    level: record.fields.damage_level,
    description: record.fields.description,
  }));
  return damageLevels;
}

export function useDamageLevels(): DamageLevelResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['damage-levels'],
    queryFn: fetchDamageLevels,
    // This query should only be made once per session!
    // Never need to refetch this.
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) {
    return 'loading';
  }
  if (isError) {
    return 'error';
  }

  return data || 'error';
}