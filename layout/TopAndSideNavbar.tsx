import React from "react";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
};
const TopAndSideNavbar: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return <Box >TopAndSideNavbar</Box>;
};

TopAndSideNavbar.propTypes = {};

export default TopAndSideNavbar;
