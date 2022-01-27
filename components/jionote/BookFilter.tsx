import { Box, Radio, RadioGroup, Select, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useGetBooks, useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { BookResponse } from "../../types/myTypes";
import Syllabus from "./Syllabus";

const BookFilter: React.FC<{ setParentProps: (x: BookResponse | undefined) => void }> = ({ setParentProps }) => {
  const categories = [
    { id: "1", name: "NCERT" },
    { id: "2", name: "IGNOU" },
  ];
  const [value, setValue] = React.useState("1");
  const { data } = useGetBooks(Number(value));
  const { data: d } = useGetSyllabusByBookId(2);
  const [classList, setClassList] = React.useState<BookResponse[] | null>([]);
  const [selectedClass, setSelectedClass] = React.useState<number | undefined>();
  const [subjectList, setSubjectList] = React.useState<BookResponse[] | null>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<number | undefined>();
  const [bookList, setBookList] = React.useState<BookResponse[] | null>([]);
  useEffect(() => {
    setClassList(
      data
        ? data.filter(
            (v, i, a) => a.findIndex((t) => t.class_fk.id === v.class_fk.id && t.class_fk.class === v.class_fk.class) === i
          )
        : null
    );
  }, [data]);
  useEffect(() => {
    setSubjectList(
      data
        ? data
            .filter((c) => c.class_fk.id === selectedClass)
            .filter((v, i, a) => a.findIndex((t) => t.subject_fk.id === v.subject_fk.id) === i)
        : null
    );
  }, [data, selectedClass]);
  useEffect(() => {
    setBookList(
      data
        ? data.filter((x) => {
            //if we use curly braces then this is a block and return keyword used explicitly
            // remove braces, we can also then remove "return" because reuturn is implicit
            return x.class_fk.id === selectedClass && x.subject_fk.id === selectedSubject;
          })
        : null
    );
  }, [data, selectedClass, selectedSubject]);
  return (
    // <Container maxW="container.lg" bg="pink">

    <Box>
      <Syllabus />
      <RadioGroup onChange={setValue} value={value}>
        <Stack direction="row">
          {categories.map((x) => {
            return (
              <Radio key={x.id} value={x.id}>
                {x.name}
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
      {/* use Stack instead of Hstack for responsivness */}
      <Stack direction={{ base: "column", md: "row" }}>
        <Select
          variant={"filled"}
          size="sm"
          id="paper"
          placeholder="Select Class  🥕"
          onChange={(e) => {
            setSelectedClass(Number(e.target.value));
          }}
        >
          {classList?.map((x) => {
            return (
              <option key={x.id} value={x.class_fk.id}>
                {"Class " + x.class_fk.class}
              </option>
            );
          })}
        </Select>
        <Select
          variant={"filled"}
          size="sm"
          id="paper"
          placeholder="Select Subject 🍍"
          onChange={(e) => {
            setSelectedSubject(Number(e.target.value));
          }}
        >
          {subjectList?.map((x) => {
            return (
              <option key={x.id} value={x.subject_fk.id}>
                {x.subject_fk.subject_name}
              </option>
            );
          })}
        </Select>
        <Select
          variant={"filled"}
          size="sm"
          id="paper"
          placeholder="Select Book 🍎"
          onChange={(e) => {
            setParentProps(data?.find((item) => item.id === Number(e.target.value)));
          }}
        >
          {bookList?.map((x) => {
            //can you ommit reuturn keyword? yes you can !by removing curly brace and semicolon ";"
            //https://stackoverflow.com/questions/50501047/one-line-arrow-functions-without-braces-cant-have-a-semicolon
            return (
              <option key={x.id} value={x.id}>
                {x.book_name + x.class_fk.class}
              </option>
            );
          })}
        </Select>
      </Stack>
    </Box>

    // </Container>
  );
};
export default BookFilter;
