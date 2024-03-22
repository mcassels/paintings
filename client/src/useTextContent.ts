import { useQuery } from "@tanstack/react-query";
import { TextContent, TextContentResponse } from "./types";

async function fetchTextContent(): Promise<TextContent[]> {
  const faqsUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tbl1AbufKKvVhlPa5";
  const response = await fetch(
    faqsUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();

  const textContent: TextContent[] = [];
  for (const record of data.records) {
    const fields = record.fields;
    const content: TextContent = {
      id: fields.id,
      body: fields.body,
      title: fields.title,
    };
    textContent.push(content);
  }
  debugger;
  return textContent
}

export function useTextContent(contentId: string): TextContentResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['textContent'],
    queryFn: fetchTextContent,
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
  const content = data?.find((c: TextContent) => c.id === contentId);
  return content || 'error';
}