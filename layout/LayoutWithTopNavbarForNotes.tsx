import { navigateTo } from "../lib/utils";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import TopNavbarForNotes from "./TopNavbarForNotes";
import { useAuthContext } from "../state/Authcontext";
import { BASE_URL } from "../lib/constants";
import { AvatarMenu } from "./AvatarMenu";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { profile,signInWithgoogle } = useAuthContext();
  return (
    <Box>
      <Flex bg="gray.900" >
          <Center h="48px" px="2">
            <Text fontSize={{base:"sm",xl:"larger"}} color="white">
              Jionote is a Digital Notes making platform
            </Text>
        </Center>
        <Spacer/>
          <Center pr="2" h="48px" bg="gray.900" gap="2" justifyContent={"end"}>
            <Button size={{base:"sm",lg:"md"}} colorScheme={"yellow"} bg="#FAF089" onClick={() => navigateTo("/manageSyllabus")}>
              Create Syllabus
            </Button>
            {!profile ? (
              <Text
                cursor={"pointer"}
                onClick={() => {
                  signInWithgoogle(BASE_URL);
                }}
                color="#ffffff"
              >
                Sign In
              </Text>
            ) : (
              <AvatarMenu />
            )}
          </Center>
      </Flex>
      <TopNavbarForNotes>{children}</TopNavbarForNotes>
      {/* <DesktopMenu /> */}
    </Box>
  );
};

export default Layout;


