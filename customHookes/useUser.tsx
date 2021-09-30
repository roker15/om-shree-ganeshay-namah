import { supabase } from "../lib/supabaseClient";
import { Headings, Papers } from "../types/myTypes";
import useSWR from "swr";

export function useGetExamPapers(id?: any) {
  console.log("this is being called again again again")
  const { data, error } = useSWR(
    ["/upszzzzzzzc"],
    async () => await supabase.from<Papers>("papers").select(`
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
    async () => await supabase.from<Headings>("headings").select(`
  id,paper_name
  
 `)
  );

  return {
    headings: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
