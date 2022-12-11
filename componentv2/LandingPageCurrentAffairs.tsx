import { Box, Button, Center, Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
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
          <Heading as="u" fontSize="xl">
            Latest Current Affairs
          </Heading>
          <br />
          <br />
          <Button
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
          <br />
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
    <Container maxW="5xl">
      <VStack alignItems="left" spacing="16">
        {articleTitles?.map((x) => (
          <VStack key={x.id} spacing="2" alignItems="left">
            <Heading fontSize="4xl" color={colorPrimary}>
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
            <Box p="2" bg="facebook.100" borderRadius={"10"}>
              <SuneditorForNotesMakingg
                article1={x.id}
                language={props.language}
                isEditable={profile?.role === "ADMIN" || profile?.id === x.created_by ||profile?.role === "M1"}
              />
            </Box>
          </VStack>
        ))}
      </VStack>
    </Container>
  );
};
