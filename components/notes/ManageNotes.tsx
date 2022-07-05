import {
  Box,
  Button,
  Center,
  Checkbox,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import Sticky from "react-sticky-el";
import { BASE_URL } from "../../lib/constants";
import { elog } from "../../lib/mylog";
// import { supabase } from "../../lib/supabaseClient";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useAuthContext } from "../../state/Authcontext";
import { BookResponse, BookSyllabus, Profile } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import ManageCurrentAffair from "../CurrentAffair/ManageCurrentAffair";

import { useNoteContext } from "../../state/NoteContext";
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
  const [selectedSubheading, setSelectedSubheading] = useState<SelectedSubheadingType | undefined>();

  const [selectedSyllabus, setSelectedSyllabus] = useState<BookSyllabus>();
  const [isPostPublic, setIsPostPublic] = useState<boolean | "loading" | undefined>(undefined);
  const [isPostCopiable, setIsPostCopiable] = useState<boolean | undefined>(undefined);
  const { signInWithgoogle, signOut, profile } = useAuthContext();

  useEffect(() => {
    const x = localStorage.getItem("book");
    if (x && x !== "undefined") {
      const items = JSON.parse(x);
      setBook(items);
    }
  }, []);

  useEffect(() => {
    const x1 = localStorage.getItem("selected-subheading");
    if (x1 && x1 !== "undefined") {
      const items1 = JSON.parse(x1);
      setSelectedSubheading(items1);
    }
  }, []);
  useEffect(() => {
    const x1 = localStorage.getItem("selected-syllabus");
    if (x1 && x1 !== "undefined") {
      const items1 = JSON.parse(x1);
      setSelectedSyllabus(items1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("book", JSON.stringify(book));
  }, [book]);

  useEffect(() => {
    localStorage.setItem("selected-subheading", JSON.stringify(selectedSubheading));
  }, [selectedSubheading]);
  
  useEffect(() => {
    localStorage.setItem("selected-syllabus", JSON.stringify(selectedSyllabus));
  }, [selectedSyllabus]);

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
    setSelectedSubheading(undefined); //reset selected subheading
  };

  const changeSelectedSubheading = (x: BookSyllabus | undefined) => {
    setSelectedSubheading({
      subheadingId: x?.subheading_id,
      creatorId: profile?.id,
      isCopyable: false,
      isEditable: true,
      ownerName: profile?.username,
    });
    setSelectedSyllabus(x);
  };
  const changeSelectedSharedNote = (x: definitions["books_article_sharing"]) => {
    setSelectedSubheading({
      subheadingId: x.books_subheadings_fk,
      creatorId: x.owned_by,
      isEditable: x.allow_edit,
      isCopyable: x.allow_copy,
      ownerName: x.ownedby_name,
    });
  };

  const updateSharingStatus = async (shouldBePublic: boolean) => {
    setIsPostPublic("loading");
    if (shouldBePublic === true) {
      const { data, error } = await supabase.from<definitions["books_article_sharing"]>("books_article_sharing").insert([
        {
          books_subheadings_fk: selectedSubheading?.subheadingId,
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
      setIsPostPublic("loading");
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .delete()
        .match({
          books_subheadings_fk: selectedSubheading?.subheadingId,
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
      setIsPostPublic("loading");
      const { data, error } = await supabase
        .from<definitions["books_article_sharing"]>("books_article_sharing")
        .select(`*`)
        .match({
          books_subheadings_fk: selectedSubheading?.subheadingId,
          owned_by: selectedSubheading?.creatorId,
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
    selectedSubheading?.subheadingId && selectedSubheading?.creatorId ? getIfThisTopicIsPublic() : null;
  }, [selectedSubheading]);

  const handleCopyCheckbox = async (checkValue: boolean) => {
    const { data, error } = await supabase
      .from<definitions["books_article_sharing"]>("books_article_sharing")
      .update({ allow_copy: checkValue })
      .match({ books_subheadings_fk: selectedSubheading?.subheadingId, ispublic: true, owned_by: profile!.id });
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

        {user && selectedSubheading && selectedSubheading.creatorId === profile?.id && (
          <Toolbar
            selectedSubheading={selectedSubheading}
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

      {/* <Flex my="16" justifyContent="flex-start"> */}
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
                    {!selectedSubheading ? "Select Topic From Syllabus" : selectedSyllabus?.subheading}
                  </Text>
                </Center>
                {selectedSubheading && (
                  <Box mt="4">
                    <Text p="2" as="span" bg="blackAlpha.700" fontSize="14px" color="gray.100">
                      {"Notes by : " + selectedSubheading?.ownerName}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Notes
                    subjectId={book.subject_fk!.id}
                    subheadingid={selectedSubheading?.subheadingId}
                    notesCreator={selectedSubheading?.creatorId}
                    changeParentProps={() => console.log("")}
                    isCopyable={selectedSubheading?.isCopyable}
                    isEditable={selectedSubheading?.isEditable}
                  ></Notes>{" "}
                </Box>
              </Box>
            ) : (
              <Center mt="68" bg="gray.50" p="2">
                <Text color="gray.600" fontSize="md" casing="capitalize">
                  Your are not Logged In Please{" "}
                  <Button colorScheme={"green"} variant="solid" onClick={() => signInWithgoogle(BASE_URL)}>
                    Login
                  </Button>{" "}
                  To View Content
                </Text>
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
              subheadingid={selectedSubheading?.subheadingId}
              changeParentProps={changeSelectedSharedNote}
            ></SharedNotesPanel>
          </GridItem>
        </Grid>
      )}

      {/* </Flex> */}
    </div>
  );
};

export default ManageNotes;

type HeaderProps = {
  children: JSX.Element;
};

const DrawerExample = (props: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      <Sticky>
        <IconButton
          aria-label="syllabus"
          variant="outline"
          size="xs"
          icon={<MdMenu />}
          ref={btnRef}
          colorScheme="pink"
          onClick={onOpen}
        >
          Open
        </IconButton>
      </Sticky>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody>{props.children}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function CustomCheckBox(props: { label: string; state: boolean; setState: (arg: boolean) => void }) {
  return (
    <Checkbox
      size="sm"
      colorScheme="gray"
      outlineColor={"red.600"}
      isChecked={props.state}
      onChange={(e) => props.setState(e.target.checked)}
    >
      <Text as="label" casing="capitalize">
        {props.label}
      </Text>
    </Checkbox>
  );
}
type ToolbarProps = {
  selectedSubheading: SelectedSubheadingType;
  distractionOff: boolean;
  setDistractionOff: (arg: boolean) => void;
  isPostPublic: string | boolean | undefined;
  updateSharingStatus: (arg0: boolean) => void;
  isPostCopiable: boolean | undefined;
  handleCopyCheckbox: (arg0: boolean) => void;
};

function Toolbar(props: ToolbarProps) {
  return (
    <Flex justifyContent="end" alignItems="center" mt="4">
      <HStack
        borderRadius="full" // bg="gray.200"
        p="2"
        alignItems="center"
      >
        <>
          <Box
            display={{
              base: "none",
              sm: "none",
              md: "inline",
            }}
          >
            <CustomCheckBox state={props.distractionOff} setState={props.setDistractionOff} label={"Hide right panel"} />
          </Box>
          <Flex alignItems="center">
            <NotesSharing subheadingId={props.selectedSubheading?.subheadingId!}></NotesSharing>
          </Flex>
          <Flex h="6">
            {props.isPostPublic === "loading" ? (
              <CircularProgress isIndeterminate size="20px" color="green.400" />
            ) : (
              <Flex justifyContent="end" alignItems="center">
                {/* <Box bg="aqua"> */}
                <Text justifyContent="center" as="label" htmlFor="email-alerts" px="2" textTransform="capitalize">
                  {props.isPostPublic ? "Make Private" : "Make Public"}
                </Text>
                <Switch
                  size="sm"
                  colorScheme="whatsapp" // defaultChecked={isPostPublic}
                  isChecked={props.isPostPublic as boolean}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateSharingStatus(e.target.checked)}
                />
                <Checkbox
                  size="sm"
                  mx="4"
                  display={props.isPostPublic ? "inline-flex" : "none"}
                  colorScheme={"whatsapp"}
                  textTransform={"capitalize"}
                  isChecked={props.isPostCopiable}
                  onChange={(e) => props.handleCopyCheckbox(e.target.checked)}
                >
                  <Text textTransform="capitalize" as="label">
                    Allow copy
                  </Text>
                </Checkbox>
                {/* </Box> */}
              </Flex>
            )}
          </Flex>
        </>
      </HStack>
    </Flex>
  );
}
