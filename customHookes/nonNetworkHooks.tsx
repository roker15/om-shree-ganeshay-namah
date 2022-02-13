import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { Subheading } from "../types/myTypes";

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