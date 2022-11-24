import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";
import DesktopMenu from "../components/chakraTemplate/Customdrawer";
import TopNavbar from "./TopNavbar";
import TopNavbarForNotes from "./TopNavbarForNotes";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <TopNavbarForNotes>{children}</TopNavbarForNotes>
      {/* <DesktopMenu /> */}
    </Box>
  );
};

export default Layout;
