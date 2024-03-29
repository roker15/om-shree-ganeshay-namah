import { Search2Icon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdEdit, MdLightMode } from "react-icons/md";
import { customToast } from "../componentv2/CustomToast";
import { LoginCard } from "../componentv2/LoginCard";
import { useGetSyllabusByBookId, useGetSyllabusModerator } from "../customHookes/apiHooks";
import { useGetColleges, useGetCollegesCourses, useGetPersonalCourses } from "../customHookes/networkHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { BASE_URL } from "../lib/constants";
import { Database } from "../lib/database";
import { elog } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import { HeadingformProps, SubheadingformProps, useSyllabusContext } from "../state/SyllabusContext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
import { DeleteAlert } from "../componentv2/DeleteAlert";
import { ArticleCounter } from "../componentv2/ArticleCounter";
import Drawer1 from "../componentv2/Drawer1";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";

const CHeading = (props: { children: React.ReactNode }) => {
  return <Heading color="gray.700">{props.children}</Heading>;
};

const SyllabusContainer: React.FunctionComponent = () => {
  const { formType, headingFormProps, subheadingFormProps, setFormType, book, displayMode, category } = useSyllabusContext();
  const { profile } = useAuthContext();
  const { data, isLoading } = useGetSyllabusModerator(book?.bookId);
  const isModerator = data?.some((x) => x.profiles?.id === profile?.id && x.is_active === true);
  const shudShow = (() => {
    if (displayMode === "PERSONAL_COURSE") {
      return true;
    } else if (isModerator) {
      return true;
    } else if (book?.syllabus_owner_fk === profile?.id) {
      return true;
    } else if (profile?.role === "ADMIN") {
      return true;
    }
    return false;
  })();

  if (isLoading) {
    return (
      <Center h="70vh">
        <Spinner />
      </Center>
    );
  }
  if (!profile) {
    return (
      <Center h="70vh">
        <LoginCard redirect={`${BASE_URL}/manageSyllabus`} />
      </Center>
    );
  }
  return (
    <>
      {book?.publication_fk !== 9 && profile.role === "ADMIN" && <ManageModerator />}

      {shudShow ? (
        <Box>
          {displayMode === "SYLLABUS" && (
            <Grid templateColumns={{ base: "repeat(6, 1fr)", lg: "repeat(9, 1fr)" }} gap={0.5}>
              <GridItem w="100%" colSpan={3} minH="100vh" bg="brand.50" display={{ base: "none", lg: "block" }}>
                {" "}
                <Syllabus />
              </GridItem>
              <GridItem w="100%" colSpan={6}>
                <>
                  <Box display={{ base: "block", lg: "none" }}>
                    <Drawer1 buttonText={"Syllabus"}>
                      <Syllabus />
                    </Drawer1>
                  </Box>

                  {formType === undefined && (
                    <Center h="60vh">
                      <CHeading>Select action from Left</CHeading>
                    </Center>
                  )}

                  {formType === "HEAD" && <HeadingForm x={headingFormProps} />}
                  {formType === "SUBHEAD" && <SubheadingForm x={subheadingFormProps} />}
                </>{" "}
              </GridItem>
            </Grid>
          )}
          {displayMode === "COLLEGE" && <CollegeContainer />}
          {displayMode === "COLLEGE_COURSE" && <CollegeCourseContainer />}
          {displayMode === "PERSONAL_COURSE" && <PrivateBookscontainer />}
        </Box>
      ) : book ? (
        <Center h="50vh">
          <VStack>
            <Text as="b" color="gray.50" bg="orange.500" px="2">
              {book.bookName}
            </Text>
            <CHeading>You are not Authorized to edit this Syllabus !</CHeading>
            <RequestManageSyllabus bookId={book.bookId} userId={profile.id} />
          </VStack>
        </Center>
      ) : (
        <Center h="50vh">
          <VStack>
            <CHeading>Select Syllabus from Top </CHeading>
          </VStack>
        </Center>
      )}
    </>
  );
};

