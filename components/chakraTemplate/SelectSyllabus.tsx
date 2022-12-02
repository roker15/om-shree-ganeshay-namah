import { Container, Flex, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import router from "next/router";
import { useEffect, useState } from "react";
import { BookResponse } from "../../types/myTypes";
import BookFilter from "../syllabus/BookFilter";

export default function CallToActionWithVideo() {
  const [book, setBook] = useState<BookResponse | undefined>(undefined);
  const  user  = useUser();
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
    <Container maxW={"4xl"} bg="gray.100" p="4">
      <Stack
        // align={"center"}
        spacing={{ base: 8, md: 10 }}
        // pt={{ base: 8, md: 8 }}
        direction={{ base: "column", md: "column" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading lineHeight={1.1} fontWeight={"extrabold"} fontSize={{ base: "xl", sm: "2xl", lg: "3xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "red.400",
                zIndex: -1,
              }}
            >
              Select Syllabus,
            </Text>
            <br />
            <Text as={"span"} color={"orange.400"}>
              And start making Notes
            </Text>
          </Heading>
        </Stack>
        <VStack spacing={"12"} flex={1} w="full">
          <Flex justify={"center"} align={"center"} position={"relative"} w={"full"}>
            <BookFilter setParentProps={updateBookProps} />
          </Flex>
        </VStack>
      </Stack>
    </Container>
  );
}
