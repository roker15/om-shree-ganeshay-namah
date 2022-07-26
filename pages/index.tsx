import { Box, Container, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import All from "../components/chakraTemplate/All";
import TwoColumn from "../components/chakraTemplate/All";
import CtaWithAnnotation from "../components/chakraTemplate/CtaWithAnnotation";
import CtaWithVideo from "../components/chakraTemplate/CurrentAffair";
import EditorFeatures from "../components/chakraTemplate/EditorFeatures";
import Landing from "../components/chakraTemplate/Landing";
import QuestionDemo from "../components/chakraTemplate/QuestionDemo";
import SelectSyllabus from "../components/chakraTemplate/SelectSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { BookResponse } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import { definitions } from "../types/supabase";

const Home: React.FunctionComponent = () => {
  const [book, setBook] = useState<BookResponse | undefined>(undefined);

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
      <Container
        maxW={"6xl"}
        mb="60"
        // shadow={"sm"}
        // p={{ base: "2", md: "6", lg: "10" }}
        // border={"1px"}
        borderColor="gray.50"
      >
        <SelectSyllabus />
      </Container>
      {/* <CtaWithAnnotation /> */}
      {/* <EditorFeatures />
      <CtaWithVideo />
      <QuestionDemo /> */}

      {/* <SplitScreenWithImage /> */}
      {/* <TwoColumn /> */}
      {/* <CreateBookSyllabus /> */}
    </Box>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
