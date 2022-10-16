import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Text, Wrap
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { useGetUserArticlesFromTags, useSearchCurrentAffairs } from "../../customHookes/networkHooks";
import { currentAffairTags } from "../../lib/constants";
import { Database } from "../../lib/database";
import { elog, sentenseCase } from "../../lib/mylog";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import SuneditorForNotesMakingg from "../editor/SuneditorForNotesMakingg";
import DeleteConfirmation from "../syllabus/DeleteConfirmation";
import SearchPanel from "./SearchPanel";

import Tags, { TagsDrawer } from "./Tags";

export function InfoAlert({ info }: { info: string }) {
  return (
    <Alert status="info" colorScheme={"gray"} alignItems="start" variant="left-accent">
      <AlertIcon />
      <div style={{ whiteSpace: "pre-line" }}>{info}</div>
    </Alert>
  );
}

export default function ManageCurrentAffair() {
  const  supabaseClient  = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const { tagsArray, setTagsArray } = useNoteContext();
  const [searchKeys, setSearchKeys] = useState<string | undefined>(undefined);
  const { data: searchResult, isLoading: isSearching } = useSearchCurrentAffairs(searchKeys!);
  const {
    data: articles,
    isLoading: isArticleLoading,
    count,
    swrError,
  } = useGetUserArticlesFromTags(profile?.id, tagsArray);

  const updateSearchResult = (searchKeys: string | undefined) => {
    if (searchKeys && searchKeys !== "") {
      setSearchKeys(searchKeys);
      setTagsArray!([]);
    }
  };
  useEffect(() => {
    if (tagsArray && tagsArray?.length > 0) {
      setSearchKeys(undefined);
    }
  }, [tagsArray]);
  // const [book, setBook] = useState<BookResponse | undefined>();

  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },
    });
  };


  const deleteArticle = async (id: number): Promise<void> => {
    const { data, error } = await supabaseClient.from("books_articles").delete().eq("id", id);
    if (error) {
      elog("MyNotes->deleteArticle", error.message);
      return;
    }
    if (data) {
      mutate([`/get-user-articles-bytags/${profile?.id}/${tagsArray}`]);
    }
  };
 
  return (
    <Box>
      <>
        <SearchPanel handledata={updateSearchResult} />
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
                        key={element.id}
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
                <Spinner />
              </Box>
            ) : count && count == 999 ? (
              <Box alignItems="center" w="131px">
                <Tag >Select Some Tags</Tag>
              </Box>
            ) : (
              <Box alignItems="center" w="131px">
                <Tag >{count} Articles Found</Tag>
              </Box>
            )}
            {count && count == 999 ? null : (
              <Button
                onClick={() => {
                  setTagsArray!([]);
                }}
              >
                Clear Tags
              </Button>
            )}
          </Flex>
        )}

        <Grid templateColumns="repeat(5, 1fr)" gap={"1.5"}>
          <>
            <GridItem colSpan={{ base: 0, sm: 0, md: 1 }} display={{ base: "none", sm: "none", md: "block" }} >
              <Tags></Tags>
            </GridItem>

            <GridItem colSpan={{ base: 5, sm: 5, md: 4 }} px={{ base: "0.5", sm: "0.5", md: "0.5" }}>
              {tagsArray && tagsArray.length === 0 && !searchKeys ? (
                <InfoAlert info={"No Topic Selected, Please Select Some topics from Tag Panel to see notes"} />
              ) : swrError ? (
                swrError.message
              ) : isArticleLoading ? (
                <div>loading...</div>
              ) : articles && articles.length > 0 ? (
                <Accordion allowMultiple>
                  {articles.map((article) => {
                    return (
                      <AccordionItem key={article.id} borderTopWidth="0px" borderBottomWidth="0px" my="2">
                        {({ isExpanded }) => (
                          <>
                           
                            <Flex>
                              <DeleteConfirmation
                                handleDelete={deleteArticle}
                                dialogueHeader={"Delete this Article?"}
                                isIconButton={true}
                                id={article.id}
                                display={undefined}
                              ></DeleteConfirmation>
                              <AccordionButton  _expanded={{ bg: "blackAlpha.50" }}>
                                <Box flex="1" textAlign="left">
                                  <Flex alignSelf="start" alignItems="center">
                                    <Text
                                      alignSelf={"baseline"}
                                     
                                    >
                                      <Text as="b">Article Name :- </Text> {sentenseCase(article.article_title)}
                                    </Text>
                                  </Flex>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </Flex>
                            <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: 0, lg: "4" }}>
                              {isExpanded && (
                                <Tabs variant="line" size="sm" colorScheme="brand" width="full">
                                  <TabList>
                                    <Tab>English</Tab>
                                    <Tab>Hindi</Tab>
                                  </TabList>
                                  <TabPanels>
                                    <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                      <SuneditorForNotesMakingg
                                        article1={article.id}
                                        language={"ENGLISH"}
                                        isEditable={true}
                                      />
                                    </TabPanel>
                                    <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                      <SuneditorForNotesMakingg article1={article.id} language={"HINDI"} isEditable={true} />
                                    </TabPanel>
                                  </TabPanels>
                                </Tabs>
                              )}
                            </AccordionPanel>
                            {/* </VStack> */}
                            {/* </Flex> */}
                          </>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : !searchKeys ? (
                <>
                  <InfoAlert
                    info={
                      "You don't have any notes in selected topics. Create some notes and come back again \n\n To create Notes :- \n\n Select   'Current Affairs'   Syllabus from below.  "
                    }
                  />
                  <Flex bg="gray.50" p="2" mt="2" justify={"center"} align={"center"} position={"relative"} w={"full"}>
                    {/* <BookFilter setParentProps={updateBookProps} /> */}
                  </Flex>
                </>
              ) : null}

              {isSearching ? (
                <div>Searching...</div>
              ) : searchResult?.length === 0 && searchKeys ? (
                <div>No notes found, Select Syllabus and Create some notes.</div>
              ) : (
                <Accordion allowMultiple>
                  {searchResult?.map((article) => {
                    return (
                      <AccordionItem key={article.id} borderTopWidth="0px" borderBottomWidth="0px" my="2">
                        {({ isExpanded }) => (
                          <>
                            {/* <Flex pb="16"> */}
                            {/* <VStack width="full"> */}
                            <Flex>
                              <DeleteConfirmation
                                handleDelete={deleteArticle}
                                dialogueHeader={"Delete this Article?"}
                                isIconButton={true}
                                id={article.id}
                                display={undefined}
                              ></DeleteConfirmation>
                              <AccordionButton  _expanded={{ bg: "blackAlpha.50" }}>
                                <Box flex="1" textAlign="left">
                                  <Flex alignSelf="start" alignItems="center">
                                    <Text
                                      alignSelf={"baseline"}
                                      
                                    >
                                      <Text as="b">Article Name :- </Text> {sentenseCase(article.article_title)}
                                    </Text>
                                  </Flex>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </Flex>
                            <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: 0, lg: "4" }}>
                              {isExpanded && (
                                <Tabs variant="line" size="sm" width="full">
                                  <TabList>
                                    <Tab>English</Tab>
                                    <Tab>Hindi</Tab>
                                  </TabList>
                                  <TabPanels>
                                    <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                      <SuneditorForNotesMakingg
                                        article1={article.id}
                                        language={"ENGLISH"}
                                        isEditable={true}
                                      />
                                    </TabPanel>
                                    <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                      <SuneditorForNotesMakingg article1={article.id} language={"HINDI"} isEditable={true} />
                                    </TabPanel>
                                  </TabPanels>
                                </Tabs>
                              )}
                            </AccordionPanel>
                            {/* </VStack> */}
                            {/* </Flex> */}
                          </>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </GridItem>
          </>
        </Grid>
      </>
    </Box>
  );
}
