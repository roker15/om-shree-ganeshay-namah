import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { BookResponse, BookSyllabus, Subheading } from "../types/myTypes";
import { definitions } from "../types/supabase";
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
    bookId == undefined ? null : ["/book_id_syllabus", bookId],
    async () =>
      await supabase.rpc<BookSyllabus>("getSyllabusFromBookId", {
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
