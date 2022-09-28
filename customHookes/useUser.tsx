import { Headings, Papers, Post, QuestionBank, SharedPost, Subheading, SubheadingViews } from "../types/myTypes";
import useSWR, { useSWRConfig } from "swr";
import { definitions } from "../types/supabase";
import { supabaseClient } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
// import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export function useGetExamPapers(examId: number) {
  interface papers {
    id: number;
    book_name: string;
  }
  const { data, error } = useSWR(
    ["/upsc", examId],
    async () =>
      await supabaseClient
        .from("books")
        .select(
          `
  id,book_name
  
 `
        )
        .eq("class_fk", examId)
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
      await supabaseClient.from("headings").select(`
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
  const { data, error } = useSWR(
    shouldFetch && paperId && year ? [`/questions/${paperId}/${year}`] : null,
    async () =>
      await supabaseClient
        .from("questionbank")
        .select(
          `
      id,
      question_content,
      search_keys,
      year,
      sequence,
      paper_id_new,
      remark
 `
        )
        .eq("paper_id_new", paperId)
        .eq("year", year),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    questions: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useSubheadingByPaperId(paperId?: number) {
  const { data, error } = useSWR(
    paperId ? [`/subheadingviews/${paperId}`] : null,
    async () => await supabaseClient.from("subheadings_view").select(`*`).eq("paper_id", paperId)
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

export function useGetSharedpostBySubheadingidAndUserid(currentSubheadingId?: number) {
  const { profile } = useAuthContext();
  const { data, error } = useSWR(
    currentSubheadingId ? `/sharedPost/${currentSubheadingId}` : null,
    async () =>
      await supabaseClient
        .from("sharedpost")
        .select(
          `
    id,
      created_at,
      updated_at,
      is_public,
      post_id(
        id,post,
        created_by(id,email,username)
      ),
      shared_with(id,email,username),
      subheading_id:subheadings!id (
      
      topic,
      main_topic_id:headings!topics_main_topic_id_fkey(id)
    )
    `
        )
        .eq("subheading_id", currentSubheadingId as number)
        .or(`shared_with.eq.${profile?.id},is_public.eq.true`),
    // .eq("shared_with", supabase.auth.user()?.id as string),
    {
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      // revalidateOnReconnect: false,
    }
  );

  return {
    // sharedPost_SUP_ERR:data?.error,
    data_sharedpost: data?.data,
    supError_sharedpost: data?.error,
    isLoadingSharedPost: !error && !data,
    swrError_sharedpost: error,
  };
}

export function useGetUserpostBySubheadingidAndUserid(currentSubheadingId?: number) {
  const { profile } = useAuthContext();
  const { data, error } = useSWR(
    currentSubheadingId ? `/userpost/${currentSubheadingId}` : null,
    async () =>
      await supabaseClient
        .from("posts")
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
        .eq("created_by", profile?.id as string),
    {
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      // revalidateOnReconnect: false,
    }
  );
  return {
    // userposts_SUP_ERR:data?.error,
    userposts: data,
    isLoadingUserPost: !error && !data,
    userposterror: error,
  };
}

export function useGetSubheadingsFromHeadingId(currentHeadingId?: number) {
  const { data, error } = useSWR(
    currentHeadingId == undefined ? null : ["/headingId", currentHeadingId],
    async () => await supabaseClient.from("subheadings").select("*").eq("main_topic_id", currentHeadingId),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
