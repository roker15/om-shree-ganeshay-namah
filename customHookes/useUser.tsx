import { supabase } from "../lib/supabaseClient";
import { Headings, Papers, Post, QuestionBank, SharedPost, Subheading, SubheadingViews } from "../types/myTypes";
import useSWR, { useSWRConfig } from "swr";
import React, { useEffect, useState } from "react";

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
  let subheadingsView: SubheadingViews[] | null | undefined = [];
  if (data && data.data != null) {
    subheadingsView = data.data.sort((a, b) => a.heading_sequence! - b.heading_sequence!);
  } else {
    subheadingsView = null;
  }
  return {
    subheadingsView, //: data?.data,
    isLoading_useSubheadingByPaperId: !error && !data,
    isError: error,
  };
}

export function useGetSharedpostBySubheadingidAndUserid(
  currentSubheadingId?: number,
  // year?: number,
  useId?: number
) {
  const [id, setId] = useState<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  console.log("useGetsharedpost post is being called", currentSubheadingId);
  const { data, error } = useSWR(
    id && mounted ? `/sharedPost/${id}` : null,
    async () =>
      await supabase
        .from<SharedPost>("sharedpost")
        .select(
          `
    id,
      created_at,
      updated_at,
      post_id(
        id,post,
        created_by(id,email)
      ),
      shared_with(id,email),
      subheading_id:subheadings!id (
      
      topic,
      main_topic_id:headings!topics_main_topic_id_fkey(id)
    )
    `
        )
        .eq("subheading_id", id as number)
        .eq("shared_with", supabase.auth.user()?.id as string),
    { refreshInterval: 1000 }
  );
  useEffect(() => {
    setId(currentSubheadingId);
    setMounted(true);
  }, [currentSubheadingId]);

  return {
    // sharedPost_SUP_ERR:data?.error,
    sharedPost: data,
    isLoadingSharedPost: !error && !data,
    sharedPosterror: error,
  };
}

export function useGetUserpostBySubheadingidAndUserid(
  currentSubheadingId?: number,
  // year?: number,
  useId?: number
) {
  console.log("useGetUserpost post is being called", currentSubheadingId);

  const [id, setId] = useState<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    currentSubheadingId && mounted ? `/userpost/${currentSubheadingId}` : null,
    async () =>
      await supabase
        .from<Post>("posts")
        .select(
          `
    id,
      created_at,
      updated_at,
      post,
      subheading_id:subheadings!posts_subheading_id_fkey(
      
      topic,
      main_topic_id:headings!topics_main_topic_id_fkey(id)
    )
    `
        )
        .eq("subheading_id", currentSubheadingId as number)
        .eq("created_by", supabase.auth.user()?.id as string),
    { refreshInterval: 1000 }
  );
  useEffect(() => {
    setMounted(true);
  }, [currentSubheadingId]);
  // console.log("data returned from useUserpost call ", data!.data);
  return {
    // userposts_SUP_ERR:data?.error,
    userposts: data,
    isLoadingUserPost: !error && !data,
    userposterror: error,
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
