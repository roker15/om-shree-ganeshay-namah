import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { AuthProvider } from "../state/Authcontext";
import "../styles/globals.css";
import PageWithLayoutType from "../types/pageWithLayout";
import { theme } from "../theme/theme";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NoteContextWrapper } from "../state/NoteContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Database } from "../lib/database";
type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function MyApp({ Component, pageProps }: AppLayoutProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());
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
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <AuthProvider>
          <NoteContextWrapper>
            <ChakraProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ChakraProvider>
          </NoteContextWrapper>
        </AuthProvider>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
