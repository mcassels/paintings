import { useQuery } from "@tanstack/react-query";
import { ArtConservator, ArtConservatorResponse } from "./types";

async function fetchArtConservators(): Promise<ArtConservator[]> {
  const faqsUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblBe0EJkCZEjFfW0";
  const response = await fetch(
    faqsUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();

  const conservators: ArtConservator[] = [];
  for (const record of data.records) {
    const fields = record.fields;
    if (!fields.name) {
      continue;
    }
    const content: ArtConservator = {
      name: fields.name,
      bio: fields.bio,
      link: fields.link,
    };
    conservators.push(content);
  }
  return conservators;
}

export function useArtConservators(): ArtConservatorResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['artConservators'],
    queryFn: fetchArtConservators,
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