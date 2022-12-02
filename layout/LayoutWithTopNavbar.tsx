import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";
import DesktopMenu from "../components/chakraTemplate/Customdrawer";
import TopNavbar from "./TopNavbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <Box >
      <TopNavbar>{children}</TopNavbar>
      {/* <DesktopMenu /> */}
    </Box>
  );
};

export default Layout;
