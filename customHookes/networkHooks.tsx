import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { BookResponse, BookSyllabus, Subheading } from "../types/myTypes";
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
  console.log("usegetbooks getting called");
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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  data ? console.log("subject is ", data!.data) : console.log("data is is not available");
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSyllabusByBookId(bookId?: number) {
  console.log("usegetbooks getting called");
  const { data, error } = useSWR(
    bookId == undefined ? null : [`/book_id_syllabuss/${bookId}`],
    async () =>
      await supabase.rpc("getSyllabusFromBookIdRightJoinToGetAllHeading", {
        bookid: bookId,
      }),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  data ? console.log("syllabus is ", data!.data) : console.log("data is is not available");
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetPublicNotesListBySubheading(subheadingId?: number) {
  console.log("usegetbooks getting called");

  const { data, error } = useSWR(
    subheadingId == undefined ? null : [`/get-public-notes-list-by-subheading/${subheadingId}`],
    async () =>
      await supabase.rpc<SharedNotesList>("getPublicNotesListBySubheading", {
        subheadingid: subheadingId,
      }),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  data ? console.log("syllabus is ", data!.data) : console.log("data is is not available");
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSharedNotesListBySubheading(subheadingId: number | undefined, userid: string | undefined) {
  console.log("usegetbooks getting called");
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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  data ? console.log("syllabus is ", data!.data) : console.log("data is is not available");
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetUserArticles(subheadingId: number | undefined, userid: string | undefined) {
  console.log("get-user-articles is  getting called");
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
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  data ? console.log("articles are  ", data!.data) : console.log("articles available");
  return {
    // sharedPost_SUP_ERR:data?.error,
    data: data?.data,
    supError: data?.error,
    isLoading: !error && !data,
    swrError: error,
  };
}
