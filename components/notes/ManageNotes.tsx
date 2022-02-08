import { Box, Center, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SharedNotesList } from "../../customHookes/networkHooks";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import BookFilter from "../syllabus/BookFilter";
import Notes from "./Notes";
import SharedNotesPanel from "./SharedNotesPanel";
import SyllabusForNotes from "./SyllabusForNotes";

const ManageNotes = () => {
  const [book, setBook] = useState<BookResponse | undefined>();
  const [selectedSubheading, setSelectedSubheading] = useState<BookSyllabus | undefined>();
  const [selectedSharedNote, setselectedSharedNote] = useState<SharedNotesList>();

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
    // setSelectedSubheading(undefined); this id done in useeffect already
  };
  const changeSelectedSubheading = (x: BookSyllabus) => {
    setSelectedSubheading(x);
  };
  const changeSelectedSharedNote = (x: SharedNotesList) => {
    setselectedSharedNote(x);
  };

  useEffect(() => {
    setSelectedSubheading(undefined);
  }, [book]);

  return (
    <div>
      <Box px="44" pb="8">
        <BookFilter setParentProps={updateBookProps}></BookFilter>
      </Box>
      {/* <Flex my="16" justifyContent="flex-start"> */}
      <Grid templateColumns="repeat(10, 1fr)">
        <GridItem colSpan={2} bg="gray.50" p="2">
          <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
        </GridItem>
        <GridItem colSpan={7} px="4">
          <Center>
            <Text fontSize="md" as="b" casing="capitalize">
              {!selectedSubheading ? "Select Topic From Syllabus" : selectedSubheading?.subheading}
            </Text>
          </Center>
          <Notes subheadingid={selectedSubheading?.subheading_id} changeParentProps={() => console.log("madarchod")}></Notes>
        </GridItem>
        <GridItem colSpan={1} bg="gray.50" p="2" >
          <SharedNotesPanel
            subheadingid={selectedSubheading?.subheading_id}
            changeParentProps={changeSelectedSharedNote}
          ></SharedNotesPanel>
        </GridItem>
      </Grid>
      {/* </Flex> */}
    </div>
  );
};

export default ManageNotes;
