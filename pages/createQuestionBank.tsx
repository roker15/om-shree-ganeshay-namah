import { Button } from "@chakra-ui/button";
import { LinkIcon, PhoneIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex, Spacer, Stack } from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Center,
  Checkbox,
  Circle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDelete, MdLink, MdLinkOff, MdMode } from "react-icons/md";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// now recommend to always use the mutate returned from the useSWRConfig hook:
import useSWR, { mutate } from "swr";
import { useGetExamPapers, useGetQuestionsByPaperidAndYear, useSubheadingByPaperId } from "../customHookes/useUser";
import { QuestionBank, SubheadingQuestionLink } from "../types/myTypes";
// import Suneditor from "../components/Suneditor";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { definitions } from "../types/supabase";
import { BASE_URL, sunEditorButtonList } from "../lib/constants";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import PageWithLayoutType from "../types/pageWithLayout";

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

const CreateQuestionBank: React.FC = () => {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState("");
  const { user, error } = useUser();
  const [currentEditQuestion, setCurrentEditQuestion] = useState<QuestionBank>();
  const { examPapers, isLoading, isError } = useGetExamPapers(24);
  const [loading, setLoading] = useState(false);
  const {
    questions,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useGetQuestionsByPaperidAndYear(paperId, year, shouldfetch);

  const { subheadingsView, isLoading_useSubheadingByPaperId } = useSubheadingByPaperId(paperId);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    } else {
      setUserId("");
    }
  }, []);
  const signUpUser = async (email: string, role: string) => {
    let { user, error } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      {
        // redirectTo: `${BASE_URL}/createQuestionBank`,
        redirectTo: "https://www.jionote.com/createQuestionBank",
      }
    );
  };

  const onSubmit: SubmitHandler<IFormInput> = async (values) => {
    setLoading(true);
    if (!isEditMode) {
      // window.alert("value of check box is " + values.searchKeys + " " + values.year);
      const { data, error } = await supabaseClient.from<definitions["questionbank"]>("questionbank").insert({
        paper_id_new: values.paperId,
        question_content: values.questionContent,
        search_keys: values.searchKeys,
        year: values.year,
        sequence: values.sequence,
        remark: values.remark,
        created_by: userId,
      });
      setLoading(false);
      mutate([`/questions/${paperId}/${year}`]);
    } else {
      const { data, error } = await supabaseClient
        .from<definitions["questionbank"]>("questionbank")
        .update({
          paper_id_new: values.paperId,
          question_content: values.questionContent,
          search_keys: values.searchKeys,
          year: values.year,
          sequence: values.sequence,
          remark: values.remark,
          created_by: userId,
        })
        .eq("id", currentEditQuestion?.id);
      setLoading(false);
      mutate([`/questions/${paperId}/${year}`]);
    }
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

  const handleQuestionEdit = (e: QuestionBank) => {
    // let { data, error } = await supabaseClient.rpc("getsyllabusd", {
    //   paper_idd:49,
    // });

    // if (error) console.error(error);
    // else console.log(data);

    setIsEditMode(!isEditMode);
    setCurrentEditQuestion(e);

    console.log("editing", e.id, e.question_content);
  };
  const handleQuestionDelete = async (e: QuestionBank) => {
    const { data, error } = await supabaseClient.from<QuestionBank>("questionbank").delete().eq("id", e.id);
    mutate([`/questions/${paperId}/${year}`]);
  };

  useEffect(() => {
    if (isEditMode) {
      setValue("questionContent", currentEditQuestion?.question_content);
      setValue("year", currentEditQuestion?.year);
      setValue("sequence", currentEditQuestion?.sequence);
      setValue("searchKeys", currentEditQuestion?.search_keys);
      setValue("remark", currentEditQuestion?.remark);
    } else {
      setValue("questionContent", "");
      setValue("year", currentEditQuestion?.year);
      setValue("sequence", undefined);
      setValue("searchKeys", "");
      setValue("remark", "");
    }
  }, [
    currentEditQuestion?.question_content,
    currentEditQuestion?.remark,
    currentEditQuestion?.search_keys,
    currentEditQuestion?.sequence,
    currentEditQuestion?.year,
    isEditMode,
    setValue,
  ]);
  if (!user) {
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
      </div>
    );
  } else {
    console.log("session null  nahi hai bhai");
    return (
      <Box mx={{ base: "4", md: "28", lg: "52" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <br /> */}

          <br />
          <Center>
            <Badge colorScheme="purple" fontSize="xl">
              Create Questions
            </Badge>
          </Center>
          <br />
          {/* <br /> */}

          <FormControl m="2" isInvalid={errors.paperId as any}>
            <FormLabel color="blue.600" htmlFor="paperId">
              Exam paper
            </FormLabel>
            {/* {errors?.paperId?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )} */}
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
            <FormErrorMessage>{errors.paperId && errors.paperId.message}</FormErrorMessage>
          </FormControl>

          <FormControl m="2" isInvalid={errors.questionContent as any}>
            <FormLabel color="blue.600" htmlFor="questionContent">
              Question content
            </FormLabel>
            {/* {errors?.questionContent?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )} */}
            <Controller
              name="questionContent"
              control={control}
              // defaultValue=""
              rules={{ required: { value: true, message: "This is required." } }}
              render={({ field }) => (
                <Box>
                  <SunEditor
                    name={field.name}
                    setOptions={{
                      mode: "classic",
                      katex: katex,
                      height: "100%",
                      imageUploadUrl: `${BASE_URL}/api/uploadImage`,
                      buttonList: sunEditorButtonList,
                      resizingBar: false,
                      formats: ["p", "div", "h1", "h2", "h3"],
                    }}
                    placeholder="Type Question here"
                    setContents={field.value}
                    onChange={field.onChange}
                  />
                </Box>
              )}
            />
            <FormErrorMessage>{errors.questionContent && errors.questionContent.message}</FormErrorMessage>
          </FormControl>

          {/* <FormControl isInvalid={errors.searchKeys as any}>
            <FormLabel color="blue.600" htmlFor="searchKeys">
              check box
            </FormLabel>
            <Checkbox value="sasuke" {...register("searchKeys")}>
              Sasuke
            </Checkbox>
            {errors?.searchKeys?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
          </FormControl> */}

          <HStack>
            <FormControl m="2" isInvalid={errors.year as any}>
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
                {...register("year", { required: true, min: 1995, max: 2021 })}
              />
            </FormControl>
            <FormControl m="2" isInvalid={errors.sequence as any}>
              <FormLabel color="blue.600" htmlFor="sequence">
                Question sequence
              </FormLabel>
              {errors.sequence && (
                <Text fontSize="16px" color="#bf1650">
                  **Sequence should be from 1 to 700
                </Text>
              )}
              <Input
                placeholder="1,2,3....."
                type="number"
                {...register("sequence", { required: true, min: 1, max: 700 })}
              />
            </FormControl>
          </HStack>

          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="remark">
              Remark
            </FormLabel>
            {errors?.remark?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
            <Input {...register("remark", { required: false, maxLength: 100 })} />
          </FormControl>
          <Button size="sm" mb="6" mt="6" colorScheme="purple" type="submit" isLoading={loading}>
            {isEditMode ? "Update Question" : "Create Question"}
          </Button>
        </form>
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

        {questions && questions.length != 0 ? (
          (questions as QuestionBank[])
            .sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => {
              return (
                <Box key={x.id} mb="8">
                  <HStack>
                    <Button
                      isDisabled={isEditMode && currentEditQuestion?.id != x.id}
                      colorScheme="teal"
                      variant="ghost"
                      leftIcon={<MdMode />}
                      size="xs"
                      onClick={() => handleQuestionEdit(x)}
                    >
                      {isEditMode && currentEditQuestion?.id == x.id ? "Cancel Edit" : "Edit"}
                    </Button>

                    <AlertDialogExample
                      isDisabled={isEditMode}
                      handleDelete={handleQuestionDelete}
                      x={x}
                      dialogueHeader={"Delete Question"}
                    ></AlertDialogExample>
                    {/* <LinkSyllabusModal questionId={x.id}></LinkSyllabusModal> */}
                  </HStack>
                  <EditorStyle>
                    <SunEditor
                      setContents={x.question_content}
                      hideToolbar={true}
                      readOnly={true}
                      disable={true}
                      // autoFocus={false}
                      // name={field.name}
                      setOptions={{
                        mode: "classic",
                        katex: katex,
                        height: "100%",

                        buttonList: sunEditorButtonList,
                        resizingBar: false,
                        formats: ["p", "div", "h1", "h2", "h3"],
                      }}
                      placeholder="Type Question here"
                      // setContents={field.value}
                      // onChange={field.onChange}
                    />
                  </EditorStyle>
                  <HStack>
                    <Badge color="teal" size="small">
                      {x.year}
                    </Badge>
                    <Badge color="teal" size="small">
                      {x.remark}
                    </Badge>
                    <Badge color="teal" size="small">
                      {x.sequence}
                    </Badge>
                  </HStack>
                  <Divider />
                </Box>
              );
            })
        ) : (
          <Box mb="16"> **No data for selected Paper & year</Box>
        )}
      </Box>
    );
  }

  interface LinkSyllabusModalProps {
    questionId: number;
  }
  function LinkSyllabusModal({ questionId }: LinkSyllabusModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [scrollBehavior, setScrollBehavior] = React.useState<"inside" | "outside" | undefined | string>("inside");
    const [qlink, setQlink] = useState<SubheadingQuestionLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleLinkSyllabusButtonClick = async (x: number) => {
      const { data, error } = await supabaseClient
        .from<SubheadingQuestionLink>("subheadingquestionlink")
        .select(
          `
            id,
            questionbank_id,
            subheading_id,
            heading_id
          
   `
        )
        .eq("questionbank_id", x);
      console.log("questionlink", data);
      if (data) {
        setQlink(data);
        console.log("qlinkmmmm", data);
      }
      onOpen();
      // { refreshInterval: 1000 }
    };
    const handlelinkClick = async (questionId: number, syllabusId: number, headingId: number) => {
      setIsLoading(true);
      const { data, error } = await supabaseClient.from<SubheadingQuestionLink>("subheadingquestionlink").insert({
        questionbank_id: questionId,
        subheading_id: syllabusId,
        heading_id: headingId,
        created_by: supabaseClient.auth.user()?.id,
      });
      if (data && data[0]) {
        setQlink([...qlink, data[0]]);
      }
      setIsLoading(false);
      console.log("data after linking", data);
    };

    const handleunlinkClick = async (questionId: number, syllabusId: number) => {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from<SubheadingQuestionLink>("subheadingquestionlink")
        .delete()
        .match({ questionbank_id: questionId, subheading_id: syllabusId });
      if (data && data[0]) {
        const arr: SubheadingQuestionLink[] = qlink.filter((item) => item.subheading_id !== syllabusId);

        console.log("array after delete.....", arr);
        setQlink(arr);
      }
      setIsLoading(false);
    };
    //     useEffect(() => {

    // })
    const btnRef = React.useRef(null);
    return (
      <>
        {/* <RadioGroup value={scrollBehavior} onChange={setScrollBehavior}>
          <Stack direction="row">
            <Radio value="inside">inside</Radio>
            <Radio value="outside">outside</Radio>
          </Stack>
        </RadioGroup> */}

        <Button
          mt={3}
          ref={btnRef}
          size="xs"
          leftIcon={<MdLink />}
          variant="ghost"
          isLoading={isLoading}
          onClick={() => handleLinkSyllabusButtonClick(questionId)}
        >
          Link Syllabus
        </Button>

        <Modal onClose={onClose} finalFocusRef={btnRef} isOpen={isOpen} scrollBehavior="outside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Link Syllabus to Question</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {subheadingsView ? (
                subheadingsView!.map((x) => {
                  // console.log("bgbgbgbg", x);
                  return (
                    <Box p="2" key={x.subheading_id}>
                      <Text as="b" fontSize="smaller">
                        {x!.main_topic!}
                        <Text color="blue" fontSize="smaller">
                          <>
                            {"  " + x!.topic}
                            {console.log("qlink", qlink)}
                            {qlink.some((item) => item.subheading_id == x.subheading_id) ? (
                              <Button
                                colorScheme="orange"
                                onClick={() => handleunlinkClick(questionId, x.subheading_id)}
                                isLoading={isLoading}
                                leftIcon={<MdLinkOff />}
                                variant="ghost"
                                size="xs"
                              >
                                unlink
                              </Button>
                            ) : (
                              <Button
                                colorScheme="green"
                                onClick={() => handlelinkClick(questionId, x.subheading_id, x.heading_id!)}
                                leftIcon={<MdLink />}
                                variant="ghost"
                                isLoading={isLoading}
                                size="xs"
                              >
                                link
                              </Button>
                            )}
                          </>
                        </Text>
                      </Text>
                    </Box>
                  );
                })
              ) : (
                <div>no data</div>
              )}
              {/* <Lorem count={15} /> */}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
};
(CreateQuestionBank as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default CreateQuestionBank;

interface AlertdialogueProps {
  handleDelete: (e: any) => Promise<void>;
  x: QuestionBank;
  dialogueHeader: string;
  isDisabled: boolean;
}
function AlertDialogExample({ handleDelete, x, dialogueHeader, isDisabled }: AlertdialogueProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const handleQuestionDelete = () => {
    handleDelete(x);
    onClose();
  };

  return (
    <>
      <Button
        colorScheme="red"
        isDisabled={isDisabled}
        leftIcon={<MdDelete />}
        variant="ghost"
        size="xs"
        onClick={() => setIsOpen(true)}
      >
        {dialogueHeader}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogueHeader}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can`t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => handleQuestionDelete()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

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
