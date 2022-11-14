import { Box, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useGetBooks, useGetSyllabusByBookId } from "../../customHookes/networkHooks";
import { useNoteContext } from "../../state/NoteContext";
import { BookResponse } from "../../types/myTypes";

const BookFilter: React.FC<{ setParentProps: (x: BookResponse | undefined) => void }> = ({ setParentProps }) => {
  const categories = [
    { id: "7", name: "Competitive exams" },
    { id: "1", name: "NCERT" },
    // { id: "6", name: "ICSE" },
    // { id: "5", name: "Medical" },
    // { id: "2", name: "IGNOU" },
    { id: "4", name: "Engineering" },
    
  ];
  const [value, setValue] = React.useState("7");
  const { data } = useGetBooks(Number(value));
  const { data: d } = useGetSyllabusByBookId(2);
  const [classList, setClassList] = React.useState<BookResponse[] | null>([]);
  const [selectedClass, setSelectedClass] = React.useState<number | undefined>();
  const [subjectList, setSubjectList] = React.useState<BookResponse[] | null>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<number | undefined>();
  const [bookList, setBookList] = React.useState<BookResponse[] | null>([]);
  const { setIsTagSearchActive, setBookResponse, bookResponse } = useNoteContext();
  const [bookid, setBookid] = useState<string | undefined>();

  // useEffect(() => {
  //   if (bookResponse && bookid) {
  //     navigateTo(bookid);
  //   }
  // }, [bookResponse, bookid]);
  
 


  useEffect(() => {
    setClassList(
      data
        ? data.filter(
            (v, i, a) =>
              a.findIndex((t) => t.class_fk!.id === v.class_fk!.id && t.class_fk!.class === v.class_fk!.class) === i
          )
        : null
    );
  }, [data]);
  useEffect(() => {
    setSubjectList(
      data
        ? data
            .filter((c) => c.class_fk!.id === selectedClass)
            .filter((v, i, a) => a.findIndex((t) => t.subject_fk!.id === v.subject_fk!.id) === i)
        : null
    );
  }, [data, selectedClass]);
  useEffect(() => {
    setBookList(
      data
        ? data.filter((x) => {
            //if we use curly braces then this is a block and return keyword used explicitly
            // remove braces, we can also then remove "return" because reuturn is implicit
            return x.class_fk!.id === selectedClass && x.subject_fk!.id === selectedSubject;
          })
        : null
    );
  }, [data, selectedClass, selectedSubject]);

  const ROUTE_POST_ID = "/notes/[bookid]";
  const navigateTo = (bookid: string) => {
    router.push({
      pathname: ROUTE_POST_ID,
      query: { bookid },

      // href:"www.localhost.com"
    });
  };

  return (
    <Box minW="full">
      <RadioGroup onChange={setValue} value={value} pr="6">
        <Stack direction={{ base: "column", md: "column", lg: "row" }}>
          {categories.map((x) => {
            return (
              <Radio key={x.id} value={x.id} colorScheme="blue" borderColor= 'gray.500'>
                <Text casing="capitalize">{x.name}</Text>
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
      <Stack direction={{ base: "column", md: "column", lg: "row" }} py="4">
        <Select
          id="paper"
          placeholder={value === "7" ? "Select Exam" : "Select Class/Course"}
          onChange={(e) => {
            setSelectedClass(Number(e.target.value));
          }}
        >
          {classList
            ?.sort((a, b) => {
              return a.class_fk!.class > b.class_fk!.class ? 1 : -1;
            })
            .map((x) => {
              return (
                <option key={x.id} value={x.class_fk!.id}>
                  {value === "1" ? "Class " + x.class_fk!.class : x.class_fk!.class}
                </option>
              );
            })}
        </Select>
        <Select
          id="paper"
          placeholder={value === "7" ? "Select Paper" : "Select Subject"}
          onChange={(e) => {
            setSelectedSubject(Number(e.target.value));
          }}
        >
          {subjectList?.map((x) => {
            return (
              <option key={x.id} value={x.subject_fk!.id}>
                {x.subject_fk!.subject_name}
              </option>
            );
          })}
        </Select>
        <Select
          id="paper"
          placeholder={value === "7" ? "Select Syllabus" : "Select Book"}
          onChange={(e) => {
            setBookid(e.target.value);
            setBookResponse(data?.find((item) => item.id === Number(e.target.value)));
            setParentProps!(data?.find((item) => item.id === Number(e.target.value)));
            setIsTagSearchActive(false);
            // navigateTo(e.target.value, "hello");
          }}
        >
          {bookList?.map((x) => {
            //can you ommit reuturn keyword? yes you can !by removing curly brace and semicolon ";"
            //https://stackoverflow.com/questions/50501047/one-line-arrow-functions-without-braces-cant-have-a-semicolon
            return (
              <option key={x.id} value={x.id}>
                {value === "1" ? x.book_name + " " + x.class_fk!.class : x.book_name}
              </option>
            );
          })}
        </Select>
      </Stack>
    </Box>
  );
};
export default BookFilter;
