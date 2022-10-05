import { Box, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
// import { GotoQuestion } from "..";
import ManageNotes from "../../components/notes/ManageNotes";
import LayoutWithTopNavbar from "../../layout/LayoutWithTopNavbar";
import PageWithLayoutType from "../../types/pageWithLayout";

const Notes: React.FC = () => {
  const router = useRouter();
  const { bookid, item } = router.query;

  return (
    <Box maxW="full" px={{ base: "0.5", sm: "0.5", md: "2", lg: "8" }}>
      {/* <GotoQuestion/> */}
      {/* <NoteContextWrapper> */}
        <ManageNotes />
      {/* </NoteContextWrapper> */}
      {/* <AnimatedText/> */}
      {/* <CreateBookSyllabus /> */}
    </Box>
  );
};

(Notes as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default Notes;
