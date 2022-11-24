import { Box, Flex, Grid, GridItem, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { MdAdd, MdLightMode } from "react-icons/md";
import { useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbarForNotes from "../layout/LayoutWithTopNavbarForNotes";
import { markitWebColor } from "../lib/constants";
import { useAuthContext } from "../state/Authcontext";
import { useNotesContextNew } from "../state/NotesContextNew";
import { useSyllabusContext } from "../state/SyllabusContext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
// import { GotoQuestion } from "..";

const Notes: React.FC = () => {
  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        <GridItem w="100%" colSpan={2} minH="100vh" bg="brand.50">
          <Syllabus />
        </GridItem>
        <GridItem w="100%" colSpan={5}></GridItem>
      </Grid>
    </Box>
  );
};

(Notes as PageWithLayoutType).layout = LayoutWithTopNavbarForNotes;
export default Notes;

const Syllabus: React.FunctionComponent = () => {
  const { book } = useNotesContextNew();
  const { profile } = useAuthContext();
  const user = useUser();
  const { data, swrError } = useGetSyllabusByBookId(book?.bookId);

  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text casing="capitalize" fontSize="lg" fontWeight="medium" color={markitWebColor}>
              {book?.bookName}
            </Text>
          </HStack>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
              <Headings key={headings.id} headings={headings} />
            ))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};

const Headings = (props: { headings: Data_headings }) => {
  const [hide, setHide] = useState(true);
  return (
    <VStack key={Number(props.headings!.id!)} alignItems="left">
      <HStack
        alignItems={"baseline"}
        onClick={() => {
          setHide(!hide);
        }}
      >
        <IconButton variant="ghost" size="md" aria-label="Call Sage" icon={hide ? <MdAdd /> : <MdLightMode />} />
        <Text casing={"capitalize"} cursor="pointer" as="address" color=" #FF1493">
          {props.headings.heading}
        </Text>
      </HStack>
      <VStack alignItems={"left"} pl="16" spacing="4" display={hide ? "none" : undefined}>
        {props.headings.books_subheadings.map((subheading) => (
          <Subheading key={subheading.id} subheading={subheading} />
        ))}
      </VStack>
    </VStack>
  );
};
const Subheading = (props: { subheading: Data_subheadings }) => {
  const { setSelectedSubheading } = useNotesContextNew();
  const changeContextSubheading = () => {
    setSelectedSubheading({ id: props.subheading.id, name: props.subheading.subheading! });
  };
  return (
    <Text fontSize={"sm"} casing={"capitalize"} cursor="pointer" onClick={changeContextSubheading}>
      {props.subheading.subheading}
    </Text>
  );
};
