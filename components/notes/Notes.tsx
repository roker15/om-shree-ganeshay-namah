import { Box, Flex, IconButton, Link, Text, Textarea, Tooltip, VStack } from "@chakra-ui/react";
import { groupBy } from "lodash";
import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import {
  SharedNotesList,
  useGetPublicNotesListBySubheading,
  useGetSharedNotesListBySubheading,
} from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import MyNotes from "./MyNotes";

interface Props {
  subheadingid: number | undefined;
  changeParentProps: () => void;
}

const Notes: React.FC<Props> = ({ subheadingid, changeParentProps }) => {
  const { profile } = useAuthContext();
  const { data: d } = useGetSharedNotesListBySubheading(subheadingid, profile?.id);
  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };

  return (
    <Box mx="2">
      <Box>
        <MyNotes
          subheadingid={subheadingid}
          changeParentProps={(): void => {
            console.log("madarchod")
          }}
        ></MyNotes>
      </Box>
    </Box>
  );
};
export default Notes;
