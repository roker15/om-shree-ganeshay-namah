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
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useForm, useFormState } from "react-hook-form";
import { Column } from "react-table";
import useSWR from "swr";
import { useGetExamPapers } from "../customHookes/useUser";
import SecondaryLayout from "../layout/LayoutWithTopNavbar";
import { supabase } from "../lib/supabaseClient";
import { Headings } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import  ReactTable  from "../components/ReactTable";

interface tableProps {
  headings: Headings[] | undefined | null;
}

const Basic: React.FC = () => {
  //this is customhooks using swr, it can be used in any component
  // The most beautiful thing is that there will be only 1 request sent to the API,
  // because they use the same SWR key and the request is deduped, cached and shared automatically.

  const { examPapers, isLoading, isError } = useGetExamPapers();

  const [selectedForEdit, setSelectedForEdit] = React.useState<
    Headings | undefined
  >(undefined);
  const [activeIndex, setActiveIndex] = React.useState(1000);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [idSelectedTopic, setIdSelectedTopic] = React.useState<number>(-1000);
  const [paperId, setPaperId] = React.useState(undefined);

  const Table1: React.FC<tableProps> = ({ headings }) => {
    console.log("subheadings are ", headings);

    const [data, setData] = React.useState(
      React.useMemo(() => headings as Headings[], [])
    );

    const columns: Column<Headings>[] = React.useMemo(
      () => [
        {
          Header: "Topic Lists",
          columns: [
            {
              Header: "Id",
              accessor: "id",
              // sortType: 'basic'
            },
            {
              Header: "Heading",
              accessor: "main_topic",
              // sortType: 'basic'
            },
            {
              Header: "Sequence",
              accessor: "sequence",
              // sortType: 'basic'
            },
          ],
        },

        {
          Header: "Delete",

          id: "delete",
          accessor: (str) => "delete",

          Cell: (tableProps: any) => (
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={async () => {
                const result = await supabase
                  .from<Headings>("headings")
                  .delete()
                  .eq("id", data[tableProps.row.index].id);
              }}
            >
              Delete
            </span>
          ),
        },
        {
          Header: "Edit",

          id: "edit",
          accessor: (str) => "edit",

          Cell: (tableProps: any) =>
            activeIndex === 1000 ? (
              <div>
                {" "}
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    //   textDecoration: "underline overline wavy blue",
                  }}
                  onClick={() => {
                    setActiveIndex(tableProps.row.index);
                    setSelectedForEdit(data[tableProps.row.index]);
                    setIdSelectedTopic(data[tableProps.row.index].id);
                    setIsEditMode(true);

                    if (document.getElementById("Headings")) {
                      (
                        document.getElementById("Headings") as HTMLInputElement
                      ).value = data[tableProps.row.index]!.main_topic!;
                    }

                    if (document.getElementById("sequence")) {
                      console.log(
                        "current seq is ",
                        String(data[tableProps.row.index].sequence)
                      );

                      (
                        document.getElementById("sequence") as HTMLInputElement
                      ).defaultValue = String(
                        data[tableProps.row.index].sequence
                      );
                    }
                    {
                      console.log("table props is ", tableProps);
                    }
                    // ES6 Syntax use the rvalue if your data is an array.
                    // const dataCopy = [...data];
                  }}
                >
                  Edit
                </span>
              </div>
            ) : activeIndex === tableProps.row.index ? (
              //    <div>hi</div>

              <div>
                <span> </span>

                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    //   textDecoration: "underline",
                  }}
                  onClick={() => {
                    setActiveIndex(1000);
                    setIsEditMode(false);
                    {
                      console.log("table props is ", tableProps);
                    }
                  }}
                >
                  Cancel Edit
                </span>
              </div>
            ) : (
              <div></div>
            ),
            

          //   },
        },
      ],
      [data]
    );

    return (
      // <Styles>
      <ReactTable columns={columns} data={data} />
      // </Styles>
    );
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  interface FormValues {
    heading: string;
    paper: number;
    sequence: number;
  }
  async function onSubmit1(values: FormValues) {
    const { data, error } = await supabase.from<Headings>("headings").insert({
      main_topic: values.heading,
      paper_id: values.paper,
      sequence: values.sequence,
    });
    isSubmitting == false;
  }

  async function onSubmit(values: FormValues) {
    if (isEditMode == false) {
      const { data, error } = await supabase.from<Headings>("headings").insert({
        main_topic: values.heading,
        paper_id: values.paper,
        sequence: values.sequence,
      });
      isSubmitting == false;

      if (data) {
        toast({
          title: "Date saved.",
          description: `New Topic----   '${data[0].main_topic}'   added`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }

    if (isEditMode == true) {
      const { data, error } = await supabase
        .from<Headings>("headings")
        .update({
          // id:idSelectedTopic,
          // topic: values.heading,
          main_topic: values.heading,
          // paper_id: values.paper,
          sequence: values.sequence,
        })
        .eq("id", idSelectedTopic);
      // isSubmitting == false;
      setActiveIndex(1000);
      setIsEditMode(false);

      if (data) {
        toast({
          title: "Date saved.",
          description: `New Topic----   '${data[0].main_topic}'   updated`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  }

  const handleChange = (event: any) => {
    setPaperId(event.target.value);
  };

  const { data: headings } = useSWR(
    paperId === undefined ? null : [`/upsc/${paperId}`],
    async () =>
      await supabase
        .from<Headings>("headings")
        .select(
          `
  id,main_topic,paper_id,sequence
  
 `
        )
        .eq("paper_id", paperId),
    { refreshInterval: 1000 }
  );

  function validateName(value: any) {
    let error;
    if (!value) {
      error = "Name is required";
    }

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
    <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
      {headings !== undefined && headings.data!.length > 0 ? (
        <Table1 headings={headings?.data!} />
      ) : (
        <div></div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          // divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="center"
        >
          <FormControl isInvalid={errors.paper}>
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
            <FormErrorMessage>
              {errors.paper && errors.paper.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.heading}>
            <FormLabel color="blue.600" htmlFor="heading">
              Syllabus heading
            </FormLabel>
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

            <FormErrorMessage>
              {errors.sequence && errors.sequence.message}
            </FormErrorMessage>
          </FormControl>

          {isEditMode === false ? (
            <Button
              variant="solid"
              colorScheme="yellow"
              isLoading={isSubmitting}
              type="submit"
            >
              Create Heading
            </Button>
          ) : (
            <Button
              variant="solid"
              colorScheme="yellow"
              isLoading={isSubmitting}
              type="submit"
            >
              Update Heading
            </Button>
          )}
        </VStack>
      </form>
    </Container>
  );
};

(Basic as PageWithLayoutType).layout = SecondaryLayout;
export default Basic;
