import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useGetArticleCount } from "../customHookes/apiHooks";

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string; }) => {
  const { data, swrError } = useGetArticleCount(subheadingId, creatorId);

  return (
    <Flex alignItems={"center"} px="2">
      <Text as={"label" && "b"} fontSize="12px">
        {data && data !== 0 ? data : ""}
      </Text>
    </Flex>
  );
};
