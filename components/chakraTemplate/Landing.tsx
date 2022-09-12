import { Box, Button, Container, Flex, Heading, Icon, Link, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import { useEffect } from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { BASE_URL } from "../../lib/constants";
import { LoginCard } from "../LoginCard";
import SelectSyllabus from "./SelectSyllabus";
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
    <Container maxW={"6xl"} px={{ base: "2", md: "8" }}>
      {!user && (
        <Flex justifyContent={"end"}>
          {" "}
          <LoginCard redirect={BASE_URL} />
        </Flex>
      )}
      <Heading
        fontWeight={"normal"}
        fontSize={{ base: "xl", sm: "2xl", lg: "xl" }}
        bg="gray.100"
        p="4"
        mt="2"
        color="gray.600"
        borderRadius={"base"}
      >
        <Text as={"span"}></Text>Jionote is an{" "}
        <Text as="span" fontWeight="bold">
          Online Notes making platform
        </Text>{" "}
        for UPSC, NCERT, Current Affairs etc.{" "}
        <Link isExternal color="telegram.400" fontWeight="bold" href="https://youtu.be/XD3Rr1nLTkY">
          Watch Demo Video
        </Link>
      </Heading>
      <Stack flex={3} spacing={{ base: "2", md: 2 }} py={{ base: "16", md: 16 }} alignItems={"center"}>
        <button
          className="pushable"
          onClick={() => {
            router.push("/dna");
          }}
        >
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front">Editable Current Affairs 22-23 </span>
        </button>

        <br />
        <br />

        <SelectSyllabus />
        <br />
        <br />
        <Text color={"gray.600"}>7000+ UPSC aspirants, 25000+ students using Jionote</Text>
        {/* <Box>
          <Flex
            alignItems={"center"}
            border="1px"
            borderColor={"orange.100"}
            borderRadius="5px"
            bg="orange.50"
            width="240px"
            p="1"
            my="2"
            _hover={{ background: "orange.100" }}
          >
            <Icon as={FaWhatsapp} color="whatsapp.500" m="2" />
            <a
              href={whatsappuri}
              // href="https://wa.me/?text= Prepare Digital UPSsC Notes https://www.jionote.com"
              rel="nofollow noopener noreferrer"
              target="_blank"
              className="share-icon"
            >
              Invite Friends via Whatsapp
            </a>
          </Flex>
          <Flex
            alignItems={"center"}
            border="1px"
            borderColor={"orange.100"}
            borderRadius="5px"
            bg="orange.50"
            width="240px"
            p="1"
            my="2"
            _hover={{ background: "orange.100" }}
          >
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
        </Box> */}
      </Stack>
    </Container>
  );
}
