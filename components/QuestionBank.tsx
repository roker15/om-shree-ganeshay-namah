import { CheckCircleIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import SunEditorCore from "suneditor/src/lib/core";
import { useGetExamPapers, useGetQuestionsByPaperidAndYear } from "../customHookes/useUser";
import { BASE_URL, colors, sunEditorButtonList, sunEditorfontList } from "../lib/constants";
import { Database } from "../lib/database.types";
import { useAuthContext } from "../state/Authcontext";
import { QuestionBank } from "../types/myTypes";
import { definitions } from "../types/supabase";
import { customToast } from "./CustomToast";
import { EditorStyle } from "./editor/SuneditorForNotesMaking";
// import Suneditor from "../components/Suneditor";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface IFormInput {
  paperId: number;
  questionContent?: string;
  searchKeys?: string;
  year?: number;
  sequence?: number;
  remark?: string;
}
const QuestionBanks: React.FC = () => {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const [examId, setExamId] = useState("24");
  const { examPapers, isLoading, isError } = useGetExamPapers(parseInt(examId));
  const { questions, isLoading: isQuestionLoading } = useGetQuestionsByPaperidAndYear(paperId, year, shouldfetch);

  const { profile } = useAuthContext();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value.year && value.year < 2022 && value.year > 1994 && value.paperId) {
        setPaperId(value.paperId);
        setYear(value.year);
        setShouldfetch(true);
      } else {
        setYear(undefined);
        setShouldfetch(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Box>
      <>
        <RadioGroup
          ml="4"
          onChange={(e) => {
            setPaperId(undefined);
            setYear(undefined);
            setExamId(e);
          }}
          value={examId}
        >
          <Stack direction="row">
            <Radio size="sm" name="1" colorScheme="linkedin" value="24">
              <Text casing="capitalize">UPSC</Text>
            </Radio>
            <Radio size="sm" name="2" colorScheme="telegram" value="29">
              <Text casing="capitalize">UPPSC PCS</Text>
            </Radio>
          </Stack>
        </RadioGroup>
        <form>
          <br />
          <FormControl>
            <CustomFormLabel text={"Exam paper :"} htmlfor={"paperId"} />
            {errors?.paperId?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
            <Select
              id="paperId"
              // w="48"
              placeholder="Select Exam Paper"
              {...register("paperId", {
                required: "This is required",
                // minLength: { value: 4, message: "Minimum length should be 4"  },
              })}
              // onChange={handleChange}
            >
              {examPapers
                ?.sort((a, b) => {
                  return a.book_name > b.book_name ? 1 : -1;
                })
                .map((x) => {
                  return (
                    <option key={x.id} value={x.id}>
                      {x.book_name}
                    </option>
                  );
                })}
            </Select>
            {/* <FormErrorMessage>{errors.paperId && errors.paperId.message}</FormErrorMessage> */}
          </FormControl>
          <br />
          <FormControl>
            <CustomFormLabel text={"Question Year :"} htmlfor={"year"} />

            {errors.year && (
              <Text fontSize="16px" color="#bf1650">
                **Year should be from 1995 to 2021
              </Text>
            )}
            <Input
              id="year"
              placeholder="Year should be from 1995 to 2021"
              type="number"
              {...register("year", { min: 1995, max: 2021 })}
            />
          </FormControl>
        </form>
        <Text fontSize="xs" mt="2" p="2" bg="gray.100">
          <Text as="b">Note :-</Text> Currently Only Geography, History & Sociology Questions are Available. We will keep on adding more.{" "}
          <Text as="b">You can also Add question by going to </Text>{" "}
          <Link href="/createQuestionBank">
            <a className="internal" style={{ color: "#de378a" }}>
              Create New Question
            </a>
          </Link>
        </Text>
        {year && year != undefined && paperId ? (
          <Center my="16">
            {" "}
            <Text as="u">
              Question Bank For Year <Text as="b"> {year}</Text> ({examPapers?.filter((x) => x.id == paperId)[0].book_name})
            </Text>
          </Center>
        ) : (
          <Center my="16">Select Paper and Mention year (1995-2021) to view question bank</Center>
        )}
        {isQuestionLoading ? (
          <Spinner size="100px" /> //this is not visible test it again
        ) : questions && questions.length != 0 ? (
          (questions as Database["public"]["Tables"]["questionbank"]["Row"][])
            .sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => {
              return (
                <Box key={x.id} mb="2">
                  <QuestionBankEditor x={x} y={false} />
                </Box>
              );
            })
        ) : (
          <Box mb="16"> **No data for selected Paper & year</Box>
        )}
      </>
    </Box>
  );
};

export default QuestionBanks;

const CustomFormLabel: React.FC<{ text: string; htmlfor: string }> = ({ text, htmlfor }) => {
  return (
    <FormLabel
      color="blue.300"
      fontStyle="revert"
      fontFamily="sans-serif"
      textTransform={"capitalize"}
      fontWeight="normal"
      htmlFor={htmlfor}
    >
      {text}
      {/* Question Year : */}
    </FormLabel>
  );
};

