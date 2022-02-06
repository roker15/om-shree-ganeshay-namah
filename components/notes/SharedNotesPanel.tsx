import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { groupBy } from "lodash";
import React, { useState } from "react";
import {
  SharedNotesList,
  useGetPublicNotesListBySubheading,
  useGetSharedNotesListBySubheading,
} from "../../customHookes/networkHooks";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";

interface Props {
  subheadingid: number | undefined;
  changeParentProps: (x: SharedNotesList) => void;
}

const SharedNotesPanel: React.FC<Props> = ({ subheadingid, changeParentProps }) => {
  const { profile } = useAuthContext();
  const { data: d } = useGetSharedNotesListBySubheading(subheadingid, profile?.id);
  const { data: d2 } = useGetPublicNotesListBySubheading(subheadingid);
  const [selectedSubheading, setSelectedSubheading] = useState(1000);
  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };

  return (
    <Box>
      <VStack align="left">
        <Text align="start">My note</Text>
        <Text
          // color={selectedSubheading === x.subheading_id ? "white" : "null"}
          // bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
          // onClick={() => changeParentProps(x)}
          align="start"
          casing="capitalize"
        >
          <Link>My notes</Link>
        </Text>
        <Text align="start">Public Notes</Text>
        {d2
          ? d2!.map((x) => (
              <Flex my="2" ml="4" key={x.subheading_id} role={"group"}>
                {/* <Button variant="unstyled"> */}
                <Text
                  color={selectedSubheading === x.subheading_id ? "white" : "null"}
                  bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
                  onClick={() => changeParentProps(x)}
                  align="start"
                  casing="capitalize"
                >
                  <Link>{x.shared_by}</Link>
                </Text>
                {/* </Button> */}
              </Flex>
            ))
          : null}
        <VStack></VStack>
        <Text align="start">Shared Notes</Text>
        {d
          ? d!.map((x) => (
              <Flex my="2" ml="4" key={x.subheading_id} role={"group"}>
                {/* <Button variant="unstyled"> */}
                <Text
                  color={selectedSubheading === x.subheading_id ? "white" : "null"}
                  bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
                  onClick={() => changeParentProps(x)}
                  align="start"
                  casing="capitalize"
                >
                  <Link>{x.shared_by}</Link>
                </Text>
                {/* </Button> */}
              </Flex>
            ))
          : null}
        <VStack></VStack>
      </VStack>
    </Box>
  );
};
export default SharedNotesPanel;
