import { useSessionContext } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { Subheading } from "../types/myTypes";

export function useGetSubheadingsFromHeadingId(currentHeadingId?: number) {
    const {  supabaseClient } = useSessionContext();
    const { data, error } = useSWR(
        currentHeadingId == undefined ? null : ["/headingId", currentHeadingId],
        async () => await supabaseClient.from("subheadings").select("*").eq("main_topic_id", currentHeadingId),
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