const EditorStyle1 = styled.div`
  .sun-editor {
    border: 0px solid gray;
    margin-top: 60px !important;
  }
`;
interface PropsQuestionBankEditor {
  x: Database["public"]["Tables"]["questionbank"]["Row"];
  y?: boolean;
}

const QuestionBankEditor: React.FunctionComponent<PropsQuestionBankEditor> = ({ x, y }) => {
  const [isAnswerWritingOn, setAnswerWritingOn] = useState(false);
  const [isAnswerExist, setAnswerExist] = useState(false);
  const { user, error } = useUser();
  const [value, setValue] = React.useState("READ");
  const [showEditButton, setShowEditButton] = useState(y);
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const getAnswer = async () => {
    setAnswerWritingOn(true);
    const { data, error } = await supabaseClient
      .from("question_answer")
      .select(`*`)
      .eq("question_id", x.id)
      .eq("answered_by", user?.id);
    if (data && data.length > 0 && data[0].answer_english) {
      editor.current?.core.setContents(data[0].answer_english);
    }
  };

  const updateAnswer = async (answer: string) => {
    const { data, error } = await supabaseClient
      .from("question_answer")
      .update({
        answer_english: answer,
      })
      .eq("question_id", x.id)
      .eq("answered_by", user?.id);
    if (data) {
      customToast({ title: "Notes updated", status: "info" });
    }
  };
  const insertAnswer = async (answer: string) => {
    const { data, error } = await supabaseClient.from("question_answer").insert({
      question_id: x.id,
      answered_by: user?.id,
      answer_english: answer,
    });
    if (data) {
      setAnswerExist(true);
      customToast({ title: "Notes saved", status: "info" });
    }
  };
  const updateOrInsertAnswer = (content: string) => {
    if (isAnswerExist) {
      updateAnswer(content);
    } else {
      insertAnswer(content);
    }
  };
  useEffect(() => {
    setShowEditButton(true);
  }, []);

  useEffect(() => {
    const getAnswerCount = async () => {
      const { data, error, count } = await supabaseClient
        .from("question_answer")
        .select(`*`, { count: "exact", head: true })
        .eq("question_id", x.id)
        .eq("answered_by", user?.id);

      if (count) {
        setAnswerExist(true);
      } else {
        setAnswerExist(false);
      }
    };
    getAnswerCount();
  }, [user?.id, x.id]);

  return (
    <>
      <EditorStyle1>
        <SunEditor
          defaultValue={x.question_content!}
          hideToolbar={true}
          readOnly={true}
          //   disable={true}
          autoFocus={false}
          setOptions={{
            mode: "balloon", //this is just for stop flash of toolbar before hiding
            katex: katex,
            hideToolbar: true,
            resizingBar: false,
            height: "100%",
          }}
        />
      </EditorStyle1>
      <Flex alignItems={"center"} ml="3" justifyContent="space-between">
        <Flex alignItems={"center"}>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              if (isAnswerWritingOn) {
                setAnswerWritingOn(false);
              } else {
                getAnswer();
              }
            }}
          >
            {isAnswerWritingOn ? (
              <ViewOffIcon w={"3.5"} h={3.5} color="red" />
            ) : showEditButton ? (
              "✍🏻 Write/Edit Answer"
            ) : null}
          </Button>

          {isAnswerWritingOn && (
            <RadioGroup ml="4" onChange={setValue} value={value}>
              <Stack direction="row">
                <Radio size="sm" name="1" colorScheme="linkedin" value="READ">
                  <Text casing="capitalize">Read</Text>
                </Radio>
                <Radio size="sm" name="1" colorScheme="telegram" value="EDIT">
                  <Text casing="capitalize">Edit</Text>
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        </Flex>
        <Flex alignItems={"center"}>{isAnswerExist && <CheckCircleIcon w={4} h={4} ml="2" color="green" />}</Flex>
      </Flex>
      {isAnswerWritingOn && (
        <EditorStyle title={value === "READ" ? "READ" : "EDIT"}>
          <Box ml={{ base: "2", md: "10" }} p="0.5" bg="blue.50" borderRadius={"5px"}>
            <SunEditor
              setDefaultStyle="font-family: arial; font-size: 16px;"
              // defaultValue={answer}
              getSunEditorInstance={getSunEditorInstance}
              hideToolbar={value === "READ" ? true : false}
              readOnly={value === "READ" ? true : false}
              // disable={true}
              autoFocus={false}
              setOptions={{
                callBackSave(contents, isChanged) {
                  updateOrInsertAnswer(contents);
                },
                placeholder: "Click Edit above and Start Typing",
                hideToolbar: true,
                mode: "classic",
                katex: katex,
                colorList: colors,
                imageUploadUrl: `${BASE_URL}/api/uploadImage`,
                height: "100%",
                width: "auto",
                minWidth: "350px",
                buttonList: sunEditorButtonList,
                resizingBar: false,
                formats: ["p", "div", "h1", "h2", "h3"],
                font: sunEditorfontList,

                fontSize: [12, 14, 16, 20],
                imageFileInput: true, //this disable image as file, only from url allowed
                imageSizeOnlyPercentage: false, //changed on 6 june
              }}
            />
          </Box>
        </EditorStyle>
      )}
    </>
  );
};
