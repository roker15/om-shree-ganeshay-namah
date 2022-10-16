import { Box, Container } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React, { useEffect } from "react";
import useSWR from "swr";
import Landing from "../components/chakraTemplate/Landing";
import ChakraThemeTest from "../components/ChakraThemeTest";
import { UserTrack } from "../components/dashboard/UserTrack";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";

const Home: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    const response = await fetch("api/posts");
    return response;
  };
  const { data, error } = useSWR("/api/posts", fetcher);
  // if (error) return <div>An error occured.</div>;
  // if (!data) return <div>Loading ...</div>;

  // const supabaseTest = async () => {
  //   const { data, error } = await supabaseClient
  //     .from("books_subheadings")
  //     .select(
  //       `
  //       *
  //        `
  //     )
  //     .eq("books_headings_fk",280).limit(1);
  //   if (error) {
  //     console.error("supabasetest error is " + error.message);
  //   }
  //   if (data) {
  //     console.log("supabasetest data is " + JSON.stringify(data));
  //   }
  // };

  const supabaseTest = async () => {
    const { data, error } = await supabaseClient
      .from("books_article_sharing")
      .select(
        `
         id,books_subheadings_fk,shared_by(email),shared_with(email),profiles!books_article_sharing_shared_by_fkey!inner(id,email),
         books_subheadings!inner(id,subheading)
         `
      )
      .eq("owned_bys", 45)
      .match({ "profiles.email": "buddyelusive@gmail.com", "books_subheadings.id": 24 });
    if (error) {
      console.error("supabasetest error is " + error.message);
    }
    if (data) {
      console.log("supabasetest data is " + JSON.stringify(data));
    }
  };

  useEffect(() => {
    // supabaseTest();
    console.log(data) }, []);

  return (
    <Box minW="full">
      <Landing />
      <ChakraThemeTest />

      <Container maxW={"6xl"} mb={{ base: "64", lg: "80" }}>
        {user && profile?.role === "ADMIN" && (
          <Box m="8" w="full">
            <Link href="/manageSyllabus">
              <a>Manage syllabus</a>
            </Link>

            <UserTrack />
          </Box>
        )}{" "}
      </Container>
    </Box>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
