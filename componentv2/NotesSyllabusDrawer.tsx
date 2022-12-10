import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Flex,
  Heading,
  IconButton,
  Slide,
  useDisclosure,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { Syllabus } from "../pages";
import { useNotesContextNew } from "../state/NotesContextNew";

const NotesSyllabusDrawer = (props: { buttonType: "xs" | "md" | "icon" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { book, selectedSubheading, setNotesCreator, notesCreator, searchText } = useNotesContextNew();

  return (
    <>
      <ButtonSmall onClick={onOpen} />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Request us Anything</DrawerHeader>
          <br />
          <br />
          <DrawerBody>
            <Syllabus bookId={book?.bookId} bookName={book?.bookName} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
const ButtonSmall = (props: { onClick: () => void }) => {
  return (
    <>
      <Button size="sm" colorScheme="pink" variant="solid" onClick={() => props.onClick()}>
        Syllabus
      </Button>
      <SlideEx />
    </>
  );
};
export default NotesSyllabusDrawer;

function SlideEx() {
  const { isOpen, onToggle } = useDisclosure();
  const { book, selectedSubheading, setNotesCreator, notesCreator, searchText } = useNotesContextNew();
  return (
    <>
      <Button onClick={onToggle}>Click Me</Button>
      {/* Imitation drawer below */}
      <Slide direction="left" in={isOpen} style={{ height: "100vh", width: "350px", zIndex: 100 }}>
        <VStack  bg="brand.50" h="100vh" w="350px" overflowY="auto">
          <Flex  w="full"  justifyContent={"space-between"}>
            <Spacer />
            <IconButton
              aria-label="Close Control Panel"
              icon={<CloseIcon />}
              onClick={onToggle}
             size="lg"
              variant="ghost"
            />
          </Flex>
          <Syllabus bookId={book?.bookId} bookName={book?.bookName} />
          {/* Insert other contents */}
        </VStack>
      </Slide>
    </>
  );
}
