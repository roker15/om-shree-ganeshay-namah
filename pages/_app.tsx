import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { AuthProvider } from "../state/Authcontext";
import "../styles/globals.css";
import PageWithLayoutType from "../types/pageWithLayout";
import { theme } from "../theme/theme";
import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NoteContextWrapper } from "../state/NoteContext";

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
      </Head>
      <UserProvider supabaseClient={supabaseClient}>
        <AuthProvider>
          <NoteContextWrapper>
            <ChakraProvider theme={theme} >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </NoteContextWrapper>
        </AuthProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
