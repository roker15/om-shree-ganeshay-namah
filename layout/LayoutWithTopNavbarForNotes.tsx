import { navigateTo } from "../lib/utils";
import {
  Avatar,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import TopNavbarForNotes from "./TopNavbarForNotes";
import { useAuthContext } from "../state/Authcontext";
import { FiChevronDown } from "react-icons/fi";
import { BASE_URL } from "../lib/constants";

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

const AvatarMenu = () => {
  const { profile, signOut } = useAuthContext();

  return (
    <Menu boundary="clippingParents">
      <MenuButton border="0px" py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
        <HStack>
          {!profile?.avatar_url ? (
            <Avatar size={"sm"} src="https://bit.ly/broken-link" />
          ) : (
            <Avatar
              size={"sm"}
              src={
                profile?.avatar_url! // change this to url from database avatar
              }
            />
          )}

          <Box display={{ base: "none", md: "flex" }}>
            <FiChevronDown />
          </Box>
        </HStack>
      </MenuButton>
      {profile && (
        <MenuList bg={"gray.50"}>
          <Text pl="4">{profile?.username}</Text>
          <Text as="label" pl="4">
            {profile?.email}
          </Text>

          <div>
            {" "}
            <MenuDivider />
            <MenuItem pl="4" border="0px" onClick={() => signOut("vv")}>
              Sign out
            </MenuItem>
          </div>
        </MenuList>
      )}
    </Menu>
  );
};
