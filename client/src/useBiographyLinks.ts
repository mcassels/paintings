import { useQuery } from "@tanstack/react-query";
import { BiographyLink, BiographyLinksResponse } from "./types";

async function fetchBiographyLinks(): Promise<BiographyLink[]> {
  const faqsUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblTRwvgP855ZUBmX/";
  const response = await fetch(
    faqsUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();

  const withIdx: Array<BiographyLink & { sort: number }> = data.records.map((record: any) => ({
    description: record.fields.description,
    url: record.fields.url,
    sort: record.fields.sort,
  }));
  const bioLinks = withIdx.sort((a, b) => a.sort - b.sort).map(({ description, url }) => ({ description, url }));
  return bioLinks.filter((bioLink) => bioLink.description && bioLink.url && bioLink.description.length > 0 && bioLink.url.length > 0);
}

export function useBiographyLinks(): BiographyLinksResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['bio-links'],
    queryFn: fetchBiographyLinks,
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