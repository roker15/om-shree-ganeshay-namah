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
// import * as React from "react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Column } from "react-table";
import styled from "styled-components";
import useSWR from "swr";
import { useGetExamPapers } from "../customHookes/useUser";
import SecondaryLayout from "../layout/LayoutWithTopNavbar";
import { supabase } from "../lib/supabaseClient";
import { Headings, Subheading } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
import ReactTable from "../components/ReactTable";
import { useAuthContext } from "../state/Authcontext";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

interface Data {
  idd: number;
  country: string;
  class: string;
}

interface tableProps {
  subheadings: Subheading[] | undefined | null;
}

const CreateSubheading: React.FC = () => {
  const { profile } = useAuthContext();
  const [selectedForEdit, setSelectedForEdit] = React.useState<
    Subheading | undefined
  >(undefined);
  const [activeIndex, setActiveIndex] = React.useState(1000);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [idSelectedTopic, setIdSelectedTopic] = React.useState<number>(-1000);

  const Table1: React.FC<tableProps> = ({ subheadings }) => {
    console.log("subheadings are ", subheadings);

    const [data, setData] = React.useState(
      React.useMemo(() => subheadings as Subheading[], [])
    );

    const columns: Column<Subheading>[] = React.useMemo(
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
              Header: "Topics",
              accessor: "topic",
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
                  .from<Subheading>("subheadings")
                  .delete()
                  .eq("id", data[tableProps.row.index].id);

                console.log("table props is ", tableProps);
                // ES6 Syntax use the rvalue if your data is an array.
                const dataCopy = [...(data as Subheading[])];
                // It should not matter what you name tableProps. It made the most sense to me.
                dataCopy.splice(tableProps.row.index, 1);
                setData(dataCopy);
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

                    if (document.getElementById("subheading")) {
                      (
                        document.getElementById(
                          "subheading"
                        ) as HTMLInputElement
                      ).value = data[tableProps.row.index]!.topic!;
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
                    const dataCopy = [...data];
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

  const { examPapers, isLoading, isError } = useGetExamPapers();

  const [paperId, setPaperId] = useState(undefined);
  const [headingId, setHeadingId] = useState(undefined);
  // const [shouldFetch, setShouldFetch] = React.useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  interface FormValues {
    subheading: string;
    heading: number;
    sequence: number;
  }
  async function onSubmit(values: any) {
    if (isEditMode == false) {
      const { data, error } = await supabase
        .from<Subheading>("subheadings")
        .insert({
          topic: values.subheading,
          main_topic_id: values.heading,
          sequence: values.sequence,
        });
      isSubmitting == false;

      if (data) {
        toast({
          title: "Date saved.",
          description: `New Topic----   '${data[0].topic}'   added`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }

    if (isEditMode == true) {
      const { data, error } = await supabase
        .from<Subheading>("subheadings")
        .update({
          // id:idSelectedTopic,
          topic: values.subheading,
          main_topic_id: values.heading,
          sequence: values.sequence,
        })
        .eq("id", idSelectedTopic);
      isSubmitting == false;
      setActiveIndex(1000);
      setIsEditMode(false);

      if (data) {
        toast({
          title: "Date saved.",
          description: `New Topic----   '${data[0].topic}'   updated`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  }

  const handlePaperChange = (event: any) => {
    setPaperId(event.target.value);
  };
  const handleHeadingChange = (event: any) => {
    setHeadingId(event.target.value);
  };

  const { data: headings } = useSWR(
    paperId === undefined ? null : [`/upsc/${paperId}`],
    async () =>
      await supabase
        .from<Headings>("headings")
        .select(
          `
  id,main_topic,paper_id
  
 `
        )
        .eq("paper_id", paperId)
  );

  const { data: subHeadings } = useSWR(
    headingId === undefined ? null : [`/upsc/${headingId}`],
    async () =>
      await supabase
        .from<Subheading>("subheadings")
        .select(
          `
  id,main_topic_id,topic,sequence
  
 `
        )
        .eq("main_topic_id", headingId),
    { refreshInterval: 1000 }
  );

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

  if (profile && profile.role === "MODERATOR") {
    return (
      <Container mt="2" maxW={{ base: "container.xl", md: "container.md" }}>
        {subHeadings !== undefined && subHeadings.data!.length > 0 ? (
          <Table1 subheadings={subHeadings?.data!} />
        ) : (
          <div></div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            // divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="center"
            py="3"
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
                onChange={handlePaperChange}
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
                Syllabus headiing
              </FormLabel>
              <Select
                id="heading"
                placeholder="Select Syllabus Heading"
                {...register("heading", {
                  required: "This is required",
                  // minLength: { value: 4, message: "Minimum length should be 4"  },
                })}
                onChange={handleHeadingChange}
              >
                {headings?.data?.map((x) => {
                  return (
                    <option key={x.id} value={x.id}>
                      {x.main_topic}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>
                {errors.heading && errors.heading.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.subheading}>
              <FormLabel color="blue.600" htmlFor="subheading">
                Syllabus subheading
              </FormLabel>
              <Input
                id="subheading"
                placeholder="Subheading"
                // value={
                //   selectedForEdit !== undefined ? selectedForEdit?.topic : ""
                // }
                {...register("subheading", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.subheading && errors.subheading.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.sequence}>
              <FormLabel color="blue.600" htmlFor="sequence">
                Subheading Sequence
              </FormLabel>
              <NumberInput id="sequenceIn" alignSelf="start" min={1} max={100}>
                <NumberInputField
                  id="sequence"
                  // value="9"
                  placeholder="Sequence"
                  {...register("sequence", {
                    required: "This is required",
                    min: {
                      value: 1,
                      message: "Minimum length should be 4",
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
                Create Topic
              </Button>
            ) : (
              <Button
                variant="solid"
                colorScheme="yellow"
                isLoading={isSubmitting}
                type="submit"
              >
                Update Topic
              </Button>
            )}
          </VStack>
        </form>
      </Container>
    );
  } else {
    return (
      <Center >
        <Alert
          status="warning"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          variant="left-accent"
        >
          <AlertIcon />
          You are not allowed to access this page
        </Alert>
      </Center>
    );
  }
};

(CreateSubheading as PageWithLayoutType).layout = SecondaryLayout;
export default CreateSubheading;
