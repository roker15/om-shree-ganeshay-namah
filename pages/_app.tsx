import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { AuthProvider } from "../state/Authcontext";
import "../styles/globals.css";
import { theme } from "../theme/theme";
import PageWithLayoutType from "../types/pageWithLayout";
// import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Database } from "../lib/database";
import { NotesContextNewWrapper } from "../state/NotesContextNew";
import { SyllabusContextProviderWrapper } from "../state/SyllabusContext";
import { Analytics } from '@vercel/analytics/react';
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
        <title>Jionote</title> <link rel="icon" type="image/png" sizes="32x32" href="/logo-blue.png" />
      </Head>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <AuthProvider>
          <SyllabusContextProviderWrapper>
            <NotesContextNewWrapper>
              <ChakraProvider theme={theme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ChakraProvider>
            </NotesContextNewWrapper>
          </SyllabusContextProviderWrapper>
        </AuthProvider>
      </SessionContextProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
