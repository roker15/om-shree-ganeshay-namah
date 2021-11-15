import { supabase } from "../lib/supabaseClient";
import { Headings, Papers, QuestionBank, Subheading, SubheadingViews } from "../types/myTypes";
import useSWR from "swr";
import React from "react";

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
export function useGetQuestionsByPaperidAndYear(paperId?: number, year?: number, shouldFetch?: boolean) {
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
        .eq("year", year)
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
  shouldFetch?: boolean
) {
  console.log("refetching data............");
  const { data, error } = useSWR(
    paperId ? [`/subheadingviews/${paperId}`] : null,
    async () =>
      await supabase
        .from<SubheadingViews>("subheadings_view")
        .select(
          `
          subheading_id,
          main_topic_id,
          topic,
          subheading_sequence,
          heading_id,
          main_topic,
          heading_sequence,
          paper_id
 `
        )
        .eq("paper_id", paperId)
    // { refreshInterval: 1000 }
  );
  let subheadingsView:SubheadingViews[] | null | undefined = [];
  if (data && data.data!=null) {
      subheadingsView=data.data.sort((a, b)=>a.heading_sequence!-b.heading_sequence!)
  }
  else {
    subheadingsView = null;
  }
  return {
  
    subheadingsView,//: data?.data,
    isLoading_useSubheadingByPaperId: !error && !data,
    isError: error,
  };
}

function useAsyncHook(searchBook: string) {
  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState("false");
  // We cannot use 'async' keyword with 'useEffect' callback method.
  // It will result in race conditions.
  React.useEffect(() => {
    async function fetchBookList() {
      try {
        setLoading("true");
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchBook}`);

        const json = await response.json();
        // console.log(json);
        setResult(
          json.items.map((item: { volumeInfo: { title: any } }) => {
            console.log(item.volumeInfo.title);
            return item.volumeInfo.title;
          })
        );
      } catch (error) {
        setLoading("null");
      }
    }

    if (searchBook !== "") {
      fetchBookList();
    }
  }, [searchBook]);

  return [result, loading];
}
