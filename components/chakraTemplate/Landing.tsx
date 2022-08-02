import { Box, Button, Container, Flex, Heading, Icon, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import { useEffect } from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { BASE_URL } from "../../lib/constants";
import { LoginCard } from "../LoginCard";
export default function CallToActionWithVideo() {
  const { user, error } = useUser();

  const whatsappuri = useBreakpointValue(
    {
      base: "https://api.whatsapp.com/send?text= Prepare Digital UPSC Notes https://www.jionote.com",
      lg: "https://web.whatsapp.com/send?text= Prepare Digital UPSC Notes https://www.jionote.com",
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: "base",
    }
  );

  let uri = "https://www.jionote.com/";
  let encodeduri = encodeURIComponent(uri);
  let text = "Prepare Digital UPSC Notes";
  let encodedtext = encodeURIComponent(text);
  useEffect(() => {
    console.log(whatsappuri);
    // supabaseTest();
  }, [whatsappuri]);

  const navigateTo = (path: string) => {
    router.push({
      pathname: path,
    });
  };
  return (
    // <Box w="100wh" bg="red">
    <Container maxW={"6xl"} px="8">
      <Stack
        // alignItems={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: "16", md: 24 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={3} spacing={{ base: 5, md: 10 }}>
          <Heading lineHeight={1.1} fontWeight={"extrabold"} fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
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
                zIndex: -1,
              }}
            >
              Prepare Digital UPSC Notes
            </Text>
            <br />
            <Text as={"span"} color={"cornflowerblue"}>
              Exactly as per Syllabus
            </Text>
          </Heading>
          <Text color={"gray.600"}>7000+ aspirants using Jionote</Text>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: "column", sm: "row" }}>
            {!user && <LoginCard redirect={BASE_URL} />}
          </Stack>
          <Box>
            <Flex alignItems={"center"}>
              <Icon as={FaWhatsapp} color="whatsapp.500" m="2" />
              <a
                href={whatsappuri}
                // href="https://api.whatsapp.com/send?text= Prepare Digital UPSC Notes https://www.jionote.com"
                // href="https://wa.me/?text= Prepare Digital UPSsC Notes https://www.jionote.com"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="share-icon"
              >
                Invite Friends via Whatsapp
              </a>
            </Flex>
            <Flex alignItems={"center"}>
              <Icon as={FaTelegram} color="telegram.500" m="2" />
              <a
                // href="https://telegram.me/share/url?url=https://www.jionote.com/&text=visit"
                href={`https://telegram.me/share/url?url=${encodeduri}&text=${encodedtext}`}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="share-icon"
              >
                Invite Friends via Telegram
              </a>
            </Flex>
          </Box>
        </Stack>
        <Flex flex={1} justify={"center"} align={"center"} position={"relative"} w={"full"}>
          <Stack spacing="10" py="16" px="8" align="center" bg="#f0f2f5" borderRadius={"lg"} shadow={"lg"}>
            <Button
              colorScheme={"black"}
              size="lg"
              // px={10}
              // maxW="96"
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
              // px={10}
              // maxW="96"
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
              // px={10}
              // maxW="96"
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
          </Stack>
        </Flex>
      </Stack>
    </Container>
    //  </Box>
  );
}
