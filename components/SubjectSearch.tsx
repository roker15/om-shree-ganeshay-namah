import { Select } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import { supabase } from "../lib/supabaseClient";
import { useAppContext } from "../state/state";
import { Papers } from "../types/myTypes";

const SubjectSearch: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [papers, setPapers] = React.useState<Papers[] | null>(null);
  const router = useRouter();
  const appContext = useAppContext();

  // Make a request

  const { data, error } = useSWR(
    "/upscpapers",
    async () =>
      await supabase.from<Papers>("papers").select(`
  id,paper_name`)
  );

  useEffect(() => {
    if (data?.data) {
      setPapers(data?.data);
    }
  }, [data?.data]);

  const handleChange = (event: any) => {
    // event.preventDefault();
    setValue(event.target.value);
    const href = `/syllabus/${encodeURIComponent(event.target.value)}`;
    router.push(href);
  };
  if (papers && papers.length !== 0) {
    return (
      <Select
        placeholder="Select Exam Paper"
        variant="outlined"
        // bg="greenyellow"
        w="full"
        fontSize={{ base: "smaller", md: "md" }}
        // height="auto"
        onChange={handleChange}
      >
        {papers!.map((x) => {
          console.log("ho raha haw ");
          return (
            <option selected={x.id.toString() == appContext.paperId!} key={x.id} value={x.id}>
              {x.paper_name}
            </option>
          );
        })}
      </Select>
    );
  }
  return <div>no data</div>;
};

export default SubjectSearch;
