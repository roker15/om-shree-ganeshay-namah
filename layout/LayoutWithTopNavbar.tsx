import React from "react";
import TopNavbar from "./TopNavbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Simple> */}
      <TopNavbar >
        {children}
      </TopNavbar >
      {/* </Simple> */}
      {/* </Simple> */}
     
    </>
  );
};

export default Layout;
