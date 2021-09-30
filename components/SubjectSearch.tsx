import { Container, Select, Stack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import { useAuthContext } from "../context/Authcontext";
import { supabase } from "../lib/supabaseClient";
import { Papers } from "../types/myTypes";

const SubjectSearch: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [papers, setPapers] = React.useState<Papers[] | null>(null);
  const router = useRouter();

  // Make a request

  const { data, error } = useSWR(
    "/upscpapers",
    async () =>
      await supabase.from<Papers>("papers").select(`
  id,paper_name`)
  );

  useEffect(() => {
    setPapers(data?.data!);
  });

  const handleChange = (event: any) => {
    // event.preventDefault();
    setValue(event.target.value);
    const href = `/syllabus/${encodeURIComponent(event.target.value)}`;
    router.push(href);
    console.log("hello hello ", value);
  };
  const { user, role } = useAuthContext();

  if (papers && papers.length !== 0) {
    return (
  
              <Select
                placeholder="Select Exam Paper"
                variant="outlined"
                // bg="greenyellow"
                w="full"
                // height="auto"
                onChange={handleChange}
              >
                {papers!.map((number) => {
                  console.log("ho raha haw ");
                  return (
                    <option key={number.id} value={number.id}>
                      {number.paper_name}
                    </option>
                  );
                })}
              </Select>
            
          
   
    );
  }
  return <div>no data</div>;
};

export default SubjectSearch;
