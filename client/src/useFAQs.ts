import { useQuery } from "@tanstack/react-query";
import { FAQ, FAQResponse } from "./types";

async function fetchFAQs(): Promise<FAQ[]> {
  const faqsUrl = "https://api.airtable.com/v0/app2HxNPQejnLR2g0/tblA91WU7Gk86sTar";
  const response = await fetch(
    faqsUrl,
    { headers: { Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}` }},
  );

  const data = await response.json();

  const faqsWithIdx: Array<FAQ & { sort: number }> = data.records.map((record: any) => ({
    question: record.fields.question,
    answer: record.fields.answer,
    sort: record.fields.sort,
  }));
  const faqs = faqsWithIdx.sort((a, b) => a.sort - b.sort).map(({ question, answer }) => ({ question, answer }));
  return faqs.filter((faq) => faq.question && faq.answer && faq.question.length > 0 && faq.answer.length > 0);
}

export function useFAQs(): FAQResponse {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFAQs,
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