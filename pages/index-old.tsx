import { Box, Container } from "@chakra-ui/react";
import { books } from "@prisma/client";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import useSWR, { Fetcher } from "swr";
import Landing from "../components/chakraTemplate/Landing";
import ChakraThemeTest from "../components/ChakraThemeTest";
import { UserTrack } from "../componentv2/UserTrack";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data } from "./api/prisma/syllabus/syllabus";

const Home: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const supabaseClient = useSupabaseClient<Database>();

  const fetcher = async () => {
    // if (window.confirm("Do you want to delete this food?")) {
    const response = await axios.get<Data>("/api/prisma/posts/posts").catch((e) => {
      throw e;
      // console.log("error is ",e)
    });
    return response.data;
    // }
  };
  // const { data, error } = useSWR("/api/prisma/posts/posts", fetcher);

  // useEffect(() => {
  //   // alert(data?.data?.book_name);
  // }, [data]);
  // if (error) return <div>An error occured.{error.message}</div>;
  // if (!data) return <div>Loading ...</div>;

  return (
    <Box minW="full">
      {/* {data ? data.book_name : "no data"} */}
      <Landing />
      {/* <ChakraThemeTest /> */}

      <Container maxW={"6xl"} mb={{ base: "64", lg: "80" }}>
        <Link href="/notes">
          <a>Notes</a>
        </Link>
        {user && profile?.role === "ADMIN" && (
          <Box m="8" w="full">
            <Link href="/manageSyllabusv2">
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
