import { Box, Button, Container,Text } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React from "react";
import DesktopMenu from "../components/chakraTemplate/Customdrawer";
import Landing from "../components/chakraTemplate/Landing";
import { UserTrack } from "../components/dashboard/UserTrack";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";

const Home: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();

  // const supabaseTest = async () => {
  //   const { data, error } = await supabaseClient
  //     .from<definitions["books_article_sharing"]>("books_article_sharing")
  //     .select(
  //       `
  //        id,books_subheadings_fk,shared_by(email),shared_with(email),profiles!books_article_sharing_shared_by_fkey!inner(id,email),
  //        books_subheadings!inner(id,subheading)
  //        `
  //     )
  //     .match({ "profiles.email": "buddyelusive@gmail.com", "books_subheadings.id": 24 });
  //   if (error) {
  //     console.error("supabasetest error is " + error.message.toUpperCase);
  //   }
  //   if (data) {
  //     // console.log("supabasetest data is " + data[0].shared_by.email);
  //   }
  // };

  // useEffect(() => {
  //   supabaseTest();
  // }, []);

  return (
    <Box minW="full">
      <Landing />
      <Text color="error">hi5555555555555555555</Text>
      <Button>Hello</Button>
      <Container maxW={"6xl"} mb={{ base: "64", lg: "80" }} borderColor="gray.50">
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
