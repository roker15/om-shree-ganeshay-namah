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
import { useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { Database } from "../lib/database";
import { elog } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import PageWithLayoutType from "../types/pageWithLayout";
import { Data, Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
// import { Data1 } from "./api/prisma/posts/postCountbySyllabus";

export type SubheadingformProps = {
  formMode: "CREATE_SUBHEADING" | "UPDATE_SUBHEADING";
  id: number;
  subheading: string;
  sequence: number;
  heading_fk: number;
};
export type HeadingformProps = {
  formMode: "CREATE_HEADING" | "UPDATE_HEADING";
  id: number;
  heading: string;
  sequence: number;
  book_fk: number;
};

const ManageSyllabusv2: React.FunctionComponent = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [formMode, setFormMode] = useState<SubheadingformProps | HeadingformProps | undefined>(undefined);

  return (
    <Box>
      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
        <GridItem w="100%" bg="blue.100" colSpan={2}>
          <Syllabus />
        </GridItem>
        <GridItem w="100%" bg="blue.100" colSpan={3}>
          {(formMode as HeadingformProps).formMode === ("CREATE_HEADING" && "UPDATE_HEADING") && (
            <HeadingForm x={formMode as HeadingformProps} />
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

(ManageSyllabusv2 as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default ManageSyllabusv2;

const Syllabus = () => {
  const { profile } = useAuthContext();
  const user = useUser();
  const [selectedHeading, setselectedHeading] = useState<number | undefined>(undefined);
  const { data, swrError } = useGetSyllabusByBookId(40);
  const supabaseClient = useSupabaseClient<Database>();

  type Heading = { heading: string; books_fk: number; sequence: number };
  // const fetcher = async (x: Heading) => {
  //   const { error } = await supabaseClient
  //     .from("books_headings")
  //     .insert({ books_fk: x.books_fk, heading: x.heading, sequence: x.sequence });
  // };

  if (swrError) {
    return <Center h="100vh">{swrError.message}</Center>;
  }
  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && profile?.role === "ADMIN" && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text fontSize="lg" as="u">
              {data?.book_name}
            </Text>
            {/* <Button variant="solid" size="xs" onClick={() => setAction("CREATE_HEADING")}>
              {" "}
              Add Chapter
            </Button> */}
          </HStack>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => getHeadings(headings, setselectedHeading, selectedHeading))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};
interface IHeadingformProps {
  x: HeadingformProps;
}
const HeadingForm: React.FC<IHeadingformProps> = ({ x }) => {
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

      if (data) {
        //   mutate(`/book_id_syllabus/${x?.book_id}`);
        mutate([`/book_id_syllabuss/${x?.book_fk}`]);
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
      {/* <Text>{x?.book_name}</Text>
      <Text>{x?.formMode}</Text>
      <Text>{x?.book_id}</Text>
      <Text>{x?.heading_sequence}</Text> */}
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
interface ISubheadingformProps {
  x: SubheadingformProps;
}
const FormSubheading: React.FC<ISubheadingformProps> = ({ x }) => {
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
        subheading: values.subheadin,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (data) {
        //   mutate(`/book_id_syllabus/${x?.book_id}`);
        mutate([`/book_id_syllabuss/${x?.id}`]);
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
        .eq("id", x.id);
      if (error) {
        elog("FormCreateSubheading->onSubmit", error.message);
        return;
      }
      isSubmitting == false;

      if (data) {
        mutate([`/book_id_syllabuss/${x?.id}`]);
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
        {/* <Text>{x?.book_name}</Text>
        <Text>{x?.formMode}</Text>
        <Text>{x?.heading}</Text> */}
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
function getHeadings(
  headings: Data_headings,
  onChange: React.Dispatch<React.SetStateAction<number | undefined>>,
  value: number | undefined
): JSX.Element {
  return (
    <VStack key={Number(headings!.id!)} alignItems="left">
      <HStack alignItems={"baseline"} onClick={() => onChange(value !== headings.id ? headings.id : undefined)}>
        <IconButton icon={<MdEdit />} variant="ghost" size="xs" aria-label={""}></IconButton>
        <IconButton icon={<MdDelete />} variant="ghost" size="xs" aria-label={""}></IconButton>
        <Text as="b" casing={"capitalize"} cursor="pointer">
          {headings.heading}
        </Text>
        <Button variant="solid" size="xs">
          {" "}
          Add Topic
        </Button>
      </HStack>
      <VStack alignItems={"left"} pl="8" spacing="4">
        {headings.books_subheadings.map((subheading) => getSubheadings(subheading))}
      </VStack>
    </VStack>
  );
}

function getSubheadings(subheading: Data_subheadings): JSX.Element {
  return (
    <Flex key={subheading.id}>
      <IconButton icon={<MdDelete />} variant="ghost" size="xs" aria-label={""}></IconButton>
      <IconButton icon={<MdEdit />} variant="ghost" size="xs" aria-label={""}></IconButton>
      <Text fontSize={"sm"} casing={"capitalize"}>
        {subheading.subheading}
      </Text>
    </Flex>
  );
}
