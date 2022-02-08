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
      <Text color="brand.700">
        <Text as="b">8000+</Text> UPSC Students Using Jionote For making{" "}
        <Text bg="blue.50" p="0.5" as="span" fontWeight="medium">
          online {childData?.book_name}
        </Text>{" "}
        Notes 📝{" "}
      </Text>
      {supabase.auth.session() ? (
        <ManageNotes />
      ) : (
        <Box>
          <Circle p="4" size='200px' border='1px' color='green.100' >
            <Image
              
              // priority={true}
              loading="eager"
              // borderRadius="full"
              // boxSize="300px"
              // borderRadius={"full"}
              src="/logo-150x150.png"
              alt="Picture of the author"
              // w={{ base: "35px", md: "180px" }}
              // w={{ base: "35px", md: "100px" }}
            ></Image>
          </Circle>
        </Box>
      )}

      {/* <CreateBookSyllabus /> */}
    </Container>
  );
};

(Home as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Home;
