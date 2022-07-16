import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import CtaWithAnnotation from "../components/chakraTemplate/CtaWithAnnotation";
import CtaWithVideo from "../components/chakraTemplate/CtaWithVideo";
import EditorFeatures from "../components/chakraTemplate/EditorFeatures";
import SplitScreenWithImage from "../components/chakraTemplate/SplitScreenWithImage";
import TwoColumn from "../components/chakraTemplate/TwoColumn";
import { ChakraThemeTest } from "../components/ChakraThemeTest";
import ImageSlider from "../components/ImageSlider";
import LandingPageTable from "../components/LandingPageTable";
import BookFilter from "../components/syllabus/BookFilter";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { BookResponse, Papers } from "../types/myTypes";
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
      navigateTo(book.id.toString());
    }
  }, [book]);

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };

  return (
    <Container minW="full"  px={{ base: "2", sm: "4", md: "2", lg: "8" }}>
      <GotoQuestion />
      <CtaWithAnnotation />
      <EditorFeatures/>
      <CtaWithVideo />
      <SplitScreenWithImage />
      <TwoColumn />
      {/* <CreateBookSyllabus /> */}
      <Flex flexDirection="column" alignItems={"center"} flexWrap="nowrap">
        <BookFilter setParentProps={updateBookProps}></BookFilter>
        <br />

        <Box bg="#4078c0" display={{ base: "none", sm: "undefined" }}>
          <LandingPageTable />
        </Box>
        <Box display={{ base: "none", sm: "undefined" }}>
          <ImageSlider />
        </Box>
        <Box>{/* <ChakraThemeTest/> */}</Box>
      </Flex>
    </Container>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;

function GotoQuestion() {
  return (
    <Flex justifyContent="end">
      <Text as="b">
        Go to{" "}
        <Link href="/questionBanks">
          <a>Question Bank</a>
        </Link>
      </Text>
    </Flex>
  );
}
