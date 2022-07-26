import { Center, Container, Flex } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React from "react";
import { LoginCard } from "../components/LoginCard";
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

  if (!user) {
    return (
      <Center py="28">
        <LoginCard redirect={`${BASE_URL}/questionBanks`} />
      </Center>
    );
  }
  return (
    <Container maxW="6xl" px={{ base: "2", sm: "4", md: "16" }}>
      <NoteContextWrapper>
        <Flex my="6" justifyContent="end" direction={{ base: "column", md: "row" }}>
          <Link href="/createQuestionBank">
            <a className="internal" style={{ color: "#ffffff", background: "rgb(115, 176, 205)", padding: "4px" }}>
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
