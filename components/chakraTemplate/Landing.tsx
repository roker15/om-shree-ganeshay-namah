import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  IconProps,
  useColorModeValue,
} from "@chakra-ui/react";
import router from "next/router";
import { BASE_URL } from "../../lib/constants";
import { LoginCard } from "../LoginCard";
import { useUser } from "@supabase/auth-helpers-react";
export default function CallToActionWithVideo() {
  const { user, error } = useUser();
 
  const ROUTE_POST_ID = "/reviseCurrentAffair";
  const navigateTo = (path: string) => {
    router.push({
      pathname: path,
    });
  };
  return (
    <Container maxW={"6xl"}>
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
              Prepare all your UPSC Notes Digitally at one place
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              Exactly as per Syllabus
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Yes! We know you study currnet Affair date wise, but you prefer to revise Topic wise. We bring you exactly the
            same.
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
                    color:"white"
                  }}
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
                   color:"white"
                 }}
                onClick={() => navigateTo( "/reviseCurrentAffair")}
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
                    color:"white"
                  }}
                onClick={() => navigateTo("/questionBanks")}
              >
                Practice Question-Answer
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
