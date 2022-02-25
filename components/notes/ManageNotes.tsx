import { Box, Button, Center, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Switch, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { SharedNotesList } from "../../customHookes/networkHooks";
import { BASE_URL } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import BookFilter from "../syllabus/BookFilter";
import Notes from "./Notes";
import SharedNotesPanel from "./SharedNotesPanel";
import SyllabusForNotes from "./SyllabusForNotes";

const ManageNotes = () => {
  const [book, setBook] = useState<BookResponse | undefined>();
  const [selectedSubheading, setSelectedSubheading] = useState<
    { subheadingId: number | undefined; creatorId: string | undefined } | undefined
  >();
  const [selectedSyllabus, setSelectedSyllabus] = useState<BookSyllabus>();
  const [isPostPublic, setIsPostPublic] = useState<boolean | "loading" | undefined>(undefined);
  const { signInWithgoogle, signOut, profile } = useAuthContext();
  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
    // setSelectedSubheading(undefined); this id done in useeffect already
  };
  const changeSelectedSubheading = (x: BookSyllabus | undefined) => {
    setSelectedSubheading({ subheadingId: x?.subheading_id, creatorId: profile?.id });
    setSelectedSyllabus(x);
  };
  const changeSelectedSharedNote = (x: SharedNotesList) => {
    // setselectedSharedNote(x);
    setSelectedSubheading({ subheadingId: x.subheading_id, creatorId: x.owned_by_userid });
  };

  const updateSharingStatus = async (x: boolean) => {
    if (x === true) {
      const { data, error } = await supabase.from<definitions["books_article_sharing"]>("books_article_sharing").insert([
        {
          books_subheadings_fk: selectedSubheading?.subheadingId,
          owned_by: profile?.id,
          ispublic: true,
          shared_by: profile?.id,
        },
      ]);
      if (data) {
        setIsPostPublic(true);
      }
    } else if (x === false) {
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .delete()
        .match({
          books_subheadings_fk: selectedSubheading?.subheadingId,
          owned_by: profile?.id,
          ispublic: true,
          shared_by: profile?.id,
        });
      if (data) {
        setIsPostPublic(false);
      }
    }
  };

  useEffect(() => {
    console.log("subheading change use effect being called");
    const getIfThisTopicIsPublic = async () => {
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .select(`*`)
        .match({
          books_subheadings_fk: selectedSubheading?.subheadingId,
          owned_by: selectedSubheading?.creatorId,
          ispublic: true,
        });

      if (!data && !error) {
        setIsPostPublic("loading");
      }
      if (data && data.length !== 0) {
        setIsPostPublic(true);
      }
      if (data && data.length === 0) {
        setIsPostPublic(false);
      }
    };
    selectedSubheading?.subheadingId && selectedSubheading?.creatorId ? getIfThisTopicIsPublic() : null;
  }, [selectedSubheading]);

  useEffect(() => {
    setSelectedSubheading(undefined);
  }, [book]);

  // useEffect(() => {
  //   console.log("ispostpublic called and now useeffedct is being called");
  //   const update = async () => {
  //     if (isPostPublic === true) {
  //       const { data, error } = await supabase.from<definitions["books_article_sharing"]>("books_article_sharing").insert([
  //         {
  //           books_subheadings_fk: selectedSubheading?.subheadingId,
  //           owned_by: profile?.id,
  //           ispublic: true,
  //           shared_by: profile?.id,
  //         },
  //       ]);
  //     } else if (isPostPublic === false) {
  //       const { data, error } = await supabase
  //         .from<definitions["books_article_sharing"]>("books_article_sharing")
  //         .delete()
  //         .match({
  //           books_subheadings_fk: selectedSubheading?.subheadingId,
  //           owned_by: profile?.id,
  //           ispublic: true,
  //           shared_by: profile?.id,
  //         });
  //     }
  //   };

  //   update();
  // }, [isPostPublic]);

  return (
    <div>
      <Box px={{base:"0",sm:"2",md:"44"}} pb="8">
        <BookFilter setParentProps={updateBookProps}></BookFilter>
        <Flex justifyContent="end" alignItems="center" mt="2">
          <HStack
            borderRadius="full"
            // bg="gray.200"
            p="1"
            align="center"
            display={selectedSubheading?.creatorId !== profile?.id ? "none" : "undefined"}
          >
            <Text justifyContent="center" as="label" htmlFor="email-alerts" mb="0" px="2" textTransform="capitalize">
              {isPostPublic ? "Make Private" : "Make Public"}
            </Text>
            {/* <Switch
              size="sm"
              colorScheme="whatsapp"
              // defaultChecked={isPostPublic}
              isChecked={isPostPublic}
              // onChange={(e: ChangeEvent<HTMLInputElement>) => updateSharingStatus(e.target.checked)}
            /> */}
            {isPostPublic === "loading" ? (
              <Box>Loading...</Box>
            ) : (
              <Switch
                size="sm"
                colorScheme="whatsapp"
                // defaultChecked={isPostPublic}
                isChecked={isPostPublic}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateSharingStatus(e.target.checked)}
              />
            )}
          </HStack>
        </Flex>
      </Box>
      {/* <Flex my="16" justifyContent="flex-start"> */}
      {book ? (
        <Grid templateColumns="repeat(10, 1fr)">
          <GridItem
            scrollBehavior={"auto"}
            colSpan={{ base: 0, sm: 0, md: 2 }}
            bg="gray.50"
            p="2"
            display={{ base: "none", sm: "none", md: "block" }}
          >
            <Flex>
              <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 10, sm: 10, md: 7 }} px="4">
            {supabase.auth.session() ? (
              <Box>
                <Center>
                  <Text fontSize="md" as="b" casing="capitalize">
                    {!selectedSubheading ? "Select Topic From Syllabus" : selectedSyllabus?.subheading}
                  </Text>
                </Center>
                <Box>
                  <Notes
                    subheadingid={selectedSubheading?.subheadingId}
                    notesCreator={selectedSubheading?.creatorId}
                    changeParentProps={() => console.log("madarchod")}
                  ></Notes>{" "}
                </Box>
              </Box>
            ) : (
              <Center mt="68" bg="gray.50" p="2">
                <Text color="gray.600" fontSize="md" casing="capitalize">
                  Your are not Logged In Please{" "}
                  <Button colorScheme={"whatsapp"} variant="solid" onClick={() => signInWithgoogle(BASE_URL)}>
                    Login
                  </Button>{" "}
                  To View Content
                </Text>
              </Center>
            )}
          </GridItem>
          <GridItem
            colSpan={{ base: 0, sm: 0, md: 1 }}
            bg="gray.50"
            p="0.5"
            display={{ base: "none", sm: "none", md: "block" }}
          >
            <SharedNotesPanel
              subheadingid={selectedSubheading?.subheadingId}
              changeParentProps={changeSelectedSharedNote}
            ></SharedNotesPanel>
          </GridItem>
        </Grid>
      ) : null}

      {/* </Flex> */}
    </div>
  );
};

export default ManageNotes;
