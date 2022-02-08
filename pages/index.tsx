import { Box, Container, Text, useColorMode, Image, Circle } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import ManageNotes from "../components/notes/ManageNotes";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { myInfoLog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
import { useAuthContext } from "../state/Authcontext";
import { useAppContext } from "../state/state";
import { BookResponse, Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

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

  return (
    <Container maxW="full" px="8">
      <ManageNotes />
    </Container>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
