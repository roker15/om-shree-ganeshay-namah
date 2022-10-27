import { Box, Button, Center, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";

export type action = "heading_new" | "heading_edit" | "subheading_new" | "subheading_edit";
const ManageSyllabusv2: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [selectedHeading, setselectedHeading] = useState<number | undefined>(undefined);
  const { data, swrError } = useGetSyllabusByBookId(12);
  const [action, setAction] = useState<action | undefined>(undefined);

  if (swrError) {
    return <Center h="100vh">{swrError.message}</Center>;
  }
  return (
    <Box maxW="xl" p="2" bg="brand.50">
      {user && profile?.role === "ADMIN" && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text fontSize="lg" as="u">
              {data?.book_name}
            </Text>
            <Button variant="solid" size="xs" onClick={() => setAction("heading_new")}>
              {" "}
              Add Chapter
            </Button>
          </HStack>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
              <VStack key={headings.id} alignItems="left">
                <HStack
                  alignItems={"baseline"}
                  onClick={() => setselectedHeading(selectedHeading !== headings.id ? headings.id : undefined)}
                >
                  <Text as="b" casing={"capitalize"} cursor="pointer">
                    {headings.heading}
                  </Text>
                  <Button variant="solid" size="xs">
                    {" "}
                    Add Topic
                  </Button>
                </HStack>
                <VStack alignItems={"left"} pl="8" spacing="4">
                  {headings.books_subheadings.map((subheading) => (
                    <Flex key={subheading.id}>
                      <Text fontSize={"sm"} casing={"capitalize"}>
                        {subheading.subheading}
                      </Text>
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

(ManageSyllabusv2 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv2;
