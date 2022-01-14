import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
//this import is for react page editor
// import '@react-page/editor/lib/index.css';
// import ReactGA from "react-ga";
import { AuthProvider } from "../state/Authcontext";
import { PostContextWrapper } from "../state/PostContext";
import { AppContextWrapper } from "../state/state";
import "../styles/globals.css";
import PageWithLayoutType from "../types/pageWithLayout";
import ReactGA from "react-ga4";

ReactGA.initialize("your GA measurement id");
ReactGA.send("pageview");

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
  useEffect(() => {
    ReactGA.initialize("G-H6M6EKJRJ1");
    ReactGA.send("pageview");
  });
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <>
      <Head>
        <title>Qlook - Target Strategically</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-150x150.png" />

        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" /> */}
      </Head>
      <AuthProvider>
        <AppContextWrapper>
          <ChakraProvider theme={theme}>
            <AuthProvider>
              <PostContextWrapper>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </PostContextWrapper>
            </AuthProvider>
          </ChakraProvider>
        </AppContextWrapper>
      </AuthProvider>
    </>
  );
}

export default MyApp;
