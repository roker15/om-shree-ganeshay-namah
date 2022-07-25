import { Box, Button, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import { BASE_URL } from "../../lib/constants";
import { LoginCard } from "../LoginCard";
export default function CallToActionWithVideo() {
  const { user, error } = useUser();

  const navigateTo = (path: string) => {
    router.push({
      pathname: path,
    });
  };
  return (
    <Container maxW={"6xl"}>
      <Text justifyContent={"center"} mt="6" fontSize={{ base: "xl", md: "2xl" } } fontStyle="initial" bg="gray.600" color="gray.50" p="2" borderRadius={5}>
        Toppers Manage 70% of their content Digitally, How much You do?
        {/* 7000+ Students using Jionote to Create their Notes Digitially */}
      </Text>
      {/* <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" position={"relative"} color="orange.400">
        7000+ UPSC Aspirants using Jionote to Prepare their Notes
      </Text> */}
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading lineHeight={1.1} fontWeight={700} fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "red.400",
                zIndex: -1,
              }}
            >
              Prepare all Subjects UPSC Notes Digitally,
            </Text>
            <br />
            <Text as={"span"} color={"cornflowerblue"}>
              Exactly as per Syllabus
            </Text>
          </Heading>
          <Text color={"gray.600"}>
            You study most of your content digitally. Then why not Complement your digital Study with Digital notes making
            platform?
          </Text>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: "column", sm: "row" }}>
            {!user && <LoginCard redirect={BASE_URL} />}
          </Stack>
        </Stack>
        <Flex flex={0.5} justify={"center"} align={"center"} position={"relative"} w={"full"} justifyContent={"center"}>
          <Box position={"relative"} rounded={"2xl"} bg="#f0f2f5" boxShadow={"lg"} width={"full"} overflow={"hidden"}>
            {/* <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={"https://i.imgur.com/A0VfjhR.jpeg"}
            /> */}
            <Stack spacing="10" py="16" px="8">
              <Button
                colorScheme={"black"}
                size="lg"
                px={10}
                borderRadius="full"
                variant="outline"
                _hover={{
                  bg: "gray.700",
                  color: "white",
                }}
                onClick={() => navigateTo("/syllabusSwitch")}
              >
                Create Current Affair Notes
              </Button>
              <Button
                colorScheme={"black"}
                size="lg"
                px={10}
                borderRadius="full"
                variant="outline"
                _hover={{
                  bg: "gray.700",
                  color: "white",
                }}
                onClick={() => navigateTo("/reviseCurrentAffair")}
              >
                Read Current Affairs Notes
              </Button>
              <Button
                colorScheme={"black"}
                size="lg"
                px={10}
                borderRadius="full"
                variant="outline"
                _hover={{
                  bg: "gray.700",
                  color: "white",
                }}
                onClick={() => navigateTo("/questionBanks")}
              >
                Practice Question-Answer
              </Button>
              <Button
                colorScheme={"black"}
                size="lg"
                px={10}
                borderRadius="full"
                variant="outline"
                _hover={{
                  bg: "gray.700",
                  color: "white",
                }}
                onClick={() => navigateTo("/questionBanks")}
              >
                Create All Notes
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
