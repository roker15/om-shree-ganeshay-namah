import {
  Box, Center, Flex,
  Grid,
  GridItem,
  HStack,
  IconButton, Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  StackDivider
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

import { useRouter } from "next/router";
import { FaEllipsisH } from "react-icons/fa";
import { BASE_URL } from "../../lib/constants";
import { useNoteContext } from "../../state/NoteContext";
import {
  BoldText, CustomCheckBox,
  CustomCircularProgress,
  CustomDrawer, CustomSwitch, LabelText, SpanTextWithBackground
} from "../CustomChakraUi";
import { LoginCard } from "../LoginCard";
import Notes from "./Notes";
import { NotesSharing } from "./NotesSharing";
import SharedNotesPanel from "./SharedNotesPanel";
import SyllabusForNotes from "./SyllabusForNotes";
// import { GotoQuestion } from "../../pages";

type SelectedNotesType = {
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
  const router = useRouter();
  const { isTagSearchActive, bookResponse, setBookResponse } = useNoteContext();
  const [book, setBook] = useState<BookResponse | undefined>();
  const [bookid, setBookid] = useState<number | undefined>();
  const [selectedNotes, setSelectedNotes] = useState<SelectedNotesType | undefined>();

  const [selectedTopic, setSelectedTopic] = useState<BookSyllabus|undefined>();
  const [isPostPublic, setIsPostPublic] = useState<boolean | undefined>(undefined);
  const [isPostCopiable, setIsPostCopiable] = useState<boolean | undefined>(undefined);
  const { profile } = useAuthContext();

  useEffect(() => {
    if (bookResponse) {
      setBook(bookResponse);
      setSelectedNotes(undefined); //reset selected subheading
      setSelectedTopic(undefined); //reset selected subheading
    }
  }, [bookResponse]);

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
      setSelectedNotes(items1);
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
    sessionStorage.setItem("selected-subheading", JSON.stringify(selectedNotes));
  }, [selectedNotes]);

  useEffect(() => {
    sessionStorage.setItem("selected-syllabus", JSON.stringify(selectedTopic));
  }, [selectedTopic]);

  // const updateBookProps = (x: BookResponse | undefined) => {
  //   setBook(x);
  //   setSelectedNotes(undefined); //reset selected subheading
  //   setSelectedTopic(undefined); //reset selected subheading
  // };

  const changeSelectedSubheading = (x: BookSyllabus | undefined) => {
    setSelectedNotes({
      subheadingId: x?.subheading_id,
      creatorId: profile?.id,
      isCopyable: false,
      isEditable: true,
      ownerName: profile?.username,
    });
    setSelectedTopic(x);
  };
  const changeSelectedSharedNote = (x: definitions["books_article_sharing"]) => {
    setSelectedNotes({
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
          books_subheadings_fk: selectedNotes?.subheadingId,
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
          books_subheadings_fk: selectedNotes?.subheadingId,
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
          books_subheadings_fk: selectedNotes?.subheadingId,
          owned_by: selectedNotes?.creatorId,
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
    selectedNotes?.subheadingId && selectedNotes?.creatorId ? getIfThisTopicIsPublic() : null;
  }, [selectedNotes]);

  const handleCopyCheckbox = async (checkValue: boolean) => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .update({ allow_copy: checkValue })
      .match({ books_subheadings_fk: selectedNotes?.subheadingId, ispublic: true, owned_by: profile!.id });
    if (data && data.length !== 0) {
      setIsPostCopiable(checkValue);
    }
  };
  const [distractionOff, setDistractionOff] = useState(false);

  if (isTagSearchActive) {
    return (
      <Box px={{ base: "0.5", sm: "0.5", md: "0.5", lg: "16" }} pb="8">
        {/* <BookFilter setParentProps={updateBookProps}></BookFilter> */}
        <ManageCurrentAffair></ManageCurrentAffair>
      </Box>
    );
  }
  return (
    <div>
      <Flex justifyContent={"space-between"} alignItems="left" mt="6">
        {/* <CustomDrawerWithButton>
          <BookFilter setParentProps={updateBookProps}></BookFilter>
        </CustomDrawerWithButton> */}
        {bookid}
        {user && selectedNotes && selectedNotes.creatorId === profile?.id && (
          <Popover>
            <PopoverTrigger>
              <IconButton size="sm" icon={<FaEllipsisH />} aria-label={""} />
            </PopoverTrigger>
            <PopoverContent bg="gray.50" ml="2">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader bg="gray.100">Select Actions</PopoverHeader>
              <PopoverBody>
                {" "}
                <Toolbar
                  selectedSubheading={selectedNotes}
                  isPostPublic={isPostPublic}
                  isPostCopiable={isPostCopiable}
                  // profile={profile}
                  updateSharingStatus={updateSharingStatus}
                  handleCopyCheckbox={handleCopyCheckbox}
                  distractionOff={distractionOff}
                  setDistractionOff={setDistractionOff}
                ></Toolbar>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          
        )}
      </Flex>
      <Box px={{ base: "0.5", sm: "0.5", md: "0.5", lg: "44" }} pb="4">
        {/* <BookFilter setParentProps={updateBookProps}></BookFilter> */}
      </Box>
      {book && (
        <Sticky>
          <div>
            <Flex justifyContent="space-between" display={{ base: "undefined", sm: "undefined", md: "undefined",lg:"none" }}>
              <>
                <CustomDrawer  buttonLabel={"Open Syllabus"}>
                  <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
                </CustomDrawer>
                <CustomDrawer  buttonLabel={"Share Panel"}>
                  <SharedNotesPanel
                    subheadingid={selectedNotes?.subheadingId}
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
            // scrollBehavior={"auto"}
            colSpan={{ base: 0, sm: 0, md: 0, lg:2 }}
            bg="brand.50"
            // p="2"
            display={{ base: "none", sm: "none", md: "none",lg:"block" }}
            borderRight="1px"
            borderRightColor={"gray.100"}
            borderRightRadius="md"
          >
            <Flex>
              <SyllabusForNotes book={book} changeParentProps={changeSelectedSubheading}></SyllabusForNotes>
            </Flex>
          </GridItem>
          <GridItem colSpan={!distractionOff ? { base: 10, sm: 10, md: 10, lg:7 } : { base: 10, sm: 10, md: 10, lg:8 }} px={{ base: 0, sm: 0, md: 4 }}>
            {user ? (
              <Box>
                <Center>
                  <BoldText label={selectedNotes ? selectedTopic?.subheading : "Select Topic From Syllabus"} />
                </Center>
                {selectedNotes && (
                  <Box mt="4">
                    <SpanTextWithBackground label={"Notes by : " + selectedNotes.ownerName} />
                  </Box>
                )}
                <Box>
                  <Notes
                    subjectId={book.subject_fk!.id}
                    subheadingid={selectedNotes?.subheadingId}
                    notesCreator={selectedNotes?.creatorId}
                    changeParentProps={() => console.log("")}
                    isCopyable={selectedNotes?.isCopyable}
                    isEditable={selectedNotes?.isEditable}
                  ></Notes>{" "}
                </Box>
              </Box>
            ) : (
              <Center mt="68" bg="gray.50" p="2">
                <LoginCard redirect={BASE_URL} />
              </Center>
            )}
          </GridItem>

          <GridItem
            colSpan={!distractionOff ? { base: 0, sm: 0, md: 0 , lg:1} : { base: 0, sm: 0, md: 0, lg: 0}}
            bg="brand.50"
            visibility={!distractionOff ? "visible" : "hidden"}
            display={{ base: "none", sm: "none", md: "none",lg:"block" }}
            borderLeft="1px"
            borderLeftColor={"gray.100"}
            borderLeftRadius="md"
          >
            <SharedNotesPanel
              subheadingid={selectedNotes?.subheadingId}
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
  selectedSubheading: SelectedNotesType;
  distractionOff: boolean;
  setDistractionOff: (arg: boolean) => void;
  isPostPublic: boolean | undefined;
  updateSharingStatus: (arg0: boolean) => void;
  isPostCopiable: boolean | undefined;
  handleCopyCheckbox: (arg0: boolean) => void;
};

function Toolbar(props: ToolbarProps) {
  return (
    <Flex alignItems="center">
      <Stack spacing="5px" justifyContent="left" px="4" divider={<StackDivider borderColor="gray.200" />}>
        <Box
          display={{
            base: "none",
            sm: "none",
            md: "inline",
          }}
        >
          <CustomCheckBox state={props.distractionOff} changeState={props.setDistractionOff} label={"Hide right panel"} />
        </Box>
        <Flex justifyContent="baseline">
          <NotesSharing subheadingId={props.selectedSubheading?.subheadingId!}></NotesSharing>
        </Flex>
        {props.isPostPublic === undefined ? (
          <CustomCircularProgress size="15px" />
        ) : (
          <HStack alignItems="center" spacing="5px" justifyContent="left">
            <CustomSwitch state={props.isPostPublic} changeState={props.updateSharingStatus}></CustomSwitch>
            <LabelText label={props.isPostPublic ? "Make Notes Private" : "Make Notes Public"} />
            {props.isPostPublic && <CustomCheckBox label={"Allow copy"} state={props.isPostCopiable!} changeState={props.handleCopyCheckbox} />}
          </HStack>
        )}
      </Stack>
    </Flex>
  );
}
