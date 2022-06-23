import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React, { useEffect } from "react";
import QuestionBank from "../components/QuestionBank";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { BASE_URL } from "../lib/constants";
import { NoteContextWrapper } from "../state/NoteContext";
import { Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

type ProfileListPropss = {
  data?: Papers[];
};

const QuestionBank1: React.FC<ProfileListPropss> = ({}) => {
  const { user, error } = useUser();

  const signUpUser = async (email: string, role: string) => {
    let { user, error } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      {
        redirectTo: `${BASE_URL}/questionBanks`,
        // redirectTo: "http://www.localhost:3000/questionBanks",
        // redirectTo: "https://www.jionote.com/questionBanks",
      }
    );
  };
  if (!user) {
    console.log("session null hai bhai");
    // setEmail("")
    return (
      <div>
        Please login to view content
        <Button
          _active={{
            border: "none",
            bg: "#dddfe2",
            transform: "scale(0.98)",
            borderColor: "#bec3c9",
          }}
          variant=" outline"
          color="violet"
          onClick={() => signUpUser("hello", "hello")}
        >
          Log In
        </Button>
      </div>
    );
  }
  return (
    <Container maxW="6xl" px={{ base: "2", sm: "4", md: "16" }}>
      <NoteContextWrapper>
        <Flex mt="2" justifyContent="space-between" direction={{ base: "column", md: "row" }}>
          <Link href="/">
            <a className="internal" style={{ color: "#5cb2eb" }}>
              {" "}
              Home
            </a>
          </Link>

          <Link href="/createQuestionBank">
            <a className="internal" style={{ color: "#5cb2eb" }}>
              Create New Question
            </a>
          </Link>
        </Flex>
        <QuestionBank />
      </NoteContextWrapper>
      {/* <AnimatedText/> */}
      {/* <CreateBookSyllabus /> */}
    </Container>
  );
};

(QuestionBank1 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default QuestionBank1;
