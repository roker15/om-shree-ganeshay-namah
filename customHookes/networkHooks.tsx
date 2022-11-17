import { useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { useAuthContext } from "../state/Authcontext";
import { BookResponse } from "../types/myTypes";

// Retrieving a supabase client object from the SessionContext:
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../lib/database";

export type SharedNotesList = {
  id: number;
  subheading_id: number;
  owned_by_userid: string;
  owned_by: string;
  shared_by_userid: string;
  shared_by: string;
};
const cacheOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
export function useGetBooks(bookId?: number) {
  const supabaseClient = useSupabaseClient<Database>();

  const { data, error } = useSWR(
    bookId == undefined ? null : ["/publicationId", bookId],
    async () =>
      await supabaseClient
        .from("books")
        .select(
          `id,book_name,
      class_fk(id,class),
      subject_fk(id,subject_name)`
        )
        .eq("publication_fk", bookId),
    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data as BookResponse[] | undefined,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSyllabusByBookId(bookId?: number) {
  const supabaseClient = useSupabaseClient<Database>();
  const { data, error } = useSWR(
    bookId == undefined ? null : [`/use-get-syllabus-by-bookid/${bookId}`],
    async () =>
      await supabaseClient.rpc("getSyllabusFromBookIdRightJoinToGetAllHeading", {
        bookid: bookId!,
      }),
    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data as any,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetPublicNotesListBySubheading(subheadingId?: number) {
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  //This may be the proper way to use swr with supabase.
  //https://github.com/supabase/supabase/discussions/3145#discussioncomment-1426310
  const fetcher = async () =>
    // await supabase
    //   .rpc<SharedNotesList>("getPublicNotesListBySubheading", {
    //     subheadingid: subheadingId,
    //   })
    //   .neq("owned_by_userid", profile?.id as string);
    await supabaseClient
      .from("books_article_sharing")
      .select(`*`)
      .eq("books_subheadings_fk", subheadingId)
      .eq("ispublic", true)
      .neq("owned_by", profile?.id as string);

  const { data, error } = useSWR(
    subheadingId == undefined ? null : [`/get-public-notes-list-by-subheading/${subheadingId}`],
    fetcher,
    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSharedNotesListBySubheading(subheadingId: number | undefined, userid: string | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const { data, error } = useSWR(
    subheadingId == undefined || userid == undefined
      ? null
      : [`/get-shared-notes-list-by-subheading/${subheadingId}/${userid}`],
    async () =>
      // await supabase.rpc<SharedNotesList>("getSharedNotesListBySubheading", {
      //   subheadingid: subheadingId,
      //   sharedwith: userid,
      // })
      await supabaseClient
        .from("books_article_sharing")
        .select(`*`)
        .eq("books_subheadings_fk", subheadingId)
        .eq("shared_with", userid),

    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetUserArticles(subheadingId: number | undefined, userid: string | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabaseClient
        .from("books_articles")
        .select(`id,updated_at,article_title,current_affair_tags`)
        .eq("created_by", userid)
        .eq("books_subheadings_fk", subheadingId),
    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
// this is used to view shared notes and to copy article....
//please modify this to not get only required properties.
export function useGetUserArticless(subheadingId: number | undefined, userid: string | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabaseClient
        .from("books_articles")
        .select(`*`)
        .eq("created_by", userid)
        .eq("books_subheadings_fk", subheadingId),
    cacheOptions
  );
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}

export function useGetUserArticlesFromTags(userid: string | undefined, tagsArray: number[] | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const { data, error } = useSWR(
    userid === undefined || tagsArray!.length === 0 ? null : [`/get-user-articles-bytags/${userid}/${tagsArray}`],
    async () =>
      await supabaseClient
        .from("books_articles")
        .select(`id,updated_at,article_title`, { count: "exact" })
        .eq("created_by", userid)
        .contains("current_affair_tags", tagsArray as number[]),
    cacheOptions
  );

  if (tagsArray && tagsArray.length === 0) {
    return {
      // sharedPost_SUP_ERR:data?.error,
      data: [],
      count: 999,
      supError: null,
      isLoading: false,
      swrError: null,
    };
  }

  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    count: data?.count,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetArticleById(id: number) {
  const supabaseClient = useSupabaseClient<Database>();
  const fetcher = async () =>
    await supabaseClient
      .from("books_articles")
      // .throwOnError() // supabase does not throw error by default, swr error works only when fetcher throws it.
      .select(`*`)
      .eq("id", id)
      .limit(1)
      .single();

  const { data, error } = useSWR(`/api/usergetarticlebyid/${id}`, fetcher, cacheOptions);

  return {
    article: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
export function useGetCurrentAffairs(isAdminNotes: boolean, subheadingId: number, userId: string) {
  const supabaseClient = useSupabaseClient<Database>();
  const fetcher1 = async () =>
    await supabaseClient
      .from("books_articles")
      .select("*, created_by!inner(*)")

      // .or("role.eq.ADMIN, role.eq.MODERATOR", { foreignTable: "profiles" })
      .neq("created_by.role", "USER")

      .eq("books_subheadings_fk", subheadingId);

  // .limit(10);

  const fetcher2 = async () =>
    await supabaseClient
      .from("books_articles")
      .select("*, created_by!inner(*)")

      .match({ created_by: userId })

      .eq("books_subheadings_fk", subheadingId);
  // .limit(10);

  const { data, error, mutate } = useSWR(
    !subheadingId
      ? null
      : subheadingId && !isAdminNotes && !userId
      ? null
      : `/api/useGetCurrentAffairs/${isAdminNotes}/${subheadingId}/${userId}`,
    isAdminNotes ? fetcher1 : fetcher2,
    cacheOptions
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export function useSearchCurrentAffairs(searchKey: string) {
  const supabaseClient = useSupabaseClient<Database>();
  const user = useUser();
  const fetcher = async () =>
    await supabaseClient
      .from("books_articles")
      // .throwOnError()
      .select(`id,updated_at,article_title`, { count: "exact" })
      .textSearch("article_title", searchKey, { type: "websearch", config: "english" })
      .eq("created_by", user?.id);

  // .limit(10);

  const { data, error, mutate } = useSWR(
    searchKey === "" ? null : `/api/useSearchCurrentAffairs/${searchKey}`,
    fetcher,
    cacheOptions
  );

  return {
    data: data?.data,
    count: data?.count,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
export function useGetColleges() {
  const supabaseClient = useSupabaseClient<Database>();
  const fetcher = async () => {
    const { data, error } = await supabaseClient.from("colleges").select();
    if (error) throw error;
    return data;
  };

  const { data, error, mutate } = useSWR(`/api/supabase/usegetcolleges`, fetcher, cacheOptions);

  return {
    colleges: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
export function useGetCollegesCourses(collegeId: number | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const fetcher = async () => {
    const { data, error } = await supabaseClient.from("books").select().eq("colleges_fk", collegeId);
    if (error) throw error;
    return data;
  };

  const { data, error, mutate } = useSWR(
    collegeId ? `/api/supabase/useGetCollegesCourses/${collegeId}` : null,
    fetcher,
    cacheOptions
  );

  return {
    collegesCourses: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
export function useGetPersonalCourses(userId: string | undefined) {
  const supabaseClient = useSupabaseClient<Database>();
  const fetcher = async () => {
    const { data, error } = await supabaseClient.from("books").select().eq("syllabus_owner_fk", userId);
    if (error) throw error;
    return data;
  };

  const { data, error, mutate } = useSWR(
    userId ? `/api/supabase/useGetPersonalCourses/${userId}` : null,
    fetcher,
    cacheOptions
  );

  return {
    personalCourses: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
