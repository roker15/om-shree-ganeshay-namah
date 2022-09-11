import { Box } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { BASE_URL, colors, currentAffairTags, sunEditorButtonList } from "../lib/constants";
import { definitions } from "../types/supabase";
// import DOMPurify from "dompurify";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdCancel, MdDone, MdFileCopy, MdModeEdit } from "react-icons/md";
import { InfoAlert } from "../components/CurrentAffair/ManageCurrentAffair";
import SyllabusForCurrentAffairs from "../components/CurrentAffair/SyllabusForCurrentAffairs";
import { customToast } from "../components/CustomToast";
import { LoginCard } from "../components/LoginCard";
import DeleteConfirmation from "../components/syllabus/DeleteConfirmation";
import { useGetCurrentAffairs } from "../customHookes/networkHooks";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import { elog, sentenseCase } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import { BookResponse, BookSyllabus } from "../types/myTypes";
import PageWithLayoutType from "../types/pageWithLayout";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function SuneditorSimple(props: {
  article: definitions["books_articles"];
  content: string | undefined;
  canCopy: boolean;
  userrole: string;
  isAdminNotes: boolean;
  language: "HINDI" | "ENG";
  saveCallback: (id: number, content: string, language: "ENG" | "HINDI") => void;
  copyCallback: (x: definitions["books_articles"]) => void;
}) {
  const [readMode, setReadMode] = useState<boolean>(true);
  return (
    <Box className={readMode ? "zaza" : "zazaza"}>
      <Flex justifyContent="space-between" wrap={"wrap"}>
        <Button
          size="xs"
          visibility={props.isAdminNotes && props.userrole !== "ADMIN" ? "hidden" : "visible"}
          leftIcon={<MdModeEdit />}
          onClick={() => {
            setReadMode(!readMode);
          }}
        >
          {readMode ? "Edit" : "Read"}
        </Button>
        <Button
          size="xs"
          display={props.canCopy ? undefined : "none"}
          leftIcon={<MdFileCopy />}
          onClick={() => {
            props.copyCallback(props.article);
          }}
        >
          To Edit, Click here and Copy this Note to Your Account
        </Button>
      </Flex>
      <SunEditor
        setDefaultStyle="font-family: arial; font-size: 16px;"
        defaultValue={props.content}
        hideToolbar={readMode}
        readOnly={readMode}
        setOptions={{
          callBackSave(contents, isChanged) {
            props.saveCallback(props.article.id, contents, props.language);
          },
          mode: "classic",
          katex: katex,
          height: "100%",
          colorList: colors,
          buttonList: sunEditorButtonList,
          resizingBar: false,
          hideToolbar: false,
          formats: ["p", "div", "h1", "h2", "h3"],
        }}
      />
    </Box>
  );
}

