import { useQuery } from "@tanstack/react-query";
import { TextContent, TextContentResponse } from "../types";
import { fetchAllTableRecords } from "../utils";

async function fetchTextContent(): Promise<TextContent[]> {
  const records = await fetchAllTableRecords("website_text_content");

  const textContent: TextContent[] = [];
  for (const record of records) {
    const fields = record.fields;
    const content: TextContent = {
      id: fields.id,
      body: fields.body,
      title: fields.title,
    };
    textContent.push(content);
  }
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