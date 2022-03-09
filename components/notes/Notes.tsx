import { Box } from "@chakra-ui/react";
import React from "react";
import { useGetSharedNotesListBySubheading } from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import MyNotes from "./MyNotes";

interface Props {
  subheadingid: number | undefined;
  notesCreator: string | undefined;
  changeParentProps: () => void;
}

const Notes: React.FC<Props> = ({ subheadingid, notesCreator, changeParentProps }) => {
  const { profile } = useAuthContext();
  const { data: d } = useGetSharedNotesListBySubheading(subheadingid, profile?.id);
  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };

  return (
    <Box mx="-1">
      <Box>
        <MyNotes
          subheadingid={subheadingid}
          changeParentProps={(): void => {
            console.log("");
          }}
          notesCreator={notesCreator}
         
        ></MyNotes>
      </Box>
    </Box>
  );
};
export default Notes;
