import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import useSWR from "swr";
import { Database } from "../lib/database";
import { SyllabusModerator2 } from "../pages/api/prisma/syllabus/getsyllabusmoderatorbystatus";
import { Data } from "../pages/api/prisma/syllabus/syllabus";
import { SyllabusModerator } from "../pages/api/prisma/syllabus/usegetsyllabusmoderator";
import { Book } from "../state/SyllabusContext";

const cacheOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetSyllabusByBookId(bookId: number | undefined) {
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    const response = await axios
      .get<Data>("/api/prisma/syllabus/syllabus", { params: { bookId: bookId } })
      .catch((e) => {
        throw e;
      });
    return response.data;
  };
  const { data, error, mutate, isValidating} = useSWR(
    bookId ? [`/api/prisma/syllabus/syllabus/${bookId}`] : null,
    fetcher,
    cacheOptions
  );

  return {
    data: data,
    isLoading: !data && !error && isValidating,
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
  const { data, error, mutate, isValidating } = useSWR(
    bookId ? ["/api/prisma/syllabus/usegetsyllabusmoderator", bookId] : null,
    fetcher,
    cacheOptions
  );
  console.log("data is ", JSON.stringify(data));
  return {
    data: data,
    //isValidating ensures no loading condition when request is rejected in case of null key
    isLoading: !data && !error && isValidating,
    swrError: error,
    mutate: mutate,
  };
}
export function useGetSyllbusModeratorbyStatus(isActive: string | undefined) {
  const fetcher = async () => {
    const response = await axios
      .get<SyllabusModerator2[]>("/api/prisma/syllabus/getsyllabusmoderatorbystatus", { params: { status: isActive } })
      .catch((e) => {
        throw e;
      });
    return response.data;
  };
  const { data, error, mutate, isValidating } = useSWR(
    isActive ? ["/api/prisma/syllabus/useGetSyllbusModeratorbyStatus", isActive] : null,
    fetcher,
    cacheOptions
  );
  return {
    data: data,
    //isValidating ensures no loading condition when request is rejected in case of null key
    isLoading: !data && !error && isValidating,
    swrError: error,
    mutate: mutate,
  };
}
