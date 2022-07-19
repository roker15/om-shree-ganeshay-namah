import { Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GotoQuestion } from "..";
import ManageNotes from "../../components/notes/ManageNotes";
import LayoutWithTopNavbar from "../../layout/LayoutWithTopNavbar";
import { NoteContextWrapper } from "../../state/NoteContext";
import PageWithLayoutType from "../../types/pageWithLayout";

const Notes: React.FC = () => {
  const router = useRouter();
  const { bookid, item } = router.query;

  return (
    <Container maxW="full" px={{ base: "2", sm: "4", md: "2", lg: "8" }}>
      <GotoQuestion/>
      {/* <NoteContextWrapper> */}
        <ManageNotes />
      {/* </NoteContextWrapper> */}
      {/* <AnimatedText/> */}
      {/* <CreateBookSyllabus /> */}
    </Container>
  );
};

(Notes as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Notes;