(SyllabusContainer as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default SyllabusContainer;

const Syllabus: React.FunctionComponent = () => {
  const user = useUser();
  const { formType, setFormType, setHeadingFormProps, book } = useSyllabusContext();
  const { data, swrError } = useGetSyllabusByBookId(book?.bookId);

  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && (
        <VStack display="inline-block">
          <Flex bg="brand.50" alignItems={"baseline"} p="4" wrap="wrap">
            <Text fontSize="lg" as="u">
              {book!.bookName}
            </Text>
            <Button
              variant="solid"
              size="xs"
              onClick={() => {
                setFormType("HEAD");
                setHeadingFormProps({ formMode: "CREATE_HEADING", book_fk: book?.bookId });
              }}
            >
              {" "}
              Add Chapter
            </Button>
          </Flex>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
              <Headings key={headings.id} headings={headings} />
            ))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};
interface IHeadingformProps {
  x: HeadingformProps | undefined;
}
const HeadingForm: React.FC<IHeadingformProps> = ({ x }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { book } = useSyllabusContext();
  const { mutate } = useGetSyllabusByBookId(book?.bookId);
  interface FormValues {
    heading: string | undefined;
    sequence: number | undefined;
  }
  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (x && x?.formMode === "UPDATE_HEADING") {
      reset({
        heading: x.heading,
        sequence: x.sequence,
      });
    } else {
      setValue("heading", "");
      setValue("sequence", undefined);
    }
  }, [reset, setValue, x]);

  const toast = useToast();

  async function onSubmit(values: any) {
    if (x?.formMode === "CREATE_HEADING") {
      const { data, error } = await supabaseClient.from("books_headings").insert({
        books_fk: x?.book_fk,
        heading: values.heading,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (!error) {
        mutate();
        toast({
          title: "Data saved.",
          //   description: `New Topic----   '${data[0].main_topic}'   added`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }

    if (x?.formMode === "UPDATE_HEADING") {
      const { data, error } = await supabaseClient
        .from("books_headings")
        .update({
          heading: values.heading,
          sequence: values.sequence,
        })
        .eq("id", x.id);

      if (error) {
        elog("FormCreateHeading->onSubmit", error.message);
        return;
      }
      isSubmitting == false;

      if (!error) {
        mutate();
        toast({
          title: "Data updated.",
          //   description: `New Topic----   '${data[0].main_topic}'   updated`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  }

  return (
    <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
      <Heading mb="16">{x?.formMode === "CREATE_HEADING" ? "Create New Chapter" : "Edit Chapter"}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          // divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="center"
        >
          <FormControl isInvalid={errors.heading as any}>
            <FormLabel color="blue.600" htmlFor="heading">
              Syllabus heading
            </FormLabel>
            <Input
              id="heading"
              placeholder="Heading name"
              {...register("heading", {
                required: "This is required",
                minLength: {
                  value: 3,
                  message: "Minimum length should be 3",
                },
              })}
            />
            <FormErrorMessage>{errors.heading && errors.heading.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.sequence as any}>
            <FormLabel color="blue.600" htmlFor="sequence">
              Heading Sequence
            </FormLabel>
            <NumberInput alignSelf="start" min={1} max={100}>
              <NumberInputField
                id="sequence"
                placeholder="1, 2, 3 ..."
                {...register("sequence", {
                  required: "This is required",
                  min: {
                    value: 1,
                    message: "Minimum value should be 1",
                  },
                })}
              />
            </NumberInput>

            <FormErrorMessage>{errors.sequence && errors.sequence.message}</FormErrorMessage>
          </FormControl>

          <Button variant="solid" colorScheme="yellow" isLoading={isSubmitting} type="submit">
            {x?.formMode === "CREATE_HEADING" ? "Create Heading" : "Update Heading"}
          </Button>
        </VStack>
      </form>
    </Container>
  );
};
interface ISubheadingformProps {
  x: SubheadingformProps | undefined;
}
const SubheadingForm: React.FC<ISubheadingformProps> = ({ x }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const { book } = useSyllabusContext();
  const { mutate } = useGetSyllabusByBookId(book?.bookId);
  interface FormValues {
    subheading: string | undefined;
    sequence: number | undefined;
  }
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  useEffect(() => {
    if (x && x?.formMode === "UPDATE_SUBHEADING") {
      reset({
        subheading: x.subheading,
        sequence: x.sequence,
      });
    } else {
      setValue("subheading", "");
      setValue("sequence", undefined);
    }
  }, [reset, setValue, x]);
  const toast = useToast();

  async function onSubmit(values: any) {
    if (x?.formMode === "CREATE_SUBHEADING") {
      const { data, error } = await supabaseClient.from("books_subheadings").insert({
        books_headings_fk: x?.heading_fk!,
        subheading: values.subheading,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (!error) {
        mutate();
        toast({
          title: "Data saved.",
          //   description: `New Topic----   '${data[0].main_topic}'   added`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }

    if (x?.formMode === "UPDATE_SUBHEADING") {
      const { error } = await supabaseClient
        .from("books_subheadings")
        .update({
          subheading: values.subheading,
          sequence: values.sequence,
        })
        .eq("id", x.id);
      if (error) {
        elog("FormCreateSubheading->onSubmit", error.message);
        return;
      }
      isSubmitting == false;
      mutate();
      toast({
        title: "Data updated.",
        //   description: `New Topic----   '${data[0].main_topic}'   updated`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  if (profile) {
    return (
      <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
        <Heading mb="16">{x?.formMode === "CREATE_SUBHEADING" ? "Create Subheading" : "Edit Subheading"}</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            // divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="center"
          >
            {/* <FormControl isInvalid={errors.paper}>
              <FormLabel color="blue.600" htmlFor="paper">
                Exam paper
              </FormLabel>
              <Select
                id="paper"
                placeholder="Select Exam Paper"
                {...register("paper", {
                  required: "This is required",
                  // minLength: { value: 4, message: "Minimum length should be 4"  },
                })}
                onChange={handleChange}
              >
                {examPapers?.map((x) => {
                  return (
                    <option key={x.id} value={x.id}>
                      {x.paper_name}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>{errors.paper && errors.paper.message}</FormErrorMessage>
            </FormControl> */}

            <FormControl isInvalid={errors.subheading as any}>
              <FormLabel color="blue.600" htmlFor="heading">
                Subheading
              </FormLabel>
              <Input
                id="heading"
                placeholder="Heading"
                {...register("subheading", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>{errors.subheading && errors.subheading.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.sequence as any}>
              <FormLabel htmlFor="sequence">Subheading Sequence</FormLabel>
              <NumberInput alignSelf="start" min={1} max={600}>
                <NumberInputField
                  id="sequence"
                  placeholder="Sequence"
                  {...register("sequence", {
                    required: "This is required",
                    min: {
                      value: 1,
                      message: "Minimum length should be 1",
                    },
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormErrorMessage>{errors.sequence && errors.sequence.message}</FormErrorMessage>
            </FormControl>

            <Button variant="solid" colorScheme="yellow" isLoading={isSubmitting} type="submit">
              {x?.formMode === "CREATE_SUBHEADING" ? "Create Subheading" : "Update Subheading"}
            </Button>
          </VStack>
        </form>
      </Container>
    );
  } else {
    return (
      <Center>
        <Alert status="warning" alignItems="center" justifyContent="center" textAlign="center" variant="left-accent">
          <AlertIcon />
          You are not allowed to access this page
        </Alert>
      </Center>
    );
  }
};
interface IheadingsProps {
  headings: Data_headings;
}
const Headings: React.FunctionComponent<IheadingsProps> = ({ headings }) => {
  const { setFormType, setSubheadingFormProps, setHeadingFormProps, book } = useSyllabusContext();

  const { mutate } = useGetSyllabusByBookId(book?.bookId!);
  const supabaseClient = useSupabaseClient<Database>();
  const deleteHeading = async (id: number) => {
    const { error } = await supabaseClient.from("books_headings").delete().eq("id", id);
    mutate();
  };
  const [hide, setHide] = useState(true);
  return (
    <VStack key={Number(headings!.id!)} alignItems="left">
      <HStack alignItems={"baseline"}>
        <IconButton
          onClick={() => {
            setHide(!hide);
          }}
          variant="ghost"
          size="md"
          aria-label="Call Sage"
          icon={hide ? <MdAdd /> : <MdLightMode />}
        />
        <IconButton
          icon={<MdEdit />}
          onClick={() => {
            setFormType("HEAD");
            setHeadingFormProps({
              formMode: "UPDATE_HEADING",
              id: Number(headings!.id!),
              heading: headings?.heading!,
              sequence: headings?.sequence!,
            });
          }}
          variant="ghost"
          size="xs"
          aria-label={""}
        ></IconButton>
        <DeleteAlert handleDelete={deleteHeading} dialogueHeader={"Delete Heading"} id={headings.id} />
        <Text
          as="b"
          casing={"capitalize"}
          cursor="pointer"
          onClick={() => {
            setHide(!hide);
          }}
        >
          {headings.heading}
        </Text>
        <Button
          variant="solid"
          size="xs"
          onClick={() => {
            // setHide(!hide);
            setFormType("SUBHEAD");
            setSubheadingFormProps({ formMode: "CREATE_SUBHEADING", heading_fk: headings.id });
          }}
        >
          {" "}
          Add Topic
        </Button>
      </HStack>
      {!hide && (
        <VStack alignItems={"left"} pl="16" spacing="4">
          {headings.books_subheadings.map((subheading) => (
            <Subheading key={subheading.id} subheading={subheading} />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
interface IsubheadingProps {
  subheading: Data_subheadings;
}
const Subheading: React.FunctionComponent<IsubheadingProps> = ({ subheading }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { book } = useSyllabusContext();
  const { profile } = useAuthContext();
  const { mutate } = useGetSyllabusByBookId(book?.bookId!);
  const deleteSubheading = async (id: number) => {
    const { data, error } = await supabaseClient.from("books_subheadings").delete().eq("id", id);
    mutate();
  };
  const { setFormType, setSubheadingFormProps, setHeadingFormProps } = useSyllabusContext();
  return (
    <Flex key={subheading.id}>
      <DeleteAlert handleDelete={deleteSubheading} dialogueHeader={"Delete Subheading"} id={subheading.id} />
      <IconButton
        icon={<MdEdit />}
        variant="ghost"
        size="xs"
        aria-label={""}
        onClick={() => {
          setFormType("SUBHEAD");
          setSubheadingFormProps({
            formMode: "UPDATE_SUBHEADING",
            id: Number(subheading!.id!),
            subheading: subheading?.subheading!,
            sequence: subheading?.sequence!,
          });
        }}
      ></IconButton>
      <Text fontSize={"sm"} casing={"capitalize"}>
        {subheading.subheading}
      </Text>
      {/* {profile && profile.id &&  (
        <ArticleCounter subheadingId={subheading.id} creatorId={profile.id} />
      )} */}
    </Flex>
  );
};

interface ICollegeValue {
  action: "CREATE" | "UPDATE";
  formData: { id?: number | undefined; name: string };
}
export const CollegeContainer = () => {
  const [selectedCollege, setSelectedCollege] = useState<ICollegeValue | undefined>(undefined);
  return (
    <Container maxW="2xl">
      <Colleges onChangeCallback={setSelectedCollege} />
      {selectedCollege && <CollegeCrud data={selectedCollege} />}
    </Container>
  );
};

const Colleges = (props: { onChangeCallback: React.Dispatch<React.SetStateAction<ICollegeValue | undefined>> }) => {
  const { profile } = useAuthContext();
  const supabaseClient = useSupabaseClient<Database>();
  const deleteCollege = async (id: number) => {
    const { error } = await supabaseClient.from("colleges").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    mutate();
  };
  const handleEditClick = async (x: College) => {
    props.onChangeCallback({ action: "UPDATE", formData: { id: x.id, name: x.college_name! } });
  };
  const handleAddClick = async () => {
    props.onChangeCallback({ action: "CREATE", formData: { id: undefined, name: "" } });
  };
  interface College {
    id: number;
    college_name: string | null;
  }
  const { colleges, mutate } = useGetColleges();
  const collegeList = colleges
    ?.sort((a, b) => a.college_name!.localeCompare(b.college_name!, undefined, { sensitivity: "base" }))
    .map((x) => (
      <Stack direction="row" key={x.id}>
        <IconButton
          onClick={() => {
            handleEditClick(x);
          }}
          variant="ghost"
          size="xs"
          aria-label={"Edit"}
          icon={<MdEdit />}
        ></IconButton>
        <DeleteAlert handleDelete={deleteCollege} dialogueHeader={"Delete Heading"} id={x.id} />{" "}
        <Text>{x.college_name}</Text>;
      </Stack>
    ));
  return (
    <VStack alignItems="left">
      {collegeList}

      <Button size="md" onClick={() => handleAddClick()}>
        Add College
      </Button>
    </VStack>
  );
};

const CollegeCrud = (props: { data: ICollegeValue }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof props.data.formData>();
  const supabaseClient = useSupabaseClient<Database>();
  const { mutate } = useGetColleges();

  //form submit method
  const onSubmit: SubmitHandler<typeof props.data.formData> = async (data) => {
    const { error } = await supabaseClient.from("colleges").upsert({ id: props.data.formData.id, college_name: data.name });
    mutate();
  };

  // reset form data to new props value on props change
  useEffect(() => {
    reset({ name: props.data.formData.name });
  }, [reset, props]);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <Input placeholder="College Name" {...register("name", { required: true })} />
        {errors.name && <span>This field is required</span>}
        <Button type="submit" size="md">
          {props.data.action === "UPDATE" ? "Update" : "Add"}
        </Button>
      </VStack>
    </form>
  );
};
interface ICollegeCourseValue {
  action: "CREATE" | "UPDATE";
  formData: { id?: number | undefined; courseName: string; collegeid: number };
}
export const CollegeCourseContainer = () => {
  const [selectedCollege, setSelectedCollege] = useState<ICollegeCourseValue | undefined>(undefined);
  const [showForm, setShowform] = useState<boolean>(false);

  return (
    <Container maxW="2xl">
      <Courses onChangeCallback={setSelectedCollege} setShowFrom={setShowform} />
      {selectedCollege && showForm && <CollegeCourseCrud data={selectedCollege} />}
    </Container>
  );
};

const Courses = (props: {
  onChangeCallback: React.Dispatch<React.SetStateAction<ICollegeCourseValue | undefined>>;
  setShowFrom: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedCollege, setselectedCollege] = useState<number | undefined>(undefined);
  const { collegesCourses, isError, isLoading, mutate } = useGetCollegesCourses(selectedCollege);
  const { profile } = useAuthContext();

  const supabaseClient = useSupabaseClient<Database>();
  const deleteCourse = async (id: number) => {
    const { error } = await supabaseClient.from("books").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    mutate();
  };
  const handleEditClick = async (x: Course) => {
    props.setShowFrom(true);
    props.onChangeCallback({
      action: "UPDATE",
      formData: { id: x.id, courseName: x.courseName!, collegeid: selectedCollege! },
    });
  };
  const handleAddClick = async () => {
    props.setShowFrom(true);
    props.onChangeCallback({
      action: "CREATE",
      formData: { id: undefined, courseName: "", collegeid: selectedCollege! },
    });
  };
  interface Course {
    id: number;
    courseName: string | null;
  }
  const { colleges } = useGetColleges();
  const collegeList = colleges
    ?.sort((a, b) => a.college_name!.localeCompare(b.college_name!, undefined, { sensitivity: "base" }))
    .map((x) => (
      <option key={x.id} value={x.id}>
        {x.college_name}
      </option>
    ));
  const collegesCourseList = collegesCourses
    ?.sort((a, b) => a.book_name.localeCompare(b.book_name, undefined, { sensitivity: "base" }))
    .map((x) => (
      <Stack direction="row" key={x.id}>
        <IconButton
          onClick={() => {
            handleEditClick({ id: x.id, courseName: x.book_name });
          }}
          variant="ghost"
          size="xs"
          aria-label={"Edit"}
          icon={<MdEdit />}
        ></IconButton>
        <DeleteAlert handleDelete={deleteCourse} dialogueHeader={"Delete Heading"} id={x.id} /> <Text>{x.book_name}</Text>;
      </Stack>
    ));
  return (
    <VStack alignItems="left">
      <Select
        placeholder={"Select College"}
        onChange={(e) => {
          setselectedCollege(Number(e.target.value));
          props.setShowFrom(false);
        }}
      >
        {collegeList}{" "}
      </Select>
      {collegesCourseList}
      {!!selectedCollege && (
        <Button size="md" onClick={() => handleAddClick()}>
          Add New Course
        </Button>
      )}
    </VStack>
  );
};

const CollegeCourseCrud = (props: { data: ICollegeCourseValue }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof props.data.formData>();
  const supabaseClient = useSupabaseClient<Database>();
  const { mutate } = useGetCollegesCourses(props.data.formData.collegeid);

  //form submit method
  const onSubmit: SubmitHandler<typeof props.data.formData> = async (data) => {
    const { error } = await supabaseClient
      .from("books")
      .upsert({ id: props.data.formData.id, book_name: data.courseName, colleges_fk: props.data.formData.collegeid });
    if (error) {
      alert(error.message);
    }
    mutate();
  };

  // reset form data to new props value on props change
  useEffect(() => {
    reset({ courseName: props.data.formData.courseName });
  }, [reset, props]);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <Input placeholder="Course Name" {...register("courseName", { required: true })} />
        {errors.courseName && <span>This field is required</span>}
        <Button size="md" type="submit">
          {props.data.action === "UPDATE" ? "Update Course" : "Add Course"}
        </Button>
      </VStack>
    </form>
  );
};

//Persnal Syllabus

interface IPrivateBookscontainer {
  action: "CREATE" | "UPDATE";
  formData: { id?: number | undefined; name: string };
}
export const PrivateBookscontainer = () => {
  const [selectedBook, setSelectedBook] = useState<IPrivateBookscontainer | undefined>(undefined);
  return (
    <Container maxW="2xl">
      <PrivateBookList onChangeCallback={setSelectedBook} />
      {selectedBook && <PrivateBooksCrud data={selectedBook} />}
    </Container>
  );
};

const PrivateBookList = (props: {
  onChangeCallback: React.Dispatch<React.SetStateAction<IPrivateBookscontainer | undefined>>;
}) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const deleteBook = async (id: number) => {
    const { error } = await supabaseClient.from("books").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    mutate();
  };
  const handleEditClick = async (x: College) => {
    props.onChangeCallback({ action: "UPDATE", formData: { id: x.id, name: x.book_name! } });
  };
  const handleAddClick = async () => {
    props.onChangeCallback({ action: "CREATE", formData: { id: undefined, name: "" } });
  };
  interface College {
    id: number;
    book_name: string | null;
  }
  const { personalCourses, mutate } = useGetPersonalCourses(profile?.id);
  const personalBookList = personalCourses
    ?.sort((a, b) => a.book_name.localeCompare(b.book_name, undefined, { sensitivity: "base" }))
    .map((x) => (
      <HStack spacing="4" key={x.id}>
        <IconButton
          onClick={() => {
            handleEditClick({ id: x.id, book_name: x.book_name });
          }}
          variant="ghost"
          size="xs"
          aria-label={"Edit"}
          icon={<MdEdit />}
        ></IconButton>
        <DeleteAlert handleDelete={deleteBook} dialogueHeader={"Delete Heading"} id={x.id} /> <Text>{x.book_name}</Text>;
      </HStack>
    ));
  return (
    <Box bg="gray.50" p="4">
      <VStack alignItems="left">
        <Text as="label">**Your Private Syllabus is only visible to you</Text>
        <Text as="b" fontSize="large">
          You have {personalBookList?.length} Private Syllabus
        </Text>
        {personalBookList}
        <Button size="md" onClick={() => handleAddClick()}>
          Add New Syllabus
        </Button>
      </VStack>
    </Box>
  );
};

const PrivateBooksCrud = (props: { data: IPrivateBookscontainer }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof props.data.formData>();
  const { profile } = useAuthContext();
  const supabaseClient = useSupabaseClient<Database>();
  const { mutate } = useGetPersonalCourses(profile?.id);

  //form submit method
  const onSubmit: SubmitHandler<typeof props.data.formData> = async (data) => {
    const { error } = await supabaseClient
      .from("books")
      .upsert({ id: props.data.formData.id, book_name: data.name, syllabus_owner_fk: profile?.id, publication_fk: 9 });
    mutate();
  };

  // reset form data to new props value on props change
  useEffect(() => {
    reset({ name: props.data.formData.name });
  }, [reset, props]);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <Input placeholder="Syllabus Name" {...register("name", { required: true })} />
        {errors.name && <span>This field is required**</span>}
        <Button size="md" type="submit">
          {props.data.action === "UPDATE" ? "Update" : "Create"}
        </Button>
      </VStack>
    </form>
  );
};

// manage syllabus moderators

const ManageModerator = () => {
  const { book } = useSyllabusContext();

  return (
    <Container minW="full" mb="16">
      <VStack alignItems="start">
        {book && <Moderators bookId={book?.bookId} />}
        <br />
        {book && <SearchUser bookId={book?.bookId} />}
      </VStack>
    </Container>
  );
};

const SearchUser = (props: { bookId: number }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [user, setuser] = useState<{ id: string; email: string | null } | undefined>();
  const { mutate } = useGetSyllabusModerator(props.bookId);

  const getModerator = async (email: string | undefined) => {
    const { data, error } = await supabaseClient.from("profiles").select(`id,email`).eq("email", email).single();
    if (error) {
      alert(error.message);
      return;
    }
    setuser(data);
  };
  const addModerator = async () => {
    const { data: d, error: e } = await supabaseClient
      .from("syllabus_moderator")
      .select()
      .eq("book_fk", props.bookId)
      .eq("moderator_fk", user!.id!);
    if (e) {
      alert(e.message);
    }
    if (d?.length !== 0) {
      alert("Already a moderator of this Syllabus");
      setuser(undefined);
      return;
    }

    const { error } = await supabaseClient
      .from("syllabus_moderator")
      .insert({ book_fk: props.bookId, is_active: false, moderator_fk: user!.id! });
    if (error) {
      alert(error.message);
      return;
    }
    mutate();
    setuser(undefined);
  };

  return (
    <VStack>
      <SearchBox placeholder={"Search user by Email to add more Moderator"} changeValueCallback={getModerator} />
      {user && (
        <Box>
          {" "}
          {user?.email} <Button onClick={() => addModerator()}> Make moderator</Button>{" "}
        </Box>
      )}
    </VStack>
  );
};

export const SearchBox = (props: { placeholder: string; changeValueCallback: (x: string | undefined) => void }) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e?: any) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    props.changeValueCallback(value);
  };

  return (
    <Container px="-0.5" maxW="2xl">
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            size="md"
            bg="blue.100"
            focusBorderColor="brand.50"
            borderRadius="full"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={props.placeholder}
          />

          <InputRightElement>
            <Search2Icon onClick={() => handleSubmit()} _hover={{ cursor: "pointer" }} />
          </InputRightElement>
        </InputGroup>
      </form>
    </Container>
  );
};

export const Moderators = (props: { bookId: number }) => {
  const { data, mutate, isLoading } = useGetSyllabusModerator(props.bookId);
  const supabaseClient = useSupabaseClient<Database>();
  const handleDelete = async (id: number) => {
    const { error } = await supabaseClient.from("syllabus_moderator").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    mutate();
  };
  return (
    <VStack alignItems="left">
      <Text as="b">Syllabus Moderators</Text>
      {isLoading && <Spinner />}
      {data &&
        data.length !== 0 &&
        data
          .sort((a, b) => a.profiles!.email!.localeCompare(b.profiles!.email!, undefined, { sensitivity: "base" }))
          .map((x) => {
            return (
              <HStack key={x.id} spacing="4">
                <DeleteAlert handleDelete={handleDelete} dialogueHeader={"Delete Moderator"} id={x.id} />
                <Activate id={x.id} activeState={x.is_active} bookId={props.bookId} />
                <Text>{x.profiles?.email} </Text>
              </HStack>
            );
          })}
      {data && data.length === 0 && (
        <Text as="label" bg="blue.100">
          No Moderator Assigned
        </Text>
      )}
    </VStack>
  );
};
export const RequestManageSyllabus = (props: { bookId: number; userId: string }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const askPermission = async () => {
    const { data, error } = await supabaseClient
      .from("syllabus_moderator")
      .select()
      .eq("book_fk", props.bookId)
      .eq("moderator_fk", props.userId);
    if (error) {
      alert(error.message);
      return;
    }
    if (data && data.length !== 0) {
      customToast({ title: "Already requested", status: "success" });
      return;
    }

    const { error: e } = await supabaseClient
      .from("syllabus_moderator")
      .insert({ book_fk: props.bookId, moderator_fk: props.userId, is_active: false });
    if (e) {
      alert(e.message);
      return;
    }
    customToast({ title: "Request sent", status: "success" });
    // mutate();
  };

  return (
    <VStack alignItems="left">
      <Button size="md" onClick={() => askPermission()}>
        Request Permission
      </Button>
    </VStack>
  );
};
export const Activate = (props: { id: number; activeState: boolean; bookId: number }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [isLoading, setisLoading] = useState(false);
  const { mutate } = useGetSyllabusModerator(props.bookId);
  const changeActiveState = async () => {
    setisLoading(true);
    const { data, error } = await supabaseClient
      .from("syllabus_moderator")
      .update({ is_active: !props.activeState })
      .eq("id", props.id)
      .select();
    if (error) {
      alert(error.message);
      return;
    }
    mutate().then(() => {
      setisLoading(false);
    });
  };

  return (
    <>
      <Button isLoading={isLoading} onClick={() => changeActiveState()}>
        {props.activeState ? "Deactivate" : "Activate"}
      </Button>
    </>
  );
};
