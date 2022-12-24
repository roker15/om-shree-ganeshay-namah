import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import SuneditorForNotesMakingg from "./editor/SuneditorForNotesMakingg";
import { useGetLatestCurrentaffairs } from "../customHookes/apiHooks";
import { colorPrimary, fontPrimary } from "../lib/constants";
import GotoCurrentAffairs from "./GotoCurrentAffairs";
import { useAuthContext } from "../state/Authcontext";

const LandingPageCurrentAffairs = () => {
  const [language, setLanguage] = useState<"HINDI" | "ENGLISH">("ENGLISH");
  return (
    <div>
      <Center>
        <VStack>
          <br />
          <GotoCurrentAffairs />
          <br/>
          <Heading as="u" fontSize="xl">
            Latest Current Affairs
          </Heading>
          <br />
          {/* <Button
            size="md"
            w="28"
            colorScheme="blue"
            // variant={"outline"}
            onClick={() => {
              setLanguage(language === "HINDI" ? "ENGLISH" : "HINDI");
            }}
          >
            {language === "HINDI" ? "ENGLISH" : "HINDI"}
          </Button>
          <br /> */}
        </VStack>
      </Center>
      <CurrentAffairsContainer key={language} language={language} />
      {/* keys can be faster also - source reactorg docs*/}
    </div>
  );
};

export default LandingPageCurrentAffairs;

export const CurrentAffairsContainer = (props: { language: "HINDI" | "ENGLISH" }) => {
  const { profile } = useAuthContext();
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  // const canEdit = profile?.role === "ADMIN" ;
  const { articleTitles, isLoading } = useGetLatestCurrentaffairs();
  if (isLoading) {
    return (
      <Center h="28">
        <Spinner />
      </Center>
    );
  }
  return (
    <Container maxW="5xl" p="0.5">
      <Button
        size="md"
        colorScheme="blue"
        // variant={"outline"}
        onClick={() => {
          setTabIndex(tabIndex === 0 ? 1 : 0);
        }}
      >
        {tabIndex === 0 ? "SWITCH TO HINDI" : "SWITCH TO ENGLISH"}
      </Button>
      <br/>
      <br/>
      <br/>
      <VStack alignItems="left" spacing="16" >
        {articleTitles?.map((x) => (
          <VStack key={x.id} spacing="2" alignItems="left">
            <Heading fontSize={{base:"2xl",md:"3xl",lg:"4xl"}} color={colorPrimary}>
              💡 {x.article_title}
            </Heading>
            <Text as="label" color={colorPrimary}>
              {new Date(x.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                hour12: true,
              })}
            </Text>
            <br />
            <Tabs  index={tabIndex} onChange={handleTabsChange} variant="line" size="sm" colorScheme="brand" width="full">
              <TabList>
                <Tab>English</Tab>
                <Tab>Hindi</Tab>
              </TabList>
              <TabPanels >
                <TabPanel >
                  <Box p="2" mx="-4" bg="facebook.100" borderRadius={"10"}>
                    <SuneditorForNotesMakingg
                      article1={x.id}
                      language={"ENGLISH"}
                      isEditable={profile?.role === "ADMIN" || profile?.id === x.created_by || profile?.role === "M1"}
                    />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box p="2" mx="-4" bg="facebook.100" borderRadius={"10"}>
                    <SuneditorForNotesMakingg
                      article1={x.id}
                      language={"HINDI"}
                      isEditable={profile?.role === "ADMIN" || profile?.id === x.created_by || profile?.role === "M1"}
                    />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        ))}
      </VStack>
    </Container>
  );
};
