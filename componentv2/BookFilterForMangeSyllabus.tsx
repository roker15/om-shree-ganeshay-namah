import { Box, Button, Container, Radio, RadioGroup, Select, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGetBooks, useGetColleges, useGetCollegesCourses, useGetPersonalCourses } from "../customHookes/networkHooks";
import { useAuthContext } from "../state/Authcontext";
import { useNoteContext } from "../state/NoteContext";
import { Book, useSyllabusContext } from "../state/SyllabusContext";
import { BookResponse } from "../types/myTypes";

const BookFilterForMangeSyllabus = () => {
  const [category, setCategory] = React.useState("7");
  const [selectedCollege, setSelectedCollege] = useState<number | undefined>(undefined);
  const { setBook, setDisplayMode, setCategory: setCat } = useSyllabusContext();
  const { profile } = useAuthContext();

  const changeCategory = (category: string) => {
    setCategory(category);
    setCat(category);
  };

  return (
    <Box px="2"  _hover={{ color: "#4154f1", bg: "brand.100" }}>
      <Categories category={category} onChangeCallback={changeCategory} />
      {category === "8" ? (
        <Stack direction={"row"}>
          <VStack>
            <Colleges onChangeCallback={setSelectedCollege} />
            {profile && profile.role === "ADMIN" && (
              <Button
                onClick={() => {
                  setDisplayMode("COLLEGE");
                }}
              >
                Add College
              </Button>
            )}
          </VStack>
          {selectedCollege && (
            <VStack>
              <CollegeCourses collegeId={selectedCollege} onChangeCallback={setBook} />{" "}
              {profile && profile.role === "ADMIN" && (
                <Button
                  onClick={() => {
                    setDisplayMode("COLLEGE_COURSE");
                  }}
                >
                  Add New Course
                </Button>
              )}
            </VStack>
          )}
        </Stack>
      ) : category === "9" ? (
        <>
          <PersonalSyllabus onChangeCallback={setBook} />
          {profile && (
            <Button
              onClick={() => {
                setDisplayMode("PERSONAL_COURSE");
              }}
            >
              Add New
            </Button>
          )}
        </>
      ) : (
        <BookFilterNew onChangeCallback={setBook} category={category} />
      )}
    </Box>
  );
};
interface ICategory {
  category: string;
  onChangeCallback: (category: string) => void;
}
const Categories = (props: ICategory) => {
  const categories = [
    { id: "7", name: "Competitive exams" },
    { id: "1", name: "NCERT" },
    { id: "4", name: "Engineering" },
    { id: "8", name: "Universities/Colleges" },
    { id: "9", name: "Personal Syllabus" },
  ];
  const [value, setValue] = React.useState(props.category);
  const handleChange = (e: string) => {
    setValue(e);
    props.onChangeCallback(e);
  };
  return (
    <div>
      <RadioGroup
        onChange={(e) => {
          handleChange(e);
        }}
        value={value}
      >
        <Stack direction={{ base: "column", md: "column", lg: "row" }}>
          {categories.map((x) => {
            return (
              <Radio key={x.id} value={x.id} colorScheme="blue" borderColor="gray.500">
                <Text casing="capitalize">{x.name}</Text>
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
    </div>
  );
};

const Colleges = (props: { onChangeCallback: React.Dispatch<React.SetStateAction<number | undefined>> }) => {
  const { colleges, isError, isLoading } = useGetColleges();

  return (
    <Container maxW="2xl">
      <Select
        placeholder={"Choose College"}
        onChange={(e) => {
          props.onChangeCallback(Number(e.target.value));
        }}
      >
        {colleges?.map((x) => {
          return (
            <option key={x.id} value={x.id}>
              {x.college_name}
            </option>
          );
        })}
      </Select>
    </Container>
  );
};
const PersonalSyllabus = (props: { onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>> }) => {
  const { profile } = useAuthContext();
  const { personalCourses, isError, isLoading } = useGetPersonalCourses(profile?.id!);
  const { setDisplayMode, setFormType } = useSyllabusContext();
  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = personalCourses!.find((c) => c.id === Number(e.target.value));
    props.onChangeCallback({
      bookId: x?.id!,
      bookName: x?.book_name!,
      colleges_fk: x?.colleges_fk,
      moderator: x?.moderator,
      syllabus_owner_fk: x?.syllabus_owner_fk,
      publication_fk: x?.publication_fk,
    });
    setDisplayMode("SYLLABUS");
    setFormType(undefined);
  };
  if (!profile) {
    return <Text fontSize={"smaller"}>**Login to view personal Syllabus</Text>;
  }
  return (
    <Container maxW="2xl">
      <Select
        placeholder={"Choose Personal Syllabus"}
        onChange={(e) => {
          handleChange(e);
        }}
      >
        {personalCourses?.map((x) => {
          return (
            <option key={x.id} value={x.id}>
              {x.book_name}
            </option>
          );
        })}
      </Select>
      {personalCourses?.length === 0 && (
        <Text fontSize={"smaller"}>You have no Personal Syllabus, Click on Add Button to Create Syllabus</Text>
      )}
    </Container>
  );
};
const CollegeCourses = (props: {
  collegeId: number;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  //states
  const { collegesCourses, isError, isLoading } = useGetCollegesCourses(props.collegeId);
  const { setDisplayMode, setFormType } = useSyllabusContext();

  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = collegesCourses!.find((c) => c.id === Number(e.target.value));
    const book = {
      bookId: x?.id!,
      bookName: x?.book_name!,
      colleges_fk: x?.colleges_fk,
      moderator: x?.moderator,
      syllabus_owner_fk: x?.syllabus_owner_fk,
      publication_fk: x?.publication_fk,
    };
    props.onChangeCallback(book);
    setDisplayMode("SYLLABUS");
    setFormType(undefined);
  };

  return (
    <Container maxW="2xl">
      <Select
        placeholder={"Choose Course"}
        onChange={(e) => {
          handleChange(e);
        }}
      >
        {collegesCourses?.map((x) => {
          return (
            <option key={x.id} value={x.id}>
              {x.book_name}
            </option>
          );
        })}
      </Select>
    </Container>
  );
};

const BookFilterNew = (props: {
  category: string;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  // const [value, setValue] = React.useState(props.category);
  const { data } = useGetBooks(Number(props.category));
  const { setDisplayMode, setFormType } = useSyllabusContext();
  // const { data: d } = useGetSyllabusByBookId(2);
  const [classList, setClassList] = React.useState<BookResponse[] | null>([]);
  const [selectedClass, setSelectedClass] = React.useState<number | undefined>();
  const [subjectList, setSubjectList] = React.useState<BookResponse[] | null>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<number | undefined>();
  const [bookList, setBookList] = React.useState<BookResponse[] | null>([]);
  const { setIsTagSearchActive, setBookResponse, bookResponse } = useNoteContext();
  const [bookid, setBookid] = useState<string | undefined>();

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

  return (
    <Box minW="full">
      <Stack direction={{ base: "column", md: "column", lg: "row" }}>
        <Select
          id="paper"
          placeholder={props.category === "7" ? "Select Exam" : "Select Class/Course"}
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
                  {props.category === "1" ? "Class " + x.class_fk!.class : x.class_fk!.class}
                </option>
              );
            })}
        </Select>
        <Select
          id="paper"
          placeholder={props.category === "7" ? "Select Paper" : "Select Subject"}
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
          placeholder={props.category === "7" ? "Select Syllabus" : "Select Book"}
          onChange={(e) => {
            setBookid(e.target.value);
            // setBookResponse(data?.find((item) => item.id === Number(e.target.value)));
            const x = data?.find((item) => item.id === Number(e.target.value));
            props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
            setIsTagSearchActive(false);
            setDisplayMode("SYLLABUS");
            setFormType(undefined);
            // navigateTo(e.target.value, "hello");
          }}
        >
          {bookList?.map((x) => {
            //can you ommit reuturn keyword? yes you can !by removing curly brace and semicolon ";"
            //https://stackoverflow.com/questions/50501047/one-line-arrow-functions-without-braces-cant-have-a-semicolon
            return (
              <option key={x.id} value={x.id}>
                {props.category === "1" ? x.book_name + " " + x.class_fk!.class : x.book_name}
              </option>
            );
          })}
        </Select>
      </Stack>
    </Box>
  );
};
export default BookFilterForMangeSyllabus;
