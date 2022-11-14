import { Box, Container, IconButton, Input, Radio, RadioGroup, Select, Stack, Text, VStack } from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import {
  useGetBooks,
  useGetColleges,
  useGetCollegesCourses,
  useGetPersonalCourses,
  useGetSyllabusByBookId,
} from "../../customHookes/networkHooks";
import { Database } from "../../lib/database";
import { DeleteAlert } from "../../pages/manageSyllabusv2";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import { Book, useSyllabusContext } from "../../state/SyllabusContext";
import { BookResponse } from "../../types/myTypes";

const BookFilterContainer = () => {
  const [category, setCategory] = React.useState("7");
  const [selectedCollege, setSelectedCollege] = useState<number | undefined>(undefined);
  const [selectedCourse, setselectedCourse] = useState<Book | undefined>(undefined);
  const { setBook, book } = useSyllabusContext();

  return (
    <VStack bg="red.100" p="2" height="32">
      <Categories category={category} onChangeCallback={setCategory} />
      {category === "8" ? (
        <Stack direction={"row"}>
          <CollegeOptions onChangeCallback={setSelectedCollege} />
          {selectedCollege && <CollegeCourses collegeId={selectedCollege} onChangeCallback={setBook} />}
        </Stack>
      ) : category === "9" ? (
        <PersonalSyllabus onChangeCallback={setBook} />
      ) : (
        <BookFilterNew onChangeCallback={setBook} category={category} />
      )}
    </VStack>
  );
};
interface ICategory {
  category: string;
  onChangeCallback: React.Dispatch<React.SetStateAction<string>>;
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

const CollegeOptions = (props: { onChangeCallback: React.Dispatch<React.SetStateAction<number | undefined>> }) => {
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
  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = personalCourses!.find((c) => c.id === Number(e.target.value));
    props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
  };
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
      {personalCourses?.length === 0 && "You have no Personal syllabus"}
    </Container>
  );
};
const CollegeCourses = (props: {
  collegeId: number;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  //states
  const { collegesCourses, isError, isLoading } = useGetCollegesCourses(props.collegeId);

  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = collegesCourses!.find((c) => c.id === Number(e.target.value));
    props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
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
  // const { data: d } = useGetSyllabusByBookId(2);
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
            setBookResponse(data?.find((item) => item.id === Number(e.target.value)));
            const x = data?.find((item) => item.id === Number(e.target.value));
            props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
            setIsTagSearchActive(false);
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
export default BookFilterContainer;

interface ICollegeValue {
  action: "CREATE" | "UPDATE";
  college: { id?: number; name: string } | undefined;
}
const Colleges = (props: { onChangeCallback: React.Dispatch<React.SetStateAction<ICollegeValue | undefined>> }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const deleteHeading = async (id: number) => {
    const { error } = await supabaseClient.from("colleges").delete().eq("id", id);
    // mutate();
  };
  const { colleges } = useGetColleges();
  const collegeList = colleges?.map((x) => (
    <Stack direction="row" key={x.id}>
      <Text>{x.college_name}</Text>;<IconButton variant="ghost" size="xs" aria-label={"Edit"} icon={<MdEdit />}></IconButton>
      <DeleteAlert handleDelete={deleteHeading} dialogueHeader={"Delete Heading"} id={x.id} />{" "}
    </Stack>
  ));
  return <>{collegeList} </>;
};
interface IAddCollegeInputs {
  collegeName: string;
}
const CollegeCrud = (props: {
  collegeId: number;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  const [formType, setFormType] = useState<"ADD" | "UPDATE">("ADD");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddCollegeInputs>();
  const onSubmit: SubmitHandler<IAddCollegeInputs> = (data) => console.log(data);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* include validation with required or other standard HTML validation rules */}
      <Input placeholder="College Name" {...register("collegeName", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.collegeName && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
};

const CollegeCourseCrud = (props: {
  collegeId: number;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  //states
  const { collegesCourses, isError, isLoading } = useGetCollegesCourses(props.collegeId);

  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = collegesCourses!.find((c) => c.id === Number(e.target.value));
    props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
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
const PersonalSyllabusCrud = (props: {
  collegeId: number;
  onChangeCallback: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  //states
  const { collegesCourses, isError, isLoading } = useGetCollegesCourses(props.collegeId);

  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const x = collegesCourses!.find((c) => c.id === Number(e.target.value));
    props.onChangeCallback({ bookId: x?.id!, bookName: x?.book_name! });
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
