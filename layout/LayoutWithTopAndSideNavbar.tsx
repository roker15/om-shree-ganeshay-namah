import React from "react";
import TopAndSideNavbar from "./TopAndSideNavbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Simple> */}
      <TopAndSideNavbar >
        {children}
      </TopAndSideNavbar >
      {/* </Simple> */}
      {/* </Simple> */}
     
    </>
  );
};

export default Layout;
