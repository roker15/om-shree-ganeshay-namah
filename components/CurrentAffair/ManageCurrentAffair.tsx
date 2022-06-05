import { Box, Flex, Grid, GridItem, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useGetUserArticlesFromTags } from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import SuneditorForNotesMaking from "../editor/SuneditorForNotesMaking";

import Tags from "./Tags";

export default function ManageCurrentAffair() {
  const { profile } = useAuthContext();
  const { tagsArray } = useNoteContext();
  const { data: articles, isLoading: isArticleLoading, count } = useGetUserArticlesFromTags(profile?.id, tagsArray);

  return (
    <div>
      <Flex h="6" alignItems="center" mb="2">
        {count ? (
          <Tag p="2" bg="whatsapp.100">
            Total {count} Articles found
          </Tag>
        ) : <Spinner ml="16" size={"xs"} colorScheme="gray"/>}
      </Flex>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem colSpan={1} bg="orange.50">
          <Tags></Tags>
        </GridItem>
        <GridItem colSpan={4} px={{ base: "0.5", sm: "0.5", md: "6" }}>
          {isArticleLoading ? (
            <div>loading...</div>
          ) : articles ? (
            articles.map((article) => {
              return (
                <Flex key={article.id} pb="16">
                  <VStack width="full">
                    <Text alignSelf={"baseline"} bg="orange.100" p="2" fontSize="16px" casing="capitalize" align="left">
                      <Text as="b">Article Name :- </Text> {article.article_title}
                    </Text>

                    <Tabs size="md" colorScheme="whatsapp" width="full">
                      <TabList>
                        <Tab>Hindi</Tab>
                        <Tab>English</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel pl="2" pr="0.5" width="full">
                          <SuneditorForNotesMaking article={article} language={"HINDI"} isEditable={true} />
                        </TabPanel>
                        <TabPanel width="full">
                          <SuneditorForNotesMaking article={article} language={"ENGLISH"} isEditable={true} />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </VStack>
                </Flex>
              );
            })
          ) : null}
        </GridItem>
      </Grid>
    </div>
  );
}
