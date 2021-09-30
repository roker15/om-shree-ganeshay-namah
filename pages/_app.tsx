import "../styles/globals.css";
import PageWithLayoutType from "../types/pageWithLayout";
import React, { createContext, useContext } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppContextWrapper } from "../context/state";
import { AuthProvider } from "../context/Authcontext";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const theme = extendTheme({ colors });
type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function MyApp({ Component, pageProps }: AppLayoutProps) {
  const Layout = Component.layout || ((children) => <>{children}</>);
  return (
    <AuthProvider>
      
      <AppContextWrapper>
        <ChakraProvider theme={theme}>
          {/* <AuthProvider> */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* </AuthProvider> */}
        </ChakraProvider>
      </AppContextWrapper>
    </AuthProvider>
  );
}

export default MyApp;
