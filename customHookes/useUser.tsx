import { supabase } from "../lib/supabaseClient";
import { Headings, Papers, QuestionBank } from "../types/myTypes";
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
export function useGetQuestionsByPaperidAndYear(paperId?: number, year?: number,shouldFetch?:boolean) {
  
  const { data, error } = useSWR(
    shouldFetch ? [`/upsc/${paperId}/${year}`] : null,
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
      paper_id:number,
 `
        )
        .eq("paper_id", paperId)
        .eq("year", year)
  );

  return {
    questions: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
