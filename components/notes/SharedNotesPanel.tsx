import { Avatar, Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
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
  const { data: sharedNtoes } = useGetSharedNotesListBySubheading(subheadingid, profile?.id);
  console.log("subheading is ", subheadingid);
  const { data: publicNotes } = useGetPublicNotesListBySubheading(subheadingid);
  const [selectedSubheading, setSelectedSubheading] = useState(1000);
  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };

  return (
    <Box>
      <VStack align="left">
        <Text align="start" fontWeight="medium" fontSize="15px" p="0.5" bg="gray.100">
          My notes
        </Text>
        <Text
          // color={selectedSubheading === x.subheading_id ? "white" : "null"}
          // bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
          // onClick={() => changeParentProps(x)}
          align="start"
          casing="capitalize"
        >
          {/* {d?} */}
        </Text>
        <Text align="start" fontWeight="medium" fontSize="15px" p="0.5" bg="gray.100">
          Public Notes
        </Text>
        {publicNotes && publicNotes.length > 0 ? (
          publicNotes!.map((x) => (
            <Flex my="2" ml="2" key={x.id} role={"group"} align="center">
              {/* <Button variant="unstyled"> */}
              <Avatar mx="2" size="2xs" src="https://bit.ly/broken-link" />
              <Text
                as="label"
                casing="capitalize"
                color={selectedSubheading === x.subheading_id ? "white" : "null"}
                bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
                // onClick={() => changeParentProps(x)}
                align="start"
                px="0.5"
              >
                <Link onClick={() => changeParentProps(x)}>{x.owned_by}</Link>
              </Text>
              {/* </Button> */}
            </Flex>
          ))
        ) : (
          <Text px="2" as="label" casing="capitalize">
            No Public notes on this topic
          </Text>
        )}
        <VStack></VStack>
        <Text align="start" p="0.5" bg="gray.100" fontWeight="medium" fontSize="15px">
          Shared Notes
        </Text>
        {sharedNtoes && sharedNtoes.length > 0 ? (
          sharedNtoes!.map((x) => (
            <Flex my="2" ml="4" key={x.subheading_id} role={"group"}>
              {/* <Button variant="unstyled"> */}
              <Text
                color={selectedSubheading === x.subheading_id ? "white" : "null"}
                bg={selectedSubheading === x.subheading_id ? "green.400" : "null"}
                onClick={() => changeParentProps(x)}
                align="start"
                px="2"
                casing="capitalize"
              >
                <Link>{x.shared_by}</Link>
              </Text>
              {/* </Button> */}
            </Flex>
          ))
        ) : (
          <Text px="2" as="label" casing="capitalize">
            No shared notes with you on this topic
          </Text>
        )}
        <VStack></VStack>
      </VStack>
    </Box>
  );
};
export default SharedNotesPanel;
