import React from "react";
import TopNavbarWithSearchBox from "./TopNavbarWithSearchBox";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Simple> */}
      <TopNavbarWithSearchBox >
        {children}
      </TopNavbarWithSearchBox >
      {/* </Simple> */}
      {/* </Simple> */}
     
    </>
  );
};

export default Layout;
