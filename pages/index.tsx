import { Box, Container } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Landing from "../components/chakraTemplate/Landing";
import SelectSyllabus from "../components/chakraTemplate/SelectSyllabus";
import { UserTrack } from "../components/dashboard/UserTrack";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import { BookResponse } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import { definitions } from "../types/supabase";

const Home: React.FunctionComponent = () => {
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
  const { profile } = useAuthContext();
  const { user, error } = useUser();
  const supabaseTest = async () => {
    const { data, error } = await supabaseClient
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .select(
        `
         id,books_subheadings_fk,shared_by(email),shared_with(email),profiles!books_article_sharing_shared_by_fkey!inner(id,email),
         books_subheadings!inner(id,subheading)
         `
      )
      .match({ "profiles.email": "buddyelusive@gmail.com", "books_subheadings.id": 24 });
    if (error) {
      console.error("supabasetest error is " + error.message.toUpperCase);
    }
    if (data) {
      // console.log("supabasetest data is " + data[0].shared_by.email);
    }
  };

  useEffect(() => {
    // supabaseTest();
  }, []);

  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },
    });
  };

  useEffect(() => {
    if (book) {
      sessionStorage.setItem("book", JSON.stringify(book));
      sessionStorage.setItem("selected-subheading", "undefined");
      sessionStorage.setItem("selected-syllabus", "undefined");
      navigateTo(book.id.toString());
    }
  }, [book]);

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };

  return (
    <Box minW="full">
      {/* <FrequentHelp/> */}
      {/* <GotoQuestion /> */}
      <Landing />
      <Container maxW={"6xl"} mb={{ base: "64", lg: "80" }} borderColor="gray.50">
        {/* <SelectSyllabus /> */}
        {user && profile?.role === "ADMIN" && (
          <Box m="8" w="full">
            <Link href="/manageSyllabus">
              <a>Manage syllabus</a>
            </Link>
            <Link href="/dna">
              <a>Current Affair 22-23</a>
            </Link>
           
            <UserTrack />
          </Box>
        )}{" "}
      </Container>
      {/* <CtaWithAnnotation /> */}
      {/* <EditorFeatures />
      <CtaWithVideo />
      <QuestionDemo /> */}
      {/* <SplitScreenWithImage /> */}
      {/* <TwoColumn /> */}
    </Box>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
