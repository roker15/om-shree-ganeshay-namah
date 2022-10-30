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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { mutate } from "swr";
import { FormProps } from "../components/syllabus/CreateBookSyllabus";
import { useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { elog } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";

export type FormMode = "heading_new" | "heading_edit" | "subheading_new" | "subheading_edit";
const ManageSyllabusv2: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  return <Box minW="full">{user && profile?.role === "ADMIN" && <Syllabus />} </Box>;
};

(ManageSyllabusv2 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv2;

const Syllabus = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [selectedHeading, setselectedHeading] = useState<number | undefined>(undefined);
  const { data, swrError } = useGetSyllabusByBookId(40);
  const [action, setAction] = useState<FormMode | undefined>(undefined);
  const supabaseClient = useSupabaseClient<Database>();

  type Heading = { heading: string; books_fk: number; sequence: number };
  const fetcher = async (x: Heading) => {
    const { error } = await supabaseClient
      .from("books_headings")
      .insert({ books_fk: x.books_fk, heading: x.heading, sequence: x.sequence });
  };

  if (swrError) {
    return <Center h="100vh">{swrError.message}</Center>;
  }
  return (
    <Box maxW="xl" p="2" bg="brand.50">
      {user && profile?.role === "ADMIN" && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text fontSize="lg" as="u">
              {data?.book_name}
            </Text>
            <Button variant="solid" size="xs" onClick={() => setAction("heading_new")}>
              {" "}
              Add Chapter
            </Button>
          </HStack>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
              <VStack key={headings.id} alignItems="left">
                <HStack
                  alignItems={"baseline"}
                  onClick={() => setselectedHeading(selectedHeading !== headings.id ? headings.id : undefined)}
                >
                  <IconButton
                    onClick={() =>
                      fetcher({
                        books_fk: Number(headings.books?.id),
                        heading: headings.heading!,
                        sequence: Number(headings.sequence!),
                      })
                    }
                    icon={<MdEdit />}
                    variant="ghost"
                    size="xs"
                    aria-label={""}
                  ></IconButton>
                  <Text as="b" casing={"capitalize"} cursor="pointer">
                    {headings.heading}
                  </Text>
                  <Button variant="solid" size="xs">
                    {" "}
                    Add Topic
                  </Button>
                </HStack>
                <VStack alignItems={"left"} pl="8" spacing="4">
                  {headings.books_subheadings.map((subheading) => (
                    <Flex key={subheading.id}>
                      <IconButton icon={<MdDelete />} variant="ghost" size="xs" aria-label={""}></IconButton>
                      <IconButton icon={<MdEdit />} variant="ghost" size="xs" aria-label={""}></IconButton>
                      <Text fontSize={"sm"} casing={"capitalize"}>
                        {subheading.subheading}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </VStack>
            ))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};

interface Props {
  x: FormProps | undefined;
}
const HeadingForm: React.FC<Props> = ({ x }) => {
  const supabaseClient = useSupabaseClient<Database>();
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
      //   setValue("heading", x.heading), { shouldValidate: true };;
      //   setValue("sequence", x.heading_sequence, { shouldValidate: true });
      reset({
        heading: x.heading,
        sequence: x.heading_sequence,
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
        books_fk: x?.book_id,
        heading: values.heading,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (data) {
        //   mutate(`/book_id_syllabus/${x?.book_id}`);
        mutate([`/book_id_syllabuss/${x?.book_id}`]);
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
        .eq("id", x.heading_id);

      if (error) {
        elog("FormCreateHeading->onSubmit", error.message);
        return;
      }
      isSubmitting == false;

      if (data) {
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
      <Text>{x?.book_name}</Text>
      <Text>{x?.formMode}</Text>
      <Text>{x?.book_id}</Text>
      <Text>{x?.heading_sequence}</Text>
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
              placeholder="Heading"
              {...register("heading", {
                required: "This is required",
                minLength: {
                  value: 4,
                  message: "Minimum length should be 4",
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
            {x?.formMode === "CREATE_HEADING" ? "Create Heading" : "Update Heading"}
          </Button>
        </VStack>
      </form>
    </Container>
  );
};
interface Props {
  x: FormProps | undefined;
}
const FormSubheading: React.FC<Props> = ({ x }) => {
  //this is customhooks using swr, it can be used in any component
  // The most beautiful thing is that there will be only 1 request sent to the API,
  // because they use the same SWR key and the request is deduped, cached and shared automatically.
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();

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
      // setValue("subheading", x.subheading,{ shouldValidate: true });
      // setValue("sequence", x.subheading_sequence, { shouldValidate: true });
      reset({
        subheading: x.subheading,
        sequence: x.subheading_sequence,
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
        books_headings_fk: x?.heading_id!,
        subheading: values.subheading,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (data) {
        //   mutate(`/book_id_syllabus/${x?.book_id}`);
        mutate([`/book_id_syllabuss/${x?.book_id}`]);
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
      const { data, error } = await supabaseClient
        .from("books_subheadings")
        .update({
          subheading: values.subheading,
          sequence: values.sequence,
        })
        .eq("id", x.subheading_id);
      if (error) {
        elog("FormCreateSubheading->onSubmit", error.message);
        return;
      }
      isSubmitting == false;

      if (data) {
        mutate([`/book_id_syllabuss/${x?.book_id}`]);
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

  if (profile) {
    return (
      <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
        <Text>{x?.book_name}</Text>
        <Text>{x?.formMode}</Text>
        <Text>{x?.heading}</Text>
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
