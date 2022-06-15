import React from "react";
import PropTypes from "prop-types";

type LayoutProps = {
  children: React.ReactNode;
};
const TopAndSideNavbar: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return <div>TopAndSideNavbar</div>;
};

TopAndSideNavbar.propTypes = {};

export default TopAndSideNavbar;
