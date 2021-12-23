import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Spacer } from "@chakra-ui/layout";
import { Center, FormControl, FormLabel, HStack, Select, Text } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// now recommend to always use the mutate returned from the useSWRConfig hook:
import { mutate } from "swr";
import { useGetExamPapers, useGetQuestionsByPaperidAndYear, useSubheadingByPaperId } from "../customHookes/useUser";
import { supabase } from "../lib/supabaseClient";
import { QuestionBank } from "../types/myTypes";
// import Suneditor from "../components/Suneditor";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IFormInput {
  // id: number,
  //   created_at: string,
  //   updated_at: string,
  paperId: number;
  questionContent?: string;
  searchKeys?: string;
  year?: number;
  sequence?: number;
  // questionNo?: number;
  remark?: string;
}
const QuestionBanks: React.FC = () => {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(false);

  const [currentEditQuestion, setCurrentEditQuestion] = useState<QuestionBank>();
  const { examPapers, isLoading, isError } = useGetExamPapers();
  const {
    questions,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useGetQuestionsByPaperidAndYear(paperId, year, shouldfetch);

  const { subheadingsView, isLoading_useSubheadingByPaperId } = useSubheadingByPaperId(paperId);

  useEffect(() => {
    // listen for changes to auth
    if (supabase.auth.session()) {
      setIsLoggedin(true);
      setName(supabase!.auth!.session()!.user!.user_metadata.full_name);
      setUserId(supabase!.auth!.session()!.user!.id);
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedin(true);
        // setEmail(supabase!.auth!.session()!.user!.email!);
        setName(supabase!.auth!.session()!.user!.user_metadata.full_name);
        setUserId(supabase!.auth!.session()!.user!.id);
        // console.log(supabase!.auth!.session()!.user!.user_metadata.full_name);
      } else {
        setIsLoggedin(false);
        setName("");
        setUserId("");
      }
    });

    // cleanup the useEffect hook
    return () => {
      listener?.unsubscribe();
    };
  }, []);
  const signUpUser = async (email: string, role: string) => {
    let { user, error } = await supabase.auth.signIn(
      {
        provider: "google",
      },
      {
        redirectTo: "http://localhost:3000/createQuestionBank",
        // redirectTo: "https://om-shree-ganeshay-namah-git-development4-roker15.vercel.app/createQuestionBank",
      }
    );
  };

  const onSubmit: SubmitHandler<IFormInput> = async (values) => {
    if (!isEditMode) {
      const { data, error } = await supabase.from<QuestionBank>("questionbank").insert({
        paper_id: values.paperId,
        question_content: values.questionContent,
        search_keys: values.searchKeys,
        year: values.year,
        sequence: values.sequence,
        remark: values.remark,
        created_by: userId,
      });
      mutate([`/upsc/${paperId}/${year}`]);
    } else {
      const { data, error } = await supabase
        .from<QuestionBank>("questionbank")
        .update({
          paper_id: values.paperId,
          question_content: values.questionContent,
          search_keys: values.searchKeys,
          year: values.year,
          sequence: values.sequence,
          remark: values.remark,
          created_by: userId,
        })
        .eq("id", currentEditQuestion?.id);
      mutate([`/upsc/${paperId}/${year}`]);
    }

    // isSubmitting == false;
  };
  const {
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  // const watchFields = watch((data, { name, type }) => console.log(data, name, type));
  // watchFields.get("question")
  const description = "<p>Default value</p>";

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.year && value.year < 2022 && value.year > 1994) {
        setPaperId(value.paperId);
        setYear(value.year);
        setShouldfetch(true);
      } else {
        setYear(undefined);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  if (!isLoggedin) {
    console.log("session null hai bhai");
    // setEmail("")
    return (
      <div>
        Please login to view content
        <Button
          _active={{
            border: "none",
            bg: "#dddfe2",
            transform: "scale(0.98)",
            borderColor: "#bec3c9",
          }}
          variant=" outline"
          color="violet"
          onClick={() => signUpUser("hello", "hello")}
        >
          Log In
        </Button>
        <Text>{name}</Text>
      </div>
    );
  } else if (isLoggedin) {
    console.log("session null  nahi hai bhai");
    return (
      <Box>
        <Flex p="1">
          <Spacer />
          <Center>
            <Text px="2">{name}</Text>
            <Button
              variant="outline"
              onClick={() => {
                console.log("session isss ", supabase.auth.session());
                supabase.auth.signOut();
                setName("");
                setIsLoggedin(false);
              }}
            >
              Log out
            </Button>
          </Center>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <br /> */}

          <br />
          {/* <br /> */}

          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="paperId">
              Exam paper
            </FormLabel>
            {errors?.paperId?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
            <Select
              isDisabled={isEditMode}
              id="paperId"
              // w="48"
              placeholder="Select Exam Paper"
              {...register("paperId", {
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
            {/* <FormErrorMessage>{errors.paperId && errors.paperId.message}</FormErrorMessage> */}
          </FormControl>

          <HStack>
            <FormControl m="2">
              <FormLabel color="blue.600" htmlFor="year">
                Question Year
              </FormLabel>
              {errors.year && (
                <Text fontSize="16px" color="#bf1650">
                  **Year should be from 1995 to 2021
                </Text>
              )}
              <Input
                placeholder="Year should be from 1995 to 2021"
                isDisabled={isEditMode}
                type="number"
                {...register("year", { min: 1995, max: 2021 })}
              />
            </FormControl>
          </HStack>
        </form>
        {/* <Button size="sm" mb="6" mt="6" color="yellow.900" bg="yellow" type="submit">
          Get data
        </Button> */}
        {year && year != undefined && paperId ? (
          <Center mb="16">
            {" "}
            <Text as="u">
              Question Bank For Year <Text as="b"> {year}</Text> ({examPapers?.filter((x) => x.id == paperId)[0].paper_name})
            </Text>
          </Center>
        ) : (
          <Center mb="16">Select Paper and Mention year (1995-2021) to view question bank</Center>
        )}

        {questions && questions.length != 0 ? (
          (questions as QuestionBank[])
            .sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => {
              return (
                <Box key={x.id} mb="2">
                  <HStack></HStack>
                  <EditorStyle>
                    <SunEditor
                    //   setDefaultStyle="font-family: arial; font-size: 16px;"
                      setContents={x.question_content}
                      hideToolbar={true}
                      readOnly={true}
                      //   disable={true}
                      // autoFocus={false}
                      // name={field.name}
                      setOptions={{
                        mode: "balloon",
                        katex: katex,
                        height: "100%",
                      }}
                    //   placeholder="put ur content"
                      // setContents={field.value}
                      // onChange={field.onChange}
                    />
                  </EditorStyle>
                </Box>
              );
            })
        ) : (
          <Box mb="16"> **No data for selected Paper & year</Box>
        )}
      </Box>
    );
  } else {
    return <div></div>;
  }
};

export default QuestionBanks;

const EditorStyle = styled.div`
  .sun-editor {
    border: 0px solid blue;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    text-align: left;
    padding: 8px;
    font-family: "Rock Salt", cursive;
    padding: 20px;
    // font-style: italic;
    caption-side: bottom;
    // color: #666;
    text-align: right;
    letter-spacing: 1px;
    font-weight: lighter !important;
  }
  th {
    font-style: italic;
    caption-side: bottom;
    color: #616 !important;
    font-weight: lighter !important;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;
