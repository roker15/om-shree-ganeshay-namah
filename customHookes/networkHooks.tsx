import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { useAuthContext } from "../state/Authcontext";
import { useNoteContext } from "../state/NoteContext";
import { BookResponse } from "../types/myTypes";
import { definitions } from "../types/supabase";

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
  const { data, error } = useSWR(
    bookId == undefined ? null : ["/publicationId", bookId],
    async () =>
      await supabaseClient
        .from<BookResponse>("books")
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
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSyllabusByBookId(bookId?: number) {
  const { data, error } = useSWR(
    bookId == undefined ? null : [`/use-get-syllabus-by-bookid/${bookId}`],
    async () =>
      await supabaseClient.rpc("getSyllabusFromBookIdRightJoinToGetAllHeading", {
        bookid: bookId,
      }),
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
export function useGetPublicNotesListBySubheading(subheadingId?: number) {
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
      .from<definitions["books_article_sharing"]>("books_article_sharing")
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
        .from<definitions["books_article_sharing"]>("books_article_sharing")
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
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
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
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
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
  const { data, error } = useSWR(
    userid === undefined || tagsArray!.length === 0 ? null : [`/get-user-articles-bytags/${userid}/${tagsArray}`],
    async () =>
      await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
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
  const fetcher = async () =>
    await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .throwOnError() // supabase does not throw error by default, swr error works only when fetcher throws it.
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
  const fetcher1 = async () =>
    await supabaseClient
      .from<any>("books_articles")
      .select("*, created_by!inner(*)")

      // .or("role.eq.ADMIN, role.eq.MODERATOR", { foreignTable: "profiles" })
      .neq("created_by.role", "USER")

      .eq("books_subheadings_fk", subheadingId);

  // .limit(10);

  const fetcher2 = async () =>
    await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
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
  const { user } = useUser();
  const fetcher = async () =>
    await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .throwOnError()
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
