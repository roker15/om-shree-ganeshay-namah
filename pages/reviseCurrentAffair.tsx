import { Box, Center } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import ManageCurrentAffair from "../components/CurrentAffair/ManageCurrentAffair";
import { LoginCard } from "../components/LoginCard";
import BookFilter from "../components/syllabus/BookFilter";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { BASE_URL } from "../lib/constants";
import { BookResponse } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

const ReviseCurrentAffair: React.FunctionComponent = () => {
  const { user, error } = useUser();
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
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
    <Box px={{ base: "0.5", sm: "0.5", md: "0.5", lg: "36" }} pb="8">
      {user ? (
        <>
          <BookFilter setParentProps={updateBookProps}></BookFilter>
          <ManageCurrentAffair></ManageCurrentAffair>
        </>
      ) : (
        <Center h="70vh">
          <LoginCard redirect={`${BASE_URL}/reviseCurrentAffair`} />
        </Center>
      )}
    </Box>
  );
};

(ReviseCurrentAffair as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ReviseCurrentAffair;

