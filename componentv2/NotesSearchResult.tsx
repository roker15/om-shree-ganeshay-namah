import { Box, Flex, HStack, VStack,Text } from "@chakra-ui/layout";
import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import React from "react";
import { mutate } from "swr";
import ErrorBoundary from "../components/ErrorBoundary";
import { useSearchCurrentAffairs } from "../customHookes/networkHooks";
import { colorPrimary } from "../lib/constants";
import { sentenseCase } from "../lib/mylog";
import SuneditorForNotesMakingg from "./editor/SuneditorForNotesMakingg";

const NotesSearchResult = (props: { searchKeys: string }) => {
  const { data, isLoading } = useSearchCurrentAffairs(props.searchKeys!);
  return (
    <Box >
      <Accordion allowMultiple>
        <VStack>
          {data && data
            // ?.sort((a, b) => a.updated_at! - b.updated_at!)
            .map((x) => (
              <HStack key={x.id} w="full" alignItems="baseline">
                {/* <NotesContextMenu article={x} onChangeCallback={props.onChangeCallback} mutate={mutate} /> */}
                <AccordionItem w="full" border="none">
                  {({ isExpanded }) => (
                    <Box key={x.id}>
                      <Flex alignItems="left">
                        <AccordionButton
                          border={"0px"}
                          bg="brand.50"
                          _hover={{ bg: "brand.100" }}
                          _expanded={{ bg: "brand.100", color: colorPrimary }}
                          justifyContent="space-between"
                        >
                          <Text p="1" fontSize="16px" lineHeight={"tall"} align="start">
                            <Text as="b">Article Name :- </Text> {sentenseCase(x.article_title)}
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>

                      <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: "-0.5", lg: "0" }}>
                        {isExpanded && (
                          <Tabs variant="line" size="sm" colorScheme="gray">
                            <TabList>
                              <Tab>English</Tab>
                              <Tab>Hindi</Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel px={{ base: "-0.5", lg: "4" }}>
                                <ErrorBoundary>
                                  <SuneditorForNotesMakingg article1={x.id} language={"ENGLISH"} isEditable={true} />
                                </ErrorBoundary>
                              </TabPanel>
                              <TabPanel px={{ base: "-0.5", lg: "4" }}>
                                <SuneditorForNotesMakingg article1={x.id} language={"HINDI"} isEditable={true} />
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        )}
                      </AccordionPanel>
                    </Box>
                  )}
                </AccordionItem>
              </HStack>
            ))}
        </VStack>
      </Accordion>
    </Box>
  );
};

export default NotesSearchResult;

