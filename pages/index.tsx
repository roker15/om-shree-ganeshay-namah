import { Container, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import ManageNotes from "../components/notes/ManageNotes";
import CreateBookSyllabus from "../components/syllabus/CreateBookSyllabus";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { myInfoLog } from "../lib/mylog";
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
      <Text color="brand.700">
        <Text as="b">8000+</Text> UPSC Students Using Jionote For making{" "}
        <Text bg="blue.50" p="0.5" as="span" fontWeight="medium">
          online {childData?.book_name}
        </Text>{" "}
        Notes 📝{" "}
      </Text>

      <ManageNotes />
      {/* <CreateBookSyllabus /> */}
    </Container>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
