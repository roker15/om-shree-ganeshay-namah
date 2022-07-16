import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";
import TopNavbar from "./TopNavbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopNavbar>{children}</TopNavbar>
    </>
  );
};

export default Layout;
