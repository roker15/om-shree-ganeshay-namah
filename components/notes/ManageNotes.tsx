import {
  Box, Center, Flex,
  Grid,
  GridItem,
  HStack, Text
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sticky from "react-sticky-el";
import { elog } from "../../lib/mylog";
// import { supabase } from "../../lib/supabaseClient";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import ManageCurrentAffair from "../CurrentAffair/ManageCurrentAffair";

import { useNoteContext } from "../../state/NoteContext";
import { CustomCheckBox, CustomCircularProgress, CustomDrawer, CustomLabelText, CustomSwitch } from "../CustomChakraUi";
import { LoginCard } from "../LoginCard";
import BookFilter from "../syllabus/BookFilter";
import Notes from "./Notes";
import { NotesSharing } from "./NotesSharing";
import SharedNotesPanel from "./SharedNotesPanel";
import SyllabusForNotes from "./SyllabusForNotes";

type SelectedSubheadingType = {
  subheadingId: number | undefined;
  creatorId: string | undefined;
  isEditable: boolean | undefined;
  isCopyable: boolean | undefined;
  ownerEmail?: string | undefined;
  ownerName?: string | undefined;
  ownerAvatarUrl?: string | undefined;
  isPublic?: boolean | undefined;
};

const ManageNotes: React.FunctionComponent = () => {
  // const { isTagSearchActive } = useNoteContext();
  const { user, error } = useUser();
  const { isTagSearchActive } = useNoteContext();
  const [book, setBook] = useState<BookResponse | undefined>();
  const [selectedNotesOwner, setSelectedNotesOwner] = useState<SelectedSubheadingType | undefined>();

  const [selectedTopic, setSelectedTopic] = useState<BookSyllabus>();
  const [isPostPublic, setIsPostPublic] = useState<boolean | undefined>(undefined);
  const [isPostCopiable, setIsPostCopiable] = useState<boolean | undefined>(undefined);
  const { profile } = useAuthContext();

  useEffect(() => {
    const x = sessionStorage.getItem("book");
    if (x && x !== "undefined") {
      const items = JSON.parse(x);
      setBook(items);
    }
  }, []);

  useEffect(() => {
    const x = sessionStorage.getItem("selected-subheading");
    if (x && x !== "undefined") {
      const items1 = JSON.parse(x);
      setSelectedNotesOwner(items1);
    }
  }, []);
  useEffect(() => {
    const x = sessionStorage.getItem("selected-syllabus");
    if (x && x !== "undefined") {
      const items1 = JSON.parse(x);
      setSelectedTopic(items1);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("book", JSON.stringify(book));
  }, [book]);

  useEffect(() => {
    sessionStorage.setItem("selected-subheading", JSON.stringify(selectedNotesOwner));
  }, [selectedNotesOwner]);

  useEffect(() => {
    sessionStorage.setItem("selected-syllabus", JSON.stringify(selectedTopic));
  }, [selectedTopic]);

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
    setSelectedNotesOwner(undefined); //reset selected subheading
    setSelectedTopic(undefined); //reset selected subheading
  };

  const changeSelectedSubheading = (x: BookSyllabus | undefined) => {
    setSelectedNotesOwner({
      subheadingId: x?.subheading_id,
      creatorId: profile?.id,
      isCopyable: false,
      isEditable: true,
      ownerName: profile?.username,
    });
    setSelectedTopic(x);
  };
  const changeSelectedSharedNote = (x: definitions["books_article_sharing"]) => {
    setSelectedNotesOwner({
      subheadingId: x.books_subheadings_fk,
      creatorId: x.owned_by,
      isEditable: x.allow_edit,
      isCopyable: x.allow_copy,
      ownerName: x.ownedby_name,
    });
  };

  const updateSharingStatus = async (shouldBePublic: boolean) => {
    setIsPostPublic(undefined);
    if (shouldBePublic === true) {
      const { data, error } = await supabase.from<definitions["books_article_sharing"]>("books_article_sharing").insert([
        {
          books_subheadings_fk: selectedNotesOwner?.subheadingId,
          owned_by: profile?.id,
          ownedby_email: profile?.email,
          ownedby_name: profile?.username,
          ownedby_avatar: profile?.avatar_url,
          ispublic: true,
          shared_by: profile?.id,
        },
      ]);
      if (error) {
        elog("ManageNotes->updateSharingStatuss", error.message);
        return;
      }
      if (data) {
        setIsPostPublic(true);
      }
    }
    if (shouldBePublic === false) {
      setIsPostPublic(undefined);
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .delete()
        .match({
          books_subheadings_fk: selectedNotesOwner?.subheadingId,
          owned_by: profile?.id,
          ispublic: true,
          shared_by: profile?.id,
        });
      if (error) {
        elog("ManageNotes->updateSharingStatuss", error.message);
        return;
      }
      if (data) {
        setIsPostPublic(false);
        setIsPostCopiable(undefined);
      }
    }
  };

  useEffect(() => {
    const getIfThisTopicIsPublic = async () => {
      setIsPostPublic(undefined);
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .select(`*`)
        .match({
          books_subheadings_fk: selectedNotesOwner?.subheadingId,
          owned_by: selectedNotesOwner?.creatorId,
          ispublic: true,
        });
      if (error) {
        elog("ManageNotes->useeffect", error.message);
        setIsPostPublic(undefined);
        return;
      }
      if (data && data.length !== 0) {
        setIsPostPublic(true);
        setIsPostCopiable(data[0].allow_copy);
      }
      if (data && data.length === 0) {
        setIsPostPublic(false);
        setIsPostCopiable(undefined);
      }
    };
    selectedNotesOwner?.subheadingId && selectedNotesOwner?.creatorId ? getIfThisTopicIsPublic() : null;
  }, [selectedNotesOwner]);

  const handleCopyCheckbox = async (checkValue: boolean) => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .update({ allow_copy: checkValue })
      .match({ books_subheadings_fk: selectedNotesOwner?.subheadingId, ispublic: true, owned_by: profile!.id });
    if (data && data.length !== 0) {
      setIsPostCopiable(checkValue);
    }
  };
  const [distractionOff, setDistractionOff] = useState(false);

  if (isTagSearchActive) {
    return (
      <Box px={{ base: "0.5", sm: "0.5", md: "0.5", lg: "16" }} pb="8">
        <BookFilter setParentProps={updateBookProps}></BookFilter>
        <ManageCurrentAffair></ManageCurrentAffair>)
      </Box>
    );
  }

  return (
    <div>
      <Box px={{ base: "0.5", sm: "0.5", md: "0.5", lg: "44" }} pb="8">
        <BookFilter setParentProps={updateBookProps}></BookFilter>

        {user && selectedNotesOwner && selectedNotesOwner.creatorId === profile?.id && (
          <Toolbar
            selectedSubheading={selectedNotesOwner}
            isPostPublic={isPostPublic}
            isPostCopiable={isPostCopiable}
            // profile={profile}
            updateSharingStatus={updateSharingStatus}
            handleCopyCheckbox={handleCopyCheckbox}
            distractionOff={distractionOff}
            setDistractionOff={setDistractionOff}
          ></Toolbar>
        )}
      </Box>
      {book && (
        <Sticky>
          <div style={{ zIndex : 2147483657}}>
          <Flex justifyContent="space-between" display={{ base: "undefined", sm: "undefined", md: "none" }}>
            <>
              <CustomDrawer>
                <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
              </CustomDrawer>
              <CustomDrawer>
                <SharedNotesPanel
                  subheadingid={selectedNotesOwner?.subheadingId}
                  changeParentProps={changeSelectedSharedNote}
                ></SharedNotesPanel>
              </CustomDrawer>
            </>
          </Flex>
          </div>
        </Sticky>
      )}
      {book && (
        <Grid templateColumns="repeat(10, 1fr)">
          <GridItem
            scrollBehavior={"auto"}
            colSpan={{ base: 0, sm: 0, md: 2 }}
            bg="orange.50"
            p="2"
            display={{ base: "none", sm: "none", md: "block" }}
          >
            <Flex>
              <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
            </Flex>
          </GridItem>
          <GridItem colSpan={!distractionOff ? { base: 10, sm: 10, md: 7 } : { base: 10, sm: 10, md: 8 }} px="4">
            {user ? (
              <Box>
                <Center>
                  <Text fontSize="md" as="b" casing="capitalize">
                    {!selectedNotesOwner ? "Select Topic From Syllabus" : selectedTopic?.subheading}
                  </Text>
                </Center>
                {selectedNotesOwner && (
                  <Box mt="4">
                    <Text p="2" as="span" bg="blackAlpha.700" fontSize="14px" color="gray.100">
                      {"Notes by : " + selectedNotesOwner?.ownerName}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Notes
                    subjectId={book.subject_fk!.id}
                    subheadingid={selectedNotesOwner?.subheadingId}
                    notesCreator={selectedNotesOwner?.creatorId}
                    changeParentProps={() => console.log("")}
                    isCopyable={selectedNotesOwner?.isCopyable}
                    isEditable={selectedNotesOwner?.isEditable}
                  ></Notes>{" "}
                </Box>
              </Box>
            ) : (
              <Center mt="68" bg="gray.50" p="2">
                <LoginCard />
              </Center>
            )}
          </GridItem>

          <GridItem
            colSpan={!distractionOff ? { base: 0, sm: 0, md: 1 } : { base: 0, sm: 0, md: 0 }}
            bg="orange.50"
            p="0.5"
            visibility={!distractionOff ? "visible" : "hidden"}
            display={{ base: "none", sm: "none", md: "block" }}
          >
            <SharedNotesPanel
              subheadingid={selectedNotesOwner?.subheadingId}
              changeParentProps={changeSelectedSharedNote}
            ></SharedNotesPanel>
          </GridItem>
        </Grid>
      )}
    </div>
  );
};

export default ManageNotes;

type ToolbarProps = {
  selectedSubheading: SelectedSubheadingType;
  distractionOff: boolean;
  setDistractionOff: (arg: boolean) => void;
  isPostPublic: boolean | undefined;
  updateSharingStatus: (arg0: boolean) => void;
  isPostCopiable: boolean | undefined;
  handleCopyCheckbox: (arg0: boolean) => void;
};

function Toolbar(props: ToolbarProps) {
  return (
    <Flex justifyContent="end" alignItems="center" mt="4">
      <HStack spacing="5px">
        <>
          <Box
            display={{
              base: "none",
              sm: "none",
              md: "inline",
            }}
          >
            <CustomCheckBox state={props.distractionOff} changeState={props.setDistractionOff} label={"Hide right panel"} />
          </Box>
          <Flex alignItems="center">
            <NotesSharing subheadingId={props.selectedSubheading?.subheadingId!}></NotesSharing>
          </Flex>

          {props.isPostPublic === undefined ? (
            <CustomCircularProgress size="15px" />
          ) : (
            <HStack alignItems="center" spacing="5px">
              <CustomLabelText label={props.isPostPublic ? "Make Private" : "Make Public"} />
              <CustomSwitch state={props.isPostPublic} changeState={props.updateSharingStatus}></CustomSwitch>
              <CustomCheckBox label={"Allow copy"} state={props.isPostCopiable!} changeState={props.handleCopyCheckbox} />
            </HStack>
          )}
        </>
      </HStack>
    </Flex>
  );
}
