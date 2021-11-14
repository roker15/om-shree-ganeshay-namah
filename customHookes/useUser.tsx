import { supabase } from "../lib/supabaseClient";
import { Headings, Papers, QuestionBank, Subheading } from "../types/myTypes";
import useSWR from "swr";

export function useGetExamPapers(id?: any) {
  const { data, error } = useSWR(
    ["/upsc"],
    async () =>
      await supabase.from<Papers>("papers").select(`
  id,paper_name
  
 `)
  );

  return {
    examPapers: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useGetHeadingsFromPaperId(id?: number) {
  const { data, error } = useSWR(
    [`/upsc/${id}`],
    async () =>
      await supabase.from<Headings>("headings").select(`
  id,paper_name
  
 `)
  );
  return {
    headings: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useGetQuestionsByPaperidAndYear(
  paperId?: number,
  year?: number,
  shouldFetch?: boolean,
) {
  console.log("refetching data............");
  const { data, error } = useSWR(
    shouldFetch && paperId && year ? [`/upsc/${paperId}/${year}`] : null,
    async () =>
      await supabase
        .from<QuestionBank>("questionbank")
        .select(
          `
      id,
      question_content,
      search_keys,
      year,
      sequence,
      paper_id,
      remark
 `
        )
        .eq("paper_id", paperId)
        .eq("year", year),
    // { refreshInterval: 1000 }
  );

  return {
    questions: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useSubheadingByPaperId(
  paperId?: number,
  // year?: number,
  shouldFetch?: boolean,
) {
  console.log("refetching data............");
  const { data, error } = useSWR(
    paperId ? [`/upsc/${paperId}`] : null,
    async () =>
      await supabase
        .from<Subheading>("subheadings")
        .select(
          `
      id,
      question_content,
      search_keys,
      year,
      sequence,
      paper_id,
      remark
 `
        )
        .eq("paper_id", paperId)
        .eq("year", year),
    // { refreshInterval: 1000 }
  );

  return {
    questions: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
