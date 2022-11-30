import { Box, Button, Center, Spacer, Text } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import TopNavbarForNotes from "./TopNavbarForNotes";

type LayoutProps = {
  children: React.ReactNode;
};
const navigateTo = (path: string) => {
  router.push({
    pathname: path,
  });
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Center bg="gray.900" w="full" h="48px">
        <Spacer />
        <Spacer />
        <Text fontSize="larger" color="white">
          Jionote is a Digital Notes making platform. Select Syllbaus from below and Make notes
        </Text>
        <Spacer />
        <Button size="md" colorScheme={"yellow"} mr="20" bg="#FAF089" onClick={()=>navigateTo("/manageSyllabusv2")}>
          Create Syllabus
        </Button>
      </Center>{" "}
      <TopNavbarForNotes>{children}</TopNavbarForNotes>
      {/* <DesktopMenu /> */}
    </Box>
  );
};

export default Layout;
