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
        {/* <Button ref={btnRef} colorScheme="teal" onClick={onToggle}>
          Controls
        </Button> */}

        <Text
          fontWeight="semibold"
          fontSize={{ base: "small", md: "small", lg: "md" }}
          ref={btnRef}
          // onClick={onToggle}
          onClick={() => setIsModalOpen(true)}
          cursor={"pointer"}
        >
          Select Syllabus
        </Text>
      </Box>
      <Slide ref={ref} direction="left" in={isModalOpen} style={{ height: "100vh", width: "full", zIndex: 100}} >
        <Box bg="white" rounded="md" h="100vh" w="full" shadow="xl" p="8">
          <IconButton
            right="2"
            mt="2"
            aria-label="Close Control Panel"
            icon={<CloseIcon />}
            // onClick={onToggle}
            onClick={() => setIsModalOpen(false)}
            color="black"
          />
          <VStack color="black" bg="white">
            {/* <Box p={5} shadow="md" borderWidth="1px" m="5px">
              <Flex justify={"center"} align={"center"} position={"relative"} w={"full"}> */}
            <BookFilter setParentProps={updateBookProps} />
            {/* </Flex>
            </Box> */}
          </VStack>
        </Box>
      </Slide>
    </>
  );
};

export default DesktopMenu;
