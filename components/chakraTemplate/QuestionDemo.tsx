import { Flex, Container, Image, Heading, Stack, Text, Button, Icon, IconProps, Box } from "@chakra-ui/react";
import router from "next/router";
import EditorForFrontPage from "./EditorForFrontPage";

export default function CallToActionWithIllustration() {
  const route = "/questionBanks";
  const navigateTo = () => {
    router.push({
      pathname: route,
    });
  };
  return (
    <Container maxW={"5xl"}>
      <Stack textAlign={"center"} align={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
        <Heading fontWeight={700} fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
          Practice Your Answer Writing Right here <br />
          <Text as={"span"} color={"blue.400"}>
            And Edit your Answer till it gets perfect
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Practice you answer writing with previous year questions.  Keep
          learning and Keep updating your answer till it gets perfect.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"blue.400"}
            _hover={{ bg: "orange.500" }}
            onClick={() => navigateTo()}
          >
            Practice Question-Answer
          </Button>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Box rounded={"2xl"} boxShadow={"2xl"}>
            <Image
              alt={"Question"}
              objectFit={"scale-down"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={
                // "https://hbvffqslxssdbkdxfqop.supabase.co/storage/v1/object/public/notes-images/2d0eb255-5b2e-4112-9260-3a3429858104-ed2.PNG"
                "https://i.imgur.com/olC6Os3.png"
              }
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
