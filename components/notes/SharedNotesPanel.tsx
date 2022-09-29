import { Avatar, Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
// import { groupBy } from "lodash";
import React, { useState } from "react";
import {
  SharedNotesList,
  useGetPublicNotesListBySubheading,
  useGetSharedNotesListBySubheading,
} from "../../customHookes/networkHooks";
import { Database } from "../../lib/database";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";

interface Props {
  subheadingid: number | undefined;
  changeParentProps: (x: Database["public"]["Tables"]["books_article_sharing"]["Row"]) => void;
}

const SharedNotesPanel: React.FC<Props> = ({ subheadingid, changeParentProps }) => {
  const { profile } = useAuthContext();
  const { data: sharedNtoes } = useGetSharedNotesListBySubheading(subheadingid, profile?.id);
  const { data: publicNotes } = useGetPublicNotesListBySubheading(subheadingid);
  const [selectedSubheading, setSelectedSubheading] = useState(1000);
  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };

  return (
    <Box>
      <VStack align="left">
        <Text align="start" bg="brand.100" fontWeight="normal" p="2" borderTopRadius={"md"}>
          Shared Notes
        </Text>
        {sharedNtoes && sharedNtoes.length > 0 ? (
          sharedNtoes!.map((x) => (
            <Flex my="2" ml="4" key={x.id} role={"group"} align="center">
              <Avatar mx="2" size="2xs" src={x.ownedby_avatar!} />
              <Text
                as="label"
                color={selectedSubheading === x.books_subheadings_fk ? "white" : "null"}
                bg={selectedSubheading === x.books_subheadings_fk ? "green.400" : "null"}
                align="start"
                px="0.5"
                casing="capitalize"
              >
                <Link onClick={() => changeParentProps(x)}>{x.ownedby_name}</Link>
              </Text>
              {/* </Button> */}
            </Flex>
          ))
        ) : (
          <Text px="2" as="label" casing="capitalize">
            No shared notes with you on this topic
          </Text>
        )}
        <Text align="start" fontWeight="normal"  bg="brand.100" p="2">
          Public Notes
        </Text>
        {publicNotes && publicNotes.length > 0 ? (
          publicNotes!.map((x) => (
            <Flex my="2" key={x.id} role={"group"} align="center">
              {/* <Button variant="unstyled"> */}
              <Avatar mx="2" size="2xs" src={x.ownedby_avatar!} />
              <Text
                as="label"
                casing="capitalize"
                color={selectedSubheading === x.books_subheadings_fk ? "white" : "null"}
                bg={selectedSubheading === x.books_subheadings_fk ? "green.400" : "null"}
                // onClick={() => changeParentProps(x)}
                align="start"
                px="0.5"
              >
                <Link onClick={() => changeParentProps(x)}>{x.ownedby_name}</Link>
              </Text>
              {/* </Button> */}
            </Flex>
          ))
        ) : (
          <Text as="label" px="2" casing="capitalize">
            No Public notes on this topic
          </Text>
        )}

        <VStack></VStack>
      </VStack>
    </Box>
  );
};
export default SharedNotesPanel;
