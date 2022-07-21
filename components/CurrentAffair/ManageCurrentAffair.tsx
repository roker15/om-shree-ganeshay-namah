import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useGetUserArticlesFromTags } from "../../customHookes/networkHooks";
import { currentAffairTags } from "../../lib/constants";
import { elog } from "../../lib/mylog";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import SuneditorForNotesMaking from "../editor/SuneditorForNotesMaking";

import Tags, { TagsDrawer } from "./Tags";

function InfoAlert({ info }: { info: string }) {
  return (
    <Alert status="info" colorScheme={"gray"} alignItems="start">
      <AlertIcon />
      {/* <Text as="p">{info}</Text> */}
      <div style={{whiteSpace: 'pre-line'}}>{info}</div>
      {/* {info} */}
    </Alert>
  );
}

export default function ManageCurrentAffair() {
  const { profile } = useAuthContext();
  const { tagsArray, setTagsArray } = useNoteContext();
  const {
    data: articles,
    isLoading: isArticleLoading,
    count,
    swrError,
  } = useGetUserArticlesFromTags(profile?.id, tagsArray);

  return (
    <Box>
      <>
        <Flex display={{ base: "block", sm: "block", md: "none" }}>
          <TagsDrawer></TagsDrawer>
        </Flex>
        <Wrap spacing="5px" mt="4">
          {tagsArray && tagsArray.length > 0
            ? tagsArray.map((x1) => {
                for (let index = 0; index < currentAffairTags.length; index++) {
                  const element = currentAffairTags[index];
                  if (element.id == x1) {
                    return (
                      <Button
                        size="xs"
                        key={element.id}
                        bg="gray.50"
                        px="1.5"
                        // fontWeight={"normal"}
                        // fontSize="xs"
                        mx="2"
                      >
                        {element.tag}
                      </Button>
                    );
                  }
                }
              })
            : null}
        </Wrap>
        {swrError ? (
          elog("ManageCurrentAffair", swrError.message)
        ) : (
          <Flex h="6" alignItems="center" my="2">
            {isArticleLoading ? (
              <Box alignItems="center" justifyContent="center" w="131px">
                <Spinner ml="16" size={"xs"} colorScheme="gray" />
              </Box>
            ) : count && count == 999 ? (
              <Box alignItems="center" w="131px">
                <Tag bg="whatsapp.100">Select Some Tags</Tag>
              </Box>
            ) : (
              <Box alignItems="center" w="131px">
                <Tag bg="whatsapp.100">{count} Articles Found</Tag>
              </Box>
            )}
            {count && count == 999 ? null : (
              <Button
                size="xs"
                variant="outline"
                px="1.5"
                mx="2"
                colorScheme={"green"}
                onClick={() => {
                  setTagsArray!([]);
                }}
              >
                Clear Tags
              </Button>
            )}
          </Flex>
        )}

        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          <>
            <GridItem colSpan={{ base: 0, sm: 0, md: 1 }} display={{ base: "none", sm: "none", md: "block" }} bg="brand.50">
              <Tags></Tags>
            </GridItem>

            <GridItem colSpan={{ base: 5, sm: 5, md: 4 }} px={{ base: "0.5", sm: "0.5", md: "6" }}>
              {tagsArray && tagsArray.length === 0 ? (
                <InfoAlert info={"No Topic Selected, Please Select Some topics from Menu or Left Panel to see notes"} />
              ) : swrError ? (
                swrError.message
              ) : isArticleLoading ? (
                <div>loading...</div>
              ) : articles && articles.length > 0 ? (
                articles.map((article) => {
                  return (
                    <Flex key={article.id} pb="16">
                      <VStack width="full">
                        <Text alignSelf={"baseline"} bg="brand.100" p="2" fontSize="16px" casing="capitalize" align="left">
                          <Text as="b">Article Name :- </Text> {article.article_title}
                        </Text>

                        <Tabs variant='solid-rounded' size="sm" colorScheme="gray" width="full">
                          <TabList>
                            <Tab>English</Tab>
                            <Tab>Hindi</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel pl="2" pr="0.5" width="full">
                              <SuneditorForNotesMaking article={article} language={"ENGLISH"} isEditable={true} />
                            </TabPanel>
                            <TabPanel width="full">
                              <SuneditorForNotesMaking article={article} language={"HINDI"} isEditable={true} />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </VStack>
                    </Flex>
                  );
                })
              ) : (
                <InfoAlert
                  info={"You don't have any notes in selected topic. Create some notes and come back again \n\n To create Notes :- \n\n 1. Click 'Change Syllabus' on Top \n2. Select 'Current Affairs' from first dropdown. \n 3. Select 'Current affairs - 2022' from second dropdown.\n .4 Select 'Syllabus' from 3rd dropdown, this will open syllabus, where you can create notes by selecting topic. "}
                />
              )}
            </GridItem>

            {/* {tagsArray && tagsArray.length === 0 ? (
              <div>No Topic Selected, Please Select Some topics to see notes</div>
            ) : swrError ? (
              elog("ManageCurrentAffair", swrError.message)
            ) : (
              <GridItem colSpan={{ base: 5, sm: 5, md: 4 }} px={{ base: "0.5", sm: "0.5", md: "6" }}>
                {isArticleLoading ? (
                  <div>loading...</div>
                ) : articles && articles.length > 0 ? (
                  articles.map((article) => {
                    return (
                      <Flex key={article.id} pb="16">
                        <VStack width="full">
                          <Text alignSelf={"baseline"} bg="brand.100" p="2" fontSize="16px" casing="capitalize" align="left">
                            <Text as="b">Article Name :- </Text> {article.article_title}
                          </Text>

                          <Tabs size="md" colorScheme="whatsapp" width="full">
                            <TabList>
                              <Tab>English</Tab>
                              <Tab>Hindi</Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel pl="2" pr="0.5" width="full">
                                <SuneditorForNotesMaking article={article} language={"ENGLISH"} isEditable={true} />
                              </TabPanel>
                              <TabPanel width="full">
                                <SuneditorForNotesMaking article={article} language={"HINDI"} isEditable={true} />
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        </VStack>
                      </Flex>
                    );
                  })
                ) : (
                  "Either you have not selected any Tags or you don't have any notes in selected tags. create some notes and come back"
                )}
              </GridItem>
            )} */}
          </>
        </Grid>
      </>
    </Box>
  );
}
