import "../styles/globals.css";
import PageWithLayoutType from "../types/pageWithLayout";
import React, { createContext, useContext } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppContextWrapper } from "../context/state";
import { AuthProvider } from "../context/Authcontext";
import Head from "next/head";
import Script from 'next/script'
//this import is for react page editor
// import '@react-page/editor/lib/index.css';

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
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <AuthProvider>
      <Head>
        <title>Qlook ...</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logo-150x150.png"
        />
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" /> */}
  
      </Head>

      <AppContextWrapper>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </ChakraProvider>
      </AppContextWrapper>
    </AuthProvider>
  );
}

export default MyApp;
