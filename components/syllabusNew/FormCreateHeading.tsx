import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import {
  Button,
  Container,
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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { Database } from "../../lib/database";
import { elog } from "../../lib/mylog";
import { definitions } from "../../types/supabase";
import { FormProps } from "./CreateBookSyllabus";

interface Props {
  x: FormProps | undefined;
}
const FormCreateHeading: React.FC<Props> = ({ x }) => {
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

export default FormCreateHeading;
