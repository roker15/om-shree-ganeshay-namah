import { Box, Button, Center, Container, Heading, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import SuneditorForNotesMakingg from "../components/editor/SuneditorForNotesMakingg";
import { useGetLatestCurrentaffairs } from "../customHookes/apiHooks";
import { markitWebColor } from "../lib/constants";

const LandingPageCurrentAffairs = () => {
  const [language, setLanguage] = useState<"HINDI" | "ENGLISH">("ENGLISH");
  return (
    <div>
      <Center h="100px">
        <VStack>
          <Heading as="u" fontSize="xl">
            Latest Current Affairs
          </Heading>
          <Button
            size="md"
            onClick={() => {
              setLanguage(language === "HINDI" ? "ENGLISH" : "HINDI");
            }}
          >
            {language === "HINDI" ? "ENGLISH" : "HINDI"}
          </Button>
        </VStack>
      </Center>
      {/* keys can be faster also - source reactorg docs*/}
      <CurrentAffairsContainer key={language} language={language} />
    </div>
  );
};

export default LandingPageCurrentAffairs;

export const CurrentAffairsContainer = (props: { language: "HINDI" | "ENGLISH" }) => {
  const { articleTitles } = useGetLatestCurrentaffairs();
  return (
    <Container maxW="5xl">
      <VStack alignItems="left" spacing="16">
        {articleTitles?.map((x) => (
          <VStack key={x.id} spacing="2" alignItems="left">
            <Heading fontSize="4xl" color={"facebook.500"}>
              {x.article_title}
            </Heading>
            <Text as="label" color={markitWebColor}>
              {new Date(x.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                hour12: true,
              })}
            </Text>
            <Box p="2" bg="facebook.100" borderRadius={"10"} >

            <SuneditorForNotesMakingg article1={x.id} language={props.language} isEditable={false} />
            </Box>
          </VStack>
        ))}
      </VStack>
    </Container>
  );
};
