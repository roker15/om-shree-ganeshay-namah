import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BookResponse } from "../../types/myTypes";
import BookFilter from "./BookFilter";
import FormCreateHeading from "./FormCreateHeading";
import FormCreateSubheading from "./FormCreateSubheading";
import Syllabus from "./Syllabus";
export interface FormProps {
  formMode: "CREATE_HEADING" | "UPDATE_HEADING" | "CREATE_SUBHEADING" | "UPDATE_SUBHEADING" | undefined;
  book_id: number | undefined;
  book_name: string | undefined;
  heading_id?: number | undefined;
  heading?: string | undefined;
  heading_sequence?: number | undefined;
  subheading_id?: number | undefined;
  subheading?: string | undefined;
  subheading_sequence?: number | undefined;
}

const CreateBookSyllabus = () => {
  const [book, setBook] = useState<BookResponse | undefined>();
  const [formProps, setFormProps] = useState<FormProps>();

  const updateBookProps = (x: BookResponse | undefined) => {
    setBook(x);
  };
  const changeFormProps = (x: FormProps) => {
    setFormProps(x);
  };
  return (
    <Flex maxW="auto" my="16">
      <Syllabus book={book} changeFormProps={changeFormProps}></Syllabus>
      <VStack>
        <Box ml="8">
          <BookFilter setParentProps={updateBookProps}></BookFilter>
        </Box>
        <Text>{formProps?.book_name}</Text>
        {/* <FormCreateHeading x={formProps}></FormCreateHeading> */}
        {formProps?.formMode === "CREATE_HEADING" || formProps?.formMode === "UPDATE_HEADING" ? (
          <FormCreateHeading x={formProps}></FormCreateHeading>
        ) : formProps?.formMode === "CREATE_SUBHEADING" || formProps?.formMode === "UPDATE_SUBHEADING" ? (
          <FormCreateSubheading x={formProps}></FormCreateSubheading>
        ) : null}
        {/* <FormCreateHeading x={formProps}></FormCreateHeading> */}
      </VStack>
    </Flex>
  );
};

export default CreateBookSyllabus;
