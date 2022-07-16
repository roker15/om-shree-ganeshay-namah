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
      <Box   bg="orange">
        <TopNavbar>{children}</TopNavbar>
      </Box>
      {/* </Simple> */}
      {/* </Simple> */}
    </>
  );
};

export default Layout;
