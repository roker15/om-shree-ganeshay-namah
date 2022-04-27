import { Box, Container, Text, useColorMode, Image, Circle } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import ManageNotes from "../components/notes/ManageNotes";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { ilog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";
import { BookResponse, Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import { definitions } from "../types/supabase";

type ProfileListProps = {
  data?: Papers[];
};

const Home: React.FC<ProfileListProps> = ({ data }) => {
  const router = useRouter();
  const appContext = useAppContext();
  const { toggleColorMode } = useColorMode();
  const [childData, setChildData] = useState<BookResponse | undefined>();

  const { profile } = useAuthContext();

  const navigateTo = (pathname: string) => {
    router.push({
      pathname: pathname,
      // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
    });
  };
  const supabaseTest = async () => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .select(
        `
         id,books_subheadings_fk,shared_by(email),shared_with(email),profiles!books_article_sharing_shared_by_fkey!inner(id,email),
         books_subheadings!inner(id,subheading)
  `
      )
      .match({ "profiles.email": "buddyelusive@gmail.com","books_subheadings.id":24});
    if (error) {
      console.error("supabasetest error is " + error.message.toUpperCase);
    }
    if (data) {
      // console.log("supabasetest data is " + data[0].shared_by.email);
    }
  };
  useEffect(() => {
    supabaseTest();
  },[]);
  return (
    <Container maxW="full" px={{ base: "2", sm: "4", md: "8" }}>
      {/* <ManageNotes /> */}
      <CreateBookSyllabus />
    </Container>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
