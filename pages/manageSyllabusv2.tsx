import { Box, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdAdd, MdLightMode } from "react-icons/md";
import useSWR from "swr";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data } from "./api/prisma/syllabus/posts";

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
        <VStack display="inline-block" w="80">
          <Box p="2" bg="brand.50">
            {data?.book_name}
          </Box>
          <Box display="inline-block">
            <VStack alignItems="left" spacing="4">
              {data?.books_headings.map((headings, index) => (
                <VStack key={headings.id} alignItems="left">
                  <Flex
                    alignItems={"baseline"}
                    onClick={() => setselectedHeading(selectedHeading !== headings.id ? headings.id : undefined)}
                  >
                    <IconButton
                      variant="ghost"
                      icon={selectedHeading !== headings.id ? <MdAdd /> : <MdLightMode />}
                      aria-label={""}
                    ></IconButton>
                    <Text as="b" casing={"capitalize"} cursor="pointer">
                      {headings.heading}
                    </Text>
                  </Flex>
                  <VStack
                    alignItems={"left"}
                    pl="8"
                    display={selectedHeading === headings.id ? "block" : "none"}
                    spacing="4"
                  >
                    {headings.books_subheadings.map((subheading) => (
                      <Flex key={subheading.id}>
                        <Text fontSize={"sm"} casing={"capitalize"}>
                          {subheading.subheading}
                        </Text>
                        {profile && profile.id && <ArticleCounter subheadingId={subheading.id} creatorId={profile.id} />}
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      )}{" "}
    </Box>
  );
};

(ManageSyllabusv2 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv2;

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [count, setCount] = useState<number | undefined>(undefined);
  const getArticleCount = async () => {
    const { data, error, count } = await supabaseClient
      .from("books_articles")
      .select("*", { count: "exact", head: true })
      .match({ books_subheadings_fk: subheadingId, created_by: creatorId });
    if (count) {
      setCount(count);
    }
  };
  useEffect(() => {
    getArticleCount();
  }, []);

  return (
    <Flex alignItems={"center"} px="2">
      <Text as={"label" && "b"} fontSize="12px">
        {count}
      </Text>
    </Flex>
  );
};
