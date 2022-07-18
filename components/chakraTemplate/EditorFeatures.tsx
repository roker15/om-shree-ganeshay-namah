import { Flex, Container, Heading, Stack, Text, Button, Icon, IconProps, Box } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import { BASE_URL } from "../../lib/constants";
import { LoginCard } from "../LoginCard";
import EditorForFrontPage from "./EditorForFrontPage";

export default function CallToActionWithIllustration() {
  const { user, error } = useUser();
  const ROUTE_POST_ID = "/syllabusSwitch";
  const navigateTo = () => {
    router.push({
      pathname: ROUTE_POST_ID,
    });
  };
  return (
    <Container maxW={"5xl"}>
      <Stack textAlign={"center"} align={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
        <Heading fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
          Modern Text Editor <br />
          <Text as={"span"} color={"orange.400"}>
            Create Concise and beautiful Notes
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Create Rich colourful Content and Save to our cloud, you can access your notes even after 10 years.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
            _hover={{ bg: "orange.500" }}
            onClick={() => navigateTo()}
          >
            Get started
          </Button>
          {!user && <LoginCard redirect={BASE_URL} />}
        </Stack>
        <Flex w={"full"}>
          <Box textAlign={"left"} boxShadow="md">
            <EditorForFrontPage />
            {/* <Illustration
              height={{ sm: '24rem', lg: '28rem' }}
              mt={{ base: 12, sm: 16 }}
            /> */}
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
