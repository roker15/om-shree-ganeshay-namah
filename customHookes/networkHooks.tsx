import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
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
      await supabase
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
      await supabase.rpc("getSyllabusFromBookIdRightJoinToGetAllHeading", {
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
    await supabase
      .rpc<SharedNotesList>("getPublicNotesListBySubheading", {
        subheadingid: subheadingId,
      })
      .neq("owned_by_userid", profile?.id as string);

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
      await supabase.rpc<SharedNotesList>("getSharedNotesListBySubheading", {
        subheadingid: subheadingId,
        sharedwith: userid,
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
export function useGetUserArticles(subheadingId: number | undefined, userid: string | undefined) {
  const { data, error } = useSWR(
    subheadingId == undefined || userid === undefined ? null : [`/get-user-articles/${subheadingId}/${userid}`],
    async () =>
      await supabase
        .from<definitions["books_articles"]>("books_articles")
        .select(
          `id,
          created_at,
          updated_at,
          books_subheadings_fk,
          article_title,
          article_hindi,
          article_english,
          article_audio_link,
          created_by,
          sequence
    `
        )
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
