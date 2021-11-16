import { Button } from "@chakra-ui/button";
import { LinkIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Stack } from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Center,
  FormControl,
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
import { supabase } from "../lib/supabaseClient";
import { QuestionBank, SubheadingQuestionLink } from "../types/myTypes";
// import Suneditor from "../components/Suneditor";

const buttonList = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  [/*"paragraphStyle",*/ "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "lineHeight"],
  ["table", "link", "image", /* "video","audio",*/ "math"],

  /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
  ["fullScreen" /*, "showBlocks", "codeView"*/],
  ["preview", "print"],
  // ["save", "template"],
];

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

export default function App() {
  const [paperId, setPaperId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [shouldfetch, setShouldfetch] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [email, setEmail] = useState("");
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
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedin(true);
        // setEmail(supabase!.auth!.session()!.user!.email!);
        setEmail(supabase!.auth!.session()!.user!.user_metadata.full_name);
        setUserId(supabase!.auth!.session()!.user!.id);
        // console.log(supabase!.auth!.session()!.user!.user_metadata.full_name);
      } else {
        setIsLoggedin(false);
        setEmail("");
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
        // redirectTo: "http://localhost:3000/createQuestionBank",
        redirectTo: "https://om-shree-ganeshay-namah-git-development2-roker15.vercel.app/createQuestionBank",
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
      console.log(data);
      alert(JSON.stringify(data));
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

  const handleQuestionEdit = (e: QuestionBank) => {
    setIsEditMode(!isEditMode);
    setCurrentEditQuestion(e);

    console.log("editing", e.id, e.question_content);
  };
  const handleQuestionDelete = async (e: QuestionBank) => {
    const { data, error } = await supabase.from<QuestionBank>("questionbank").delete().eq("id", e.id);
    mutate([`/upsc/${paperId}/${year}`]);
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
      setValue("sequence", 0);
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
        <Text>{email}</Text>
      </div>
    );
  } else if (isLoggedin) {
    console.log("session null  nahi hai bhai");
    return (
      <Box mx={{ base: "4", md: "28", lg: "52" }}>
        <Button
          onClick={() => {
            console.log("session isss ", supabase.auth.session());
            supabase.auth.signOut();
            setEmail("");
            setIsLoggedin(false);
          }}
        >
          Log out
        </Button>
        <Text>{email}</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <br />
          <Center>
            <Badge colorScheme="purple" fontSize="2xl">
              Create Questions
            </Badge>
          </Center>
          <br />
          <br />

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

          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="questionContent">
              Question content
            </FormLabel>
            {errors?.questionContent?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
            <Controller
              name="questionContent"
              control={control}
              // defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Box>
                  <SunEditor
                    name={field.name}
                    setOptions={{
                      mode: "balloon",
                      katex: katex,
                      height: "100%",

                      buttonList: buttonList,
                    }}
                    placeholder="put ur content"
                    setContents={field.value}
                    onChange={field.onChange}
                  />
                </Box>
              )}
            />
          </FormControl>
          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="searchKeys">
              Search Keys
            </FormLabel>
            {errors?.searchKeys?.type === "required" && (
              <Text fontSize="16px" color="#bf1650">
                **This field is required
              </Text>
            )}
            <Input {...register("searchKeys", { required: true, maxLength: 200 })} />
          </FormControl>
          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="year">
              Question Year
            </FormLabel>
            {errors.year && (
              <Text fontSize="16px" color="#bf1650">
                **Year should be from 1995 to 2021
              </Text>
            )}
            <Input isDisabled={isEditMode} type="number" {...register("year", { min: 1995, max: 2021 })} />
          </FormControl>
          <FormControl m="2">
            <FormLabel color="blue.600" htmlFor="sequence">
              Question sequence
            </FormLabel>
            {errors.sequence && (
              <Text fontSize="16px" color="#bf1650">
                **Sequence should be from 1 to 700
              </Text>
            )}
            <Input type="number" {...register("sequence", { min: 1, max: 700 })} />
          </FormControl>
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
          {/* <Editor name="description" defaultValue={description} control={control} placeholder="Write a Description..." /> */}
          <Button size="sm" mb="6" mt="6" colorScheme="purple" type="submit">
            {isEditMode ? "Update Question" : "Create Question"}
          </Button>
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
            .sort((a, b) => b.id - a.id)
            .map((x) => {
              return (
                <Box key={x.id} mb="16">
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
                    <LinkSyllabusModal questionId={x.id}></LinkSyllabusModal>
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
                        mode: "balloon",
                        katex: katex,
                        height: "100%",

                        buttonList: buttonList,
                      }}
                      placeholder="put ur content"
                      // setContents={field.value}
                      // onChange={field.onChange}
                    />
                  </EditorStyle>
                  <HStack>
                    <Badge color="teal" size="small">
                      {x.year}
                    </Badge>
                    <Badge color="teal" size="small">
                      {x.id}
                    </Badge>
                    <Badge color="teal" size="small">
                      {x.search_keys}
                    </Badge>
                    <Badge color="teal" size="small">
                      {x.remark}
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
    const handleLinkSyllabusButtonClick = async (x: number) => {
      const { data, error } = await supabase
        .from<SubheadingQuestionLink>("subheadingquestionlink")
        .select(
          `
            id,
            questionbank_id,
            subheading_id
          
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
    const handlelinkClick = async (questionId: number, syllabusId: number) => {
      const { data, error } = await supabase.from<SubheadingQuestionLink>("subheadingquestionlink").insert({
        questionbank_id: questionId,
        subheading_id: syllabusId,
      });
      if (data && data[0]) {
        setQlink([...qlink, data[0]]);
      }
      console.log("data after linking", data);
    };

    const handleunlinkClick = async (questionId: number, syllabusId: number) => {
      const { data, error } = await supabase
        .from<SubheadingQuestionLink>("subheadingquestionlink")
        .delete()
        .match({ questionbank_id: questionId, subheading_id: syllabusId });
      if (data && data[0]) {
        console.log("qlink array before delete.....", qlink);
        console.log("questionid and subheading id ", questionId,syllabusId);
        // let arr: SubheadingQuestionLink[];
        const arr: SubheadingQuestionLink[] = qlink.filter(
          (item) => (item.subheading_id !== syllabusId )
        )

        console.log("array after delete.....", arr);
        setQlink(arr);
      }
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
          onClick={() => handleLinkSyllabusButtonClick(questionId)}
        >
          Link Syllabus
        </Button>

        <Modal onClose={onClose} finalFocusRef={btnRef} size="xl" isOpen={isOpen} scrollBehavior="outside">
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
                          {"  " + x!.topic}
                          {console.log("qlink", qlink)}
                          {qlink.some((item) => item.subheading_id == x.subheading_id) ? (
                            <Button
                              colorScheme="orange"
                              onClick={() => handleunlinkClick(questionId, x.subheading_id)}
                              leftIcon={<MdLinkOff />}
                              variant="ghost"
                              size="xs"
                            >
                              unlink
                            </Button>
                          ) : (
                            <Button
                              colorScheme="green"
                              onClick={() => handlelinkClick(questionId, x.subheading_id)}
                              leftIcon={<MdLink />}
                              variant="ghost"
                              size="xs"
                            >
                              link
                            </Button>
                          )}
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
}
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
