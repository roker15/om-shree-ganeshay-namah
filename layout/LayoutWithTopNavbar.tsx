import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import TopNavbar from "./TopNavbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Simple> */}
      <Flex bg="blue.500" width="full">
        <TopNavbar>{children}</TopNavbar>
      </Flex>
      {/* </Simple> */}
      {/* </Simple> */}
    </>
  );
};

export default Layout;
