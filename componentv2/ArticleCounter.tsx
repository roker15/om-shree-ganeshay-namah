import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useGetArticleCount } from "../customHookes/apiHooks";

export const ArticleCounter = ({ subheadingId, creatorId }: { subheadingId: number; creatorId: string }) => {
  const { data, error } = useGetArticleCount(subheadingId, creatorId);
  return (
    <Text as="b" px="2" fontSize="12px">
      {data && data !== 0 ? data : ""}
    </Text>
  );
};
