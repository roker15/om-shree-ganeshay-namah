import { Box, VStack, Text } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data } from "./api/prisma/posts/posts";

const ManageSyllabusv2: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [selectedHeading, setselectedHeading] = useState<number | undefined>(undefined);
  const fetcher = async () => {
    // if (window.confirm("Do you want to delete this food?")) {
    const response = await axios.get<Data>("/api/prisma/posts/posts").catch((e) => {
      throw e;
      // console.log("error is ",e)
    });
    return response.data;
    // }
  };
  const { data, error } = useSWR("/api/prisma/posts/posts", fetcher);

  useEffect(() => {
    console.log(JSON.stringify(data));
  }, [data]);

  return (
    <Box minW="full">
      {user && profile?.role === "ADMIN" && (
        <VStack>
          Welcome
          <Box>{data?.book_name}</Box>
          <Box>
            {data?.books_headings.map((headings, index) => (
              <Box key={headings.id}>
                <Text
                  as="b"
                  casing={"capitalize"}
                  onClick={() => setselectedHeading(selectedHeading !== headings.id ? headings.id : undefined)}
                  cursor="pointer"
                >
                  {headings.heading}
                </Text>
                <VStack alignItems={"left"} px="4" display={selectedHeading === headings.id ? "block" : "none"} width="80">
                  {headings.books_subheadings.map((subheading) => (
                    <Text key={subheading.id} casing={"capitalize"}>
                      {subheading.subheading}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </Box>
        </VStack>
      )}{" "}
    </Box>
  );
};

(ManageSyllabusv2 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv2;
