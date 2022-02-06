import { Box, Flex, Text } from "@chakra-ui/react";
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
      hello
      <BookFilter setParentProps={updateBookProps}></BookFilter>
      <Flex my="16" justifyContent="space-between">
        <Box w="96">
          <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
        </Box>
        <Box>
          <Text fontSize="md" as="b"casing="capitalize">
            {!selectedSubheading ? "Select Topic From Syllabus" :  selectedSubheading?.subheading}
          </Text>
          <Notes subheadingid={selectedSubheading?.subheading_id} changeParentProps={() => console.log("madarchod")}></Notes>
        </Box>
        <Box>
          <SharedNotesPanel
            subheadingid={selectedSubheading?.subheading_id}
            changeParentProps={changeSelectedSharedNote}
          ></SharedNotesPanel>
        </Box>
      </Flex>
    </div>
  );
};

export default ManageNotes;
