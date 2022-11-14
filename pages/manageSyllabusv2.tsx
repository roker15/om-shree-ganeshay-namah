import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { elog } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import { HeadingformProps, SubheadingformProps, useSyllabusContext } from "../state/SyllabusContext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";


const CHeading = (props: { children: React.ReactNode }) => {
  return <Heading color="gray.700">{props.children}</Heading>;
};

const SyllabusContainer: React.FunctionComponent = () => {
  const { formType, headingFormProps, subheadingFormProps, setFormType, book } = useSyllabusContext();
  // undefined;
  return (
    <Box>
      <Grid templateColumns="repeat(6, 1fr)" gap={2}>
        <GridItem w="100%" colSpan={2} minH="100vh" bg="brand.50">
          <Syllabus />
        </GridItem>
        <GridItem w="100%" colSpan={4}>
          {formType === undefined && (
            <Center h="60vh">
              <CHeading>Select action from Left</CHeading>
            </Center>
          )}
          {formType === "HEAD" && <HeadingForm x={headingFormProps} />}
          {formType === "SUBHEAD" && <SubheadingForm x={subheadingFormProps} />}
        </GridItem>
      </Grid>
    </Box>
  );
};

(SyllabusContainer as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default SyllabusContainer;

const Syllabus: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const { formType, setFormType, setHeadingFormProps, book } = useSyllabusContext();
  const { data, swrError } = useGetSyllabusByBookId(book!);

  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && profile?.role === "ADMIN" && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
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
          </HStack>
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
  const { mutate } = useGetSyllabusByBookId(book!);
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
  const { mutate } = useGetSyllabusByBookId(book!);
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

  const { mutate } = useGetSyllabusByBookId(book!);
  const supabaseClient = useSupabaseClient<Database>();
  const deleteHeading = async (id: number) => {
    const { error } = await supabaseClient.from("books_headings").delete().eq("id", id);
    mutate();
  };
  return (
    <VStack key={Number(headings!.id!)} alignItems="left">
      <HStack alignItems={"baseline"}>
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
        <Text as="b" casing={"capitalize"} cursor="pointer">
          {headings.heading}
        </Text>
        <Button
          variant="solid"
          size="xs"
          onClick={() => {
            setFormType("SUBHEAD");
            setSubheadingFormProps({ formMode: "CREATE_SUBHEADING", heading_fk: headings.id });
          }}
        >
          {" "}
          Add Topic
        </Button>
      </HStack>
      <VStack alignItems={"left"} pl="16" spacing="4">
        {headings.books_subheadings.map((subheading) => (
          <Subheading key={subheading.id} subheading={subheading} />
        ))}
      </VStack>
    </VStack>
  );
};
interface IsubheadingProps {
  subheading: Data_subheadings;
}
const Subheading: React.FunctionComponent<IsubheadingProps> = ({ subheading }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { book } = useSyllabusContext();
  const { mutate } = useGetSyllabusByBookId(book!);
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
    </Flex>
  );
};

interface AlertdialogueProps {
  handleDelete: (id: number) => Promise<void>;
  dialogueHeader: string;
  id: number;
}

export const DeleteAlert = ({ handleDelete, dialogueHeader, id }: AlertdialogueProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const confirmDelete = () => {
    handleDelete(id);
    onClose();
  };

  return (
    <>
      <IconButton size="xs" variant="ghost" aria-label="Call Sage" onClick={() => setIsOpen(true)} icon={<MdDelete />} />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader p="2" bg="gray.100">
              {dialogueHeader}
            </AlertDialogHeader>

            <AlertDialogBody py="8">Are you sure? You can`t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => confirmDelete()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
