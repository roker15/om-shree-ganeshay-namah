import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import useSWR from "swr";
import { Database } from "../lib/database";
import { Data } from "../pages/api/prisma/syllabus/syllabus";

const cacheOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetSyllabusByBookId(bookId?: number) {
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    const response = await axios.get<Data>("/api/prisma/syllabus/syllabus").catch((e) => {
      throw e;
    });
    return response.data;
  };
  const { data, error } = useSWR("/api/prisma/syllabus/syllabus", fetcher, cacheOptions);

  return {
    data: data,
    isLoading: !error && !data,
    swrError: error,
  };
}
