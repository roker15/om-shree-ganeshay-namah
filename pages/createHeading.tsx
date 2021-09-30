import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
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
  Select,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useForm, useFormState } from "react-hook-form";
import { useGetExamPapers } from "../customHookes/useUser";
import SecondaryLayout from "../layout/LayoutWithTopNavbar";
import { supabase } from "../lib/supabaseClient";
import { Headings } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";

const Basic: React.FC = () => {
  //this is customhooks using swr, it can be used in any component
  // The most beautiful thing is that there will be only 1 request sent to the API,
  // because they use the same SWR key and the request is deduped, cached and shared automatically.

  const { examPapers, isLoading, isError } = useGetExamPapers();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  interface FormValues {
    heading: string;
    paper: number;
    sequence:number
  }
  async function onSubmit(values: FormValues) {
    const { data, error } = await supabase
      .from<Headings>("headings")
      .insert({ main_topic: values.heading, paper_id: values.paper ,sequence:values.sequence});
    isSubmitting == false;
  }

  const handleChange = (event: any) => {
    // setPaperId(event.target.value);
  };

  function validateName(value: any) {
    let error;
    if (!value) {
      error = "Name is required";
    }
    // else if (value.toLowerCase() !== "cccc") {
    //   error = "Jeez! You're not a fan 😱";
    // }
    return error;
  }

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (isError)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>There is some Problem!</AlertTitle>
        <AlertDescription>Please Try again after sometime.</AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );

  return (
    <Container mt="20" maxW={{ base: "container.xl", md: "container.md" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          // divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="center"
        >
          <FormControl isInvalid={errors.paper}>
            <FormLabel color="blue.600" htmlFor="paper">Exam paper</FormLabel>
            <Select
              id="paper"
              placeholder="Select Exam Paper"
              {...register("paper", {
                required: "This is required",
                // minLength: { value: 4, message: "Minimum length should be 4"  },
              })}
              // onChange={handleChange}
            >
              {examPapers?.map((x) => {
                return (
                  <option key={x.id} value={x.id}>
                    {x.paper_name}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              {errors.paper && errors.paper.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.heading}>
            <FormLabel color="blue.600" htmlFor="heading">Syllabus heading</FormLabel>
            <Input
              id="heading"
              placeholder="Heading"
              {...register("heading", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.heading && errors.heading.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.sequence}>
            <FormLabel color="blue.600" htmlFor="sequence">Heading Sequence</FormLabel>
            <NumberInput alignSelf="start"  min={1} max={100}>
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

            <FormErrorMessage>
              {errors.sequence && errors.sequence.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            variant="outline"
            mt={4}
            colorScheme="gray"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

(Basic as PageWithLayoutType).layout = SecondaryLayout;
export default Basic;
