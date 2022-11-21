import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import useSWR from "swr";
import { Database } from "../lib/database";
import { Data } from "../pages/api/prisma/syllabus/syllabus";
import { SyllabusModerator } from "../pages/api/prisma/syllabus/usegetsyllabusmoderator";
import { Book } from "../state/SyllabusContext";

const cacheOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetSyllabusByBookId(book: Book) {
  console.log("get syllabus swr hit ", book.bookId);
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    const response = await axios
      .get<Data>("/api/prisma/syllabus/syllabus", { params: { bookId: book.bookId } })
      .catch((e) => {
        throw e;
      });
    return response.data;
  };
  const { data, error, mutate } = useSWR([`/api/prisma/syllabus/syllabus/${book.bookId}`], fetcher, cacheOptions);

  return {
    data: data,
    isLoading: !error && !data,
    swrError: error,
    mutate: mutate,
  };
}
export function useGetArticleCount(subheadingId: number, creatorId: string) {
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    const response = await axios
      .get<number>("/api/prisma/posts/postcountbysyllabus", { params: { subheadingId, creatorId } })
      .catch((e) => {
        throw e;
      });
    return response.data;
  };
  const { data, error } = useSWR(["/api/prisma/posts/postCountbySyllabus", subheadingId, creatorId], fetcher, cacheOptions);

  return {
    data: data,
    isLoading: !error && !data,
    swrError: error,
  };
}
export function useGetSyllabusModerator(bookId: number | undefined) {
  const fetcher = async () => {
    const response = await axios
      .get<SyllabusModerator[]>("/api/prisma/syllabus/usegetsyllabusmoderator", { params: { bookId } })
      .catch((e) => {
        throw e;
      });
    return response.data;
  };
  const { data, error, mutate } = useSWR(
    bookId ? ["/api/prisma/syllabus/usegetsyllabusmoderator", bookId] : null,
    fetcher,
    cacheOptions
  );

  return {
    data: data,
    isLoading: !error && !data,
    swrError: error,
    mutate: mutate,
  };
}
