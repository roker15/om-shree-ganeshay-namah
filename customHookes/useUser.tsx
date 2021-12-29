import { supabase } from "../lib/supabaseClient";
import { Headings, Papers, Post, QuestionBank, SharedPost, Subheading, SubheadingViews } from "../types/myTypes";
import useSWR, { useSWRConfig } from "swr";

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
  const { data, error } = useSWR(
    shouldFetch && paperId && year ? [`/questions/${paperId}/${year}`] : null,
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

export function useSubheadingByPaperId(
  paperId?: number,
) {
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

export function useGetSharedpostBySubheadingidAndUserid(currentSubheadingId?: number) {
  const { data, error } = useSWR(
    currentSubheadingId ? `/sharedPost/${currentSubheadingId}` : null,
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
        .eq("shared_with", supabase.auth.user()?.id as string),
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
  const { data, error } = useSWR(
    currentSubheadingId ? `/userpost/${currentSubheadingId}` : null,
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
    async () => await supabase.from<Subheading>("subheadings").select("*").eq("main_topic_id", currentHeadingId),
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
