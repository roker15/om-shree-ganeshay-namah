import { CloseIcon } from "@chakra-ui/icons";
import {
  Slide,
  Button,
  VStack,
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  Input,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { BookResponse } from "../../types/myTypes";
import BookFilter from "../syllabus/BookFilter";

const DesktopMenu = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
  const btnRef = useRef(null);
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useOutsideClick({
    ref: ref,
    handler: () => setIsModalOpen(false),
  });

  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },
    });
  };

  useEffect(() => {
    if (book) {
      sessionStorage.setItem("book", JSON.stringify(book));
      sessionStorage.setItem("selected-subheading", "undefined");
      sessionStorage.setItem("selected-syllabus", "undefined");
      navigateTo(book.id.toString());
    }
  }, [book]);

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };
  return (
    <>
      <Box style={{ position: "absolute", zIndex: "100" }} w="container.md">
        <Text
          
          fontSize={{ base: "small", md: "small", lg: "md" }}
          ref={btnRef}
          // onClick={onToggle}
          onClick={() => setIsModalOpen(true)}
          cursor={"pointer"}
        >
          Select Syllabus
        </Text>
      </Box>
      <Slide ref={ref} direction="left" in={isModalOpen} style={{ height: "100vh", width: "full", zIndex: 100 }}>
        <Box  h="100vh" w="full" >
          <IconButton aria-label="Close Control Panel" icon={<CloseIcon />} onClick={() => setIsModalOpen(false)} />
          <VStack >
            <BookFilter setParentProps={updateBookProps} />
          </VStack>
        </Box>
      </Slide>
    </>
  );
};

export default DesktopMenu;
