import { Box, Center, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { MdAdd, MdLightMode } from "react-icons/md";
import { useGetArticleCount, useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";

const ManageSyllabusv3: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [selectedHeading, setselectedHeading] = useState<number | undefined>(undefined);
  const { data, swrError } = useGetSyllabusByBookId(12);

  if (swrError) {
    return <Center h="100vh">{swrError.message}</Center>;
  }
  return (
    <Box minW="full">
      {user && profile?.role === "ADMIN" && (
        <VStack display="inline-block" w="80">
          <Box p="2" bg="brand.50">
            {data?.book_name}
          </Box>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
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
                <VStack alignItems={"left"} pl="8" display={selectedHeading === headings.id ? "block" : "none"} spacing="4">
                  {headings.books_subheadings.map((subheading) => (
                    <Flex key={subheading.id}>
                      <Text fontSize={"sm"} casing={"capitalize"}>
                        {subheading.subheading}
                      </Text>
                      {profile && profile.id && selectedHeading === headings.id && (
                        <ArticleCounter subheadingId={subheading.id} creatorId={profile.id} />
                      )}
                    </Flex>
                  ))}
                </VStack>
              </VStack>
            ))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};

(ManageSyllabusv3 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv3;

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string }) => {
  const { data, swrError } = useGetArticleCount(subheadingId, creatorId);

  return (
    <Flex alignItems={"center"} px="2">
      <Text as={"label" && "b"} fontSize="12px">
        {data && data !== 0 ? data : ""}
      </Text>
    </Flex>
  );
};
