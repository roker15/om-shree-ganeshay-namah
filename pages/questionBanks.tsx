import { Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect } from "react";
import QuestionBank from "../components/QuestionBank";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { NoteContextWrapper } from "../state/NoteContext";
import { Papers } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

type ProfileListPropss = {
  data?: Papers[];
};

const QuestionBank1: React.FC<ProfileListPropss> = ({}) => {
  //   const router = useRouter();
  //   const navigateTo = (pathname: string) => {
  //     router.push({
  //       pathname: pathname,
  //       // query: { postId: postId,subHeadingId:subHeadingId,isNew:isNew },
  //     });
  //   };

  return (
    <Container maxW="6xl" px={{ base: "2", sm: "4", md: "16" }}>
      <NoteContextWrapper>
        <Flex justifyContent="space-between">
          <Text >
            <Link href="/" color="orange">
              <a>Home</a>
            </Link>
          </Text>
          <Text color="red">
            Did you find your Question?{" "}
            <Link href="/createQuestionBank">
              <a>Submit new Question</a>
            </Link>
          </Text>
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
