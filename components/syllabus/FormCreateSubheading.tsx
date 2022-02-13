import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  CloseButton,
  Container,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { useGetExamPapers } from "../../customHookes/useUser";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { Headings } from "../../types/myTypes";
import { definitions } from "../../types/supabase";
import { FormProps } from "./CreateBookSyllabus";

interface Props {
  x: FormProps | undefined;
}
const FormCreateSubheading: React.FC<Props> = ({ x }) => {
  //this is customhooks using swr, it can be used in any component
  // The most beautiful thing is that there will be only 1 request sent to the API,
  // because they use the same SWR key and the request is deduped, cached and shared automatically.
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
      console.log("form values are ", { values }, x.heading_id);
      const { data, error } = await supabase.from<definitions["books_subheadings"]>("books_subheadings").insert({
        books_headings_fk: x?.heading_id,
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
      const { data, error } = await supabase
        .from<definitions["books_subheadings"]>("books_subheadings")
        .update({
          subheading: values.subheading,
          sequence: values.sequence,
        })
        .eq("id", x.subheading_id);
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

  if (!profile) {
    return (
      <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
        <Text>{x?.book_name}</Text>
        <Text>{x?.formMode}</Text>
        <Text>{x?.book_id}</Text>
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
              <FormLabel color="blue.600" htmlFor="sequence">
                Subheading Sequence
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

export default FormCreateSubheading;
