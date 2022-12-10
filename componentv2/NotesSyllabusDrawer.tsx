import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton, Slide, Spacer, useDisclosure, VStack } from "@chakra-ui/react";

const NotesSyllabusDrawer = (props: { children: React.ReactNode,buttonText:string }) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Button onClick={onToggle} variant="outline" rounded={"none"}>
        {props.buttonText}
      </Button>
      {/* Imitation drawer below */}
      <Slide direction="left" in={isOpen} style={{ height: "100vh", width: "350px", zIndex: 100 }}>
        <VStack bg="brand.50" h="100vh" w="350px" overflowY="auto">
          <Flex w="full" justifyContent={"space-between"}>
            <Spacer />
            <IconButton aria-label="Close Control Panel" icon={<CloseIcon />} onClick={onToggle} size="lg" variant="ghost" />
          </Flex>
          {props.children}
          {/* <Syllabus bookId={book?.bookId} bookName={book?.bookName} /> */}
          {/* Insert other contents */}
        </VStack>
      </Slide>
    </>
  );
};

export default NotesSyllabusDrawer;
