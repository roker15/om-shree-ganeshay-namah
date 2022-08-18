import { supabaseClient } from "@supabase/auth-helpers-nextjs";
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
    {
      revalidateIfStale: true,
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
export function useGetSyllabusByBookId(bookId?: number) {
  const { data, error } = useSWR(
    bookId == undefined ? null : [`/book_id_syllabuss/${bookId}`],
    async () =>
      await supabaseClient.rpc("getSyllabusFromBookIdRightJoinToGetAllHeading", {
        bookid: bookId,
      }),
    {
      revalidateIfStale: true,
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

  const cacheOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };
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

    {
      revalidateIfStale: true,
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
export function useGetUserArticles(subheadingId: number | undefined, userid: string | undefined) {
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
        .select(`id,updated_at,article_title`)
        .eq("created_by", userid)
        .eq("books_subheadings_fk", subheadingId),
    {
      revalidateIfStale: true,
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
export function useGetUserArticlesFromTags(userid: string | undefined, tagsArray: number[] | undefined) {
  const { data, error } = useSWR(
    userid === undefined || tagsArray!.length === 0 ? null : [`/get-user-articles-bytags/${userid}/${tagsArray}`],
    async () =>
      await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
        .select(`id,updated_at,article_title`, { count: "exact" })
        .eq("created_by", userid)
        .contains("current_affair_tags", tagsArray as number[]),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
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

  const { data, error } = useSWR(`/api/usergetarticlebyid/${id}`, fetcher);

  return {
    article: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