const CurrentAffair: React.FC = () => {
  // const [data, setData] = useState<definitions["books_articles"][] | undefined>(undefined);
  const { user } = useUser();
  const { profile } = useAuthContext();
  const [language, setLangauge] = useState<"ENG" | "HINDI">("ENG");
  const [book, setBook] = useState<BookResponse>({
    id: 125,
    book_name: "News and PIB",
  });

  const [isAdminNotes, setIsAdminNotes] = useState<boolean>(true);
  const [articleFormMode, setArticleFormMode] = useState<"CREATING" | "EDITING" | "NONE">("NONE");
  const [selectedSyllabus, setSelectedSyllabus] = useState<BookSyllabus | undefined>();

  const { data, mutate, isError, isLoading } = useGetCurrentAffairs(
    isAdminNotes,
    selectedSyllabus?.subheading_id!,
    user?.id!
  );

  const handleTabsChange = (index: any) => {
    setLangauge(index === 0 ? "ENG" : "HINDI");
  };
  const changeParentProps = () => {
    mutate();
  };
  const handleCopyNotes = async (d: definitions["books_articles"]) => {
    if (!user) {
      customToast({ title: "Please Login to use this feature", status: "error", isUpdating: false });
      return;
    }
    const { data, error } = await supabaseClient.from<definitions["books_articles"]>("books_articles").insert([
      {
        article_title: d.article_title,
        article_english: d.article_english,
        article_hindi: d.article_hindi,
        created_by: profile?.id,
        books_subheadings_fk: d.books_subheadings_fk,
        sequence: d.sequence,
        current_affair_tags: d.current_affair_tags,
        question_type: d.question_type,
        question_year: d.question_year,
        copied_from_articleid: d.copied_from_articleid,
        copied_from_userid: d.copied_from_userid,
      },
    ]);
    if (error) {
      elog("MyNotes->onSubmit", error.message);
      return;
    }
    if (data) {
      customToast({ title: "Article copied, Check inside your Private notes", status: "success", isUpdating: false });
    }
  };
  const saveArticle = async (id: number, content: string, language: string) => {
    const { data, error } = await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .update(language === "ENG" ? { article_english: content } : { article_hindi: content })
      .eq("id", id);
    if (error) {
      customToast({ title: "Article not updated error occurred  " + error.message, status: "error", isUpdating: false });
      return;
    }
    if (data) {
      customToast({ title: "Updated...", status: "success", isUpdating: true });
    }
  };
  const deleteArticle = async (id: number): Promise<void> => {
    const { data, error } = await supabaseClient.from<definitions["books_articles"]>("books_articles").delete().eq("id", id);
    if (error) {
      elog("MyNotes->deleteArticle", error.message);
      return;
    }
    if (data) {
      mutate();
    }
  };

  const setSyllabus = (x: BookSyllabus) => {
    setSelectedSyllabus(x);
  };

  return (
    <Container maxW="7xl" py="2" px={{ base: "0.5", md: "2", lg: "4" }}>
      {!user && (
        <Flex justifyContent="end" mb="8">
          <LoginCard redirect={`${BASE_URL}/dna`} />
        </Flex>
      )}
      <Grid templateColumns="repeat(5, 1fr)" column={2} rowGap={2}>
        <GridItem colSpan={[0, 0, 0, 1]} display={["none", "none", "none", "block"]}></GridItem>
        <GridItem colSpan={[5, 5, 5, 4]}>
          {" "}
          <HStack>
            <Box display={["block", "block", "block", "none"]}>
              <SyllabusDrawer book={book} changeParentProps={setSyllabus} />
            </Box>
            <Button
              size={{ base: "sm", sm: "sm", md: "md" }}
              display={selectedSyllabus ? undefined : "none"}
              colorScheme="telegram"
              onClick={() => {
                // setData(data);
                setIsAdminNotes(!isAdminNotes);
              }}
            >
              {isAdminNotes ? "Switch to Your Private Notes" : "Switch to Official Notes"}
            </Button>{" "}
          </HStack>
        </GridItem>
        <GridItem colSpan={[0, 0, 0, 1]} display={["none", "none", "none", "block"]}>
          <Box height="full" w="52">
            <SyllabusForCurrentAffairs book={book} changeParentProps={setSyllabus} />
          </Box>
        </GridItem>
        <GridItem colSpan={[5, 5, 5, 4]}>
          <Center>
            {" "}
            <Text fontWeight="bold" color="gray.600" justifySelf="center" p="2" mb="2">
              {selectedSyllabus === undefined ? "Select Date to View Content" : selectedSyllabus.subheading}
            </Text>
          </Center>
          {isLoading && selectedSyllabus && (
            <Center mt="8" w="full">
              {" "}
              Please wait, Loading...
            </Center>
          )}
          {data && data.length == 0 && (
            <Center mt="8" w="full">
              <InfoAlert info={"No notes found. We are Covering from 1-Jun onwards."} />{" "}
            </Center>
          )}
          <VStack spellCheck="false" alignItems="start" visibility={selectedSyllabus === undefined ? "hidden" : undefined}>
            <Accordion allowMultiple width={"full"}>
              {data?.map((x: any) => {
                return (
                  <AccordionItem key={x.id} borderTopWidth="0px" borderBottomWidth="0px" mb="6">
                    {({ isExpanded }) => (
                      <>
                        <VStack alignItems={"start"}>
                          {x.current_affair_tags && x.current_affair_tags.length > 0 ? (
                            <Wrap spacing="5px" mb="-2">
                              {(x.current_affair_tags as number[]).map((x1) => {
                                for (let index = 0; index < currentAffairTags.length; index++) {
                                  const element = currentAffairTags[index];
                                  if (element.id == x1) {
                                    return (
                                      <Button
                                        size="xs"
                                        key={element.id}
                                        // onClick={() => {
                                        //   setIsTagSearchActive(true);
                                        //   setTagsArray!([element.id]);
                                        // }}
                                        bg="white"
                                        px="1.5"
                                        // fontWeight={"normal"}
                                        // fontSize="xs"
                                        mx="2"
                                      >
                                        {element.tag}
                                      </Button>
                                    );
                                  }
                                }
                              })}
                            </Wrap>
                          ) : null}
                          <HStack w="full">
                            <AccordionButton bg="gray.100" _expanded={{ bg: "gray.300" }}>
                              <Box flex="1" textAlign="left">
                                <Flex alignSelf="start" alignItems="center">
                                  <Text
                                    alignSelf={"baseline"}
                                    // bg="brand.100"
                                    p="2"
                                    fontSize="16px"
                                    align="left"
                                  >
                                    <Text as="b">In News :- </Text> {sentenseCase(x.article_title)}
                                  </Text>
                                </Flex>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <DeleteConfirmation
                              handleDelete={deleteArticle}
                              dialogueHeader={"Delete this Article?"}
                              display={isAdminNotes && profile?.role !== "ADMIN" ? "none" : undefined}
                              isIconButton={true}
                              id={x.id}
                            ></DeleteConfirmation>
                          </HStack>
                        </VStack>
                        <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: 0, lg: "4" }}>
                          {/* {isExpanded && ( */}
                          <Tabs
                            variant="line"
                            size="sm"
                            colorScheme="gray"
                            width="full"
                            index={language === "ENG" ? 0 : 1}
                            onChange={handleTabsChange}
                          >
                            <TabList>
                              <Tab>English</Tab>
                              <Tab>Hindi</Tab>
                            </TabList>
                            <TabPanels>
                              <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                <SuneditorSimple
                                  article={x}
                                  content={x.article_english}
                                  saveCallback={saveArticle}
                                  language={"ENG"}
                                  userrole={profile?.role!}
                                  isAdminNotes={isAdminNotes}
                                  canCopy={x.created_by.id !== user?.id}
                                  copyCallback={handleCopyNotes}
                                ></SuneditorSimple>
                              </TabPanel>
                              <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                <SuneditorSimple
                                  article={x}
                                  content={x.article_hindi}
                                  saveCallback={saveArticle}
                                  language={"HINDI"}
                                  userrole={profile?.role!}
                                  isAdminNotes={isAdminNotes}
                                  canCopy={x.created_by.id !== user?.id}
                                  copyCallback={handleCopyNotes}
                                ></SuneditorSimple>
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
            <Button
              // mb="48"
              // _groupHover={{ size: "" }}
              display={!profile || isAdminNotes ? "none" : undefined}
              ml="2"
              onClick={() => {
                setArticleFormMode(articleFormMode !== "NONE" ? "NONE" : "CREATING");
              }}
              // borderRadius={"full"}
              variant="solid"
              size="lg"
              // colorScheme="gray"
              leftIcon={articleFormMode !== "NONE" ? <MdCancel /> : <MdAdd />}
            >
              {articleFormMode !== "NONE" ? "Cancel" : "Create New Notes"}
            </Button>
            {!user && (
              <Center w="full" p="16">
                <LoginCard redirect={`${BASE_URL}/dna`} />
              </Center>
            )}

            <Box display={articleFormMode === "NONE" ? "none" : !profile || isAdminNotes ? "none" : undefined}>
              <ArticleForm
                subjectId={undefined}
                subheadingid={selectedSyllabus?.subheading_id}
                question_year={undefined}
                question_type={undefined}
                formMode={"CREATING"}
                setParentProps={changeParentProps}
              />
            </Box>
            <br />
            <br />
            <br />
            <br />
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

(CurrentAffair as PageWithLayoutType).layout = LayoutWithTopNavbar;
export default CurrentAffair;

type ArticleFormProps = {
  tags?: unknown[] | undefined;
  subjectId: number | undefined;
  subheadingid: number | undefined;
  articleId?: number;
  articleTitle?: string;
  sequence?: number;
  question_year: number | undefined;
  question_type: string | undefined;
  formMode: "CREATING" | "EDITING";
  x?: React.Dispatch<React.SetStateAction<"CREATING" | "EDITING" | "NONE">> | undefined;
  setParentProps: () => void;
};

type Inputs = {
  articleTitle: string;
  sequence: number;
  tags: unknown[] | undefined;
  questionType: "MODEL" | "PREV" | "NONE" | undefined;
  question_year: number | undefined;
  isQuestion: boolean;
  // tags1: string | undefined;
};

const ArticleForm: React.FC<ArticleFormProps> = ({
  tags,
  // subjectId,
  subheadingid,
  formMode,
  articleId,
  articleTitle,
  sequence,
  question_type,
  question_year,

  setParentProps,
  x,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuthContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      articleTitle: articleTitle,
      sequence: sequence,
      isQuestion: question_type === "MODEL" || question_type === "PREV",
      questionType: question_type as "MODEL" | "PREV" | "NONE" | undefined,
      question_year: question_year === 0 ? undefined : question_year,
      tags: [],
    },
    shouldUnregister: true,
  });
  const watchQuestionType = watch("questionType");
  const watchIsQuestion = watch("isQuestion");

  const onSubmit: SubmitHandler<Inputs> = async (d) => {
    setIsLoading(true);
    if (formMode === "CREATING") {
      const { data, error } = await supabaseClient.from<definitions["books_articles"]>("books_articles").insert([
        {
          article_title: d.articleTitle,
          created_by: profile?.id,
          books_subheadings_fk: subheadingid,
          sequence: d.sequence,
          current_affair_tags: d.tags ? d.tags : [],
          question_type: d.questionType ? d.questionType : "NONE",
          question_year: d.question_year ? d.question_year : 0,
        },
      ]);
      if (error) {
        elog("MyNotes->onSubmit", error.message);
        return;
      }
    }

    if (formMode === "EDITING") {
      const { data, error } = await supabaseClient
        .from<definitions["books_articles"]>("books_articles")
        .update({
          // id: articleId,
          article_title: d.articleTitle,
          // created_by: profile?.id,
          // books_subheadings_fk: subheadingid,
          sequence: d.sequence,
          current_affair_tags: d.tags ? d.tags : [],
          question_type: d.questionType ? d.questionType : "NONE",
          question_year: d.question_year ? d.question_year : 0,
        })
        .eq("id", articleId);
      if (error) {
        elog("MyNotes->onSubmit", error.message);
        return;
      }
    }
    // x("NONE");
    setParentProps();
    setIsLoading(false);
  };
  return (
    <Flex justifyContent="center" alignItems={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems={"center"} p="2">
          <FormControl p="2" isInvalid={errors.articleTitle as any} maxW="500px">
            <Textarea
              size="sm"
              minW={{ base: "300px", md: "500px" }}
              focusBorderColor="brand.500"
              placeholder="Notes Heading"
              {...register("articleTitle", { required: "This is required" })}
            />
            <FormErrorMessage>{errors.articleTitle && errors.articleTitle.message}</FormErrorMessage>
          </FormControl>
          <FormControl p="2" isInvalid={errors.articleTitle as any} maxW="500px">
            <Input
              size="sm"
              focusBorderColor="brand.500"
              type="number"
              placeholder="Notes Sequence (1,2,3  ....)"
              {...register("sequence", { required: "This is required" })}
            />
            <FormErrorMessage>{errors.sequence && errors.sequence.message}</FormErrorMessage>
          </FormControl>
          <Checkbox
            size="sm"
            colorScheme="brand"
            {...register("isQuestion")}
            defaultChecked={question_type === "MODEL" || question_type === "PREV"}
          >
            <Text casing="capitalize">Mark this as Question</Text>
          </Checkbox>
          {watchIsQuestion && (
            <Box>
              <FormControl p="2" isInvalid={errors.questionType as any} maxW="500px" bg="gray.50">
                <RadioGroup defaultValue={question_type} size="sm">
                  <Radio
                    {...register("questionType", { required: "This is required" })}
                    value="MODEL"
                    pr="14"
                    colorScheme={"brand"}
                  >
                    <Text casing="capitalize">Model Question</Text>
                  </Radio>
                  <Radio {...register("questionType", { required: "This is required" })} value="PREV" colorScheme={"brand"}>
                    <Text casing="capitalize">Previous year Question</Text>
                  </Radio>
                </RadioGroup>
                <FormErrorMessage>{errors.questionType && errors.questionType.message}</FormErrorMessage>
              </FormControl>
              {watchQuestionType === "PREV" && (
                <FormControl p="2" isInvalid={errors.question_year as any} maxW="500px">
                  <Input
                    size="sm"
                    focusBorderColor="brand"
                    type="number"
                    placeholder="Question year (1995-2022)"
                    {...register("question_year", { required: true, min: 1995, max: 2022 })}
                  />
                  <FormErrorMessage>{errors.question_year && errors.question_year.message}</FormErrorMessage>
                </FormControl>
              )}
            </Box>
          )}
        </VStack>

        {/* {subjectId === 60 ? ( */}
        <VStack py="4">
          <Text bg="brand.100" fontSize="xs">
            {" "}
            # Select Tags from below. Tags marked ⭐ are main Topics, others are subtopics. Topics taken from UPSC
            notification. Some Extra Tags are for segregation purposes.
          </Text>
          <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }} gap={"1"}>
            {currentAffairTags.map((value) => (
              <Box key={value.id}>
                <Checkbox
                  px="2"
                  colorScheme={"brand"}
                  defaultChecked={tags?.includes(value.id) ? true : false}
                  size="sm"
                  type="checkbox"
                  value={value.id}
                  {...register("tags")}
                >
                  <Text casing="capitalize" as="label">
                    {value.tag}
                  </Text>
                </Checkbox>
              </Box>
            ))}
          </Grid>
        </VStack>
        {/* ) : null} */}

        <Button type="submit" isLoading={isLoading} colorScheme="facebook" aria-label="Call Sage" leftIcon={<MdDone />}>
          Done
        </Button>
      </form>
    </Flex>
  );
};

interface Props {
  book: BookResponse | undefined;
  changeParentProps: (x: BookSyllabus) => void;
}

const SyllabusDrawer: React.FC<Props> = ({ book, changeParentProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <>
      <Button size={{ base: "sm", sm: "sm", md: "md" }} ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Select Date
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Select Date from Month</DrawerHeader>

          <DrawerBody>
            <SyllabusForCurrentAffairs book={book} changeParentProps={changeParentProps} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Database logic here
//   const { user } = await getUser(context);
//   console.log("user is " + user?.id);
//   const { data } = await supabaseServerClient(context)
//     .from<definitions["books_articles"]>("books_articles")
//     .select("*")
//     .eq("created_by", user?.id)
//     .limit(10);
//   // .single();
//   // console.log("article is " + data?.id);
//   const d = 5;
//   return {
//     props: { data, d }, // will be passed to the page component as props
//   };
// };
