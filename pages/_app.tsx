import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
//this import is for react page editor
// import '@react-page/editor/lib/index.css';
import ReactGA from "react-ga";
import { AuthProvider } from "../state/Authcontext";
import { PostContextWrapper } from "../state/PostContext";
import { AppContextWrapper } from "../state/state";
import "../styles/globals.css";
// import "../styles/suneditor.module.css";
import PageWithLayoutType from "../types/pageWithLayout";
import ReactGA4 from "react-ga4";
// Component style overrides
import { theme } from "../theme/theme";
import { supabase } from "../lib/supabaseClient";
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function MyApp({ Component, pageProps }: AppLayoutProps) {
  
  useEffect(() => {
    ReactGA.initialize("UA-217198026-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  });
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <>
      <Head>
        <title>Jionote</title> <link rel="icon" type="image/png" sizes="32x32" href="/logo-150x150.png" />
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" /> */}
      </Head>
      <UserProvider supabaseClient={supabaseClient}>
      <AuthProvider>
        <AppContextWrapper>
          <ChakraProvider theme={theme}>
            {/* <AuthProvider> */}
              <PostContextWrapper>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </PostContextWrapper>
            {/* </AuthProvider> */}
          </ChakraProvider>
        </AppContextWrapper>
        </AuthProvider>
        </UserProvider>
    </>
  );
}

export default MyApp;
