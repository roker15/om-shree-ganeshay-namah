import { navigateTo } from "../lib/utils";
import {
  Box,
  Button,
  Center,
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
      <Grid templateColumns="repeat(5, 1fr)" bg="gray.900" >
        <GridItem colSpan={1} h="48px"></GridItem>
        <GridItem colSpan={3} h="48px">
          <Center h="48px">
            <Text fontSize="larger" color="white">
              Jionote is a Digital Notes making platform. Select syllbaus from below and make Notes
            </Text>
          </Center>
        </GridItem>
        <GridItem colSpan={1}>
          <Center pr="2" h="48px" bg="gray.900" gap="2" justifyContent={"end"}>
            <Button size="md" colorScheme={"yellow"} bg="#FAF089" onClick={() => navigateTo("/manageSyllabusv2")}>
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
        </GridItem>
      </Grid>{" "}
      <TopNavbarForNotes>{children}</TopNavbarForNotes>
      {/* <DesktopMenu /> */}
    </Box>
  );
};

export default Layout;


