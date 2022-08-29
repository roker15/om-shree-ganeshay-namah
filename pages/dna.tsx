import { Box } from "@chakra-ui/layout";
import {
  Button,
  Text,
  Container,
  Heading,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  SimpleGrid,
  Grid,
  GridItem,
  VStack,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  Center,
  Wrap,
  HStack,
} from "@chakra-ui/react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { currentAffairTags, sunEditorButtonList } from "../lib/constants";
import { definitions } from "../types/supabase";
// import DOMPurify from "dompurify";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";
import { MdAdd, MdCancel, MdDone, MdFileCopy, MdModeEdit } from "react-icons/md";
import { elog, sentenseCase } from "../lib/mylog";
import { customToast } from "../components/CustomToast";
import { BookResponse, BookSyllabus } from "../types/myTypes";
import SyllabusForCurrentAffairs from "../components/CurrentAffair/SyllabusForCurrentAffairs";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSWRConfig } from "swr";
import { useAuthContext } from "../state/Authcontext";
import { useGetCurrentAffairs } from "../customHookes/networkHooks";
import DeleteConfirmation from "../components/syllabus/DeleteConfirmation";
import LayoutWithTopNavbar from "../layout/LayoutWithTopNavbar";
import PageWithLayoutType from "../types/pageWithLayout";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function SuneditorSimple(props: {
  id: number;
  content: string;
  language: "HINDI" | "ENG";
  saveCallback: (id: number, content: string, language: "ENG" | "HINDI") => void;
}) {
  const [readMode, setReadMode] = useState<boolean>(true);
  return (
    <Box className={readMode ? "zaza" : "zazaza"}>
      <Flex justifyContent="space-between">
        <Button
          size="xs"
          leftIcon={<MdModeEdit />}
          onClick={() => {
            setReadMode(!readMode);
          }}
        >
          {readMode ? "Edit" : "Read"}
        </Button>
        <Button
          size="xs"
          ml="2"
          leftIcon={<MdFileCopy />}
          onClick={() => {
            setReadMode(!readMode);
          }}
        >
          Copy this Note
        </Button>
      </Flex>
      <SunEditor
        setDefaultStyle="font-family: arial; font-size: 14px;"
        defaultValue={props.content}
        hideToolbar={readMode}
        readOnly={readMode}
        setOptions={{
          callBackSave(contents, isChanged) {
            props.saveCallback(props.id, contents, props.language);
          },
          mode: "classic",
          katex: katex,
          height: "100%",
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
  const [language, setLangauge] = useState<"ENG" | "HINDI">("ENG");
  const [isAdminNotes, setIsAdminNotes] = useState<boolean>(true);
  const { profile } = useAuthContext();
  const [articleFormMode, setArticleFormMode] = useState<"CREATING" | "EDITING" | "NONE">("NONE");
  const [selectedSyllabus, setSelectedSyllabus] = useState<BookSyllabus | undefined>();

  const { user } = useUser();
  const { data, mutate } = useGetCurrentAffairs(isAdminNotes, selectedSyllabus?.subheading_id!, user?.id!);

  const handleTabsChange = (index: any) => {
    setLangauge(index === 0 ? "ENG" : "HINDI");
  };
  const changeParentProps = () => {
    mutate();
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

  const book: BookResponse = {
    id: 125,
    book_name: "News and PIB",
  };
  return (
    <Container maxW="7xl" py="2">
      <Grid templateColumns="repeat(5, 1fr)" rowGap={2}>
        <GridItem colSpan={1}></GridItem>
        <GridItem colSpan={4}>
          {" "}
          {/* <Button
            colorScheme="telegram"
            onClick={() => {
              // setData(data);
              setLangauge(language === "ENG" ? "HINDI" : "ENG");
            }}
          >
            {language === "ENG" ? "Switch to Hindi" : "Switch to English"}
          </Button>{" "} */}
          <Button
            colorScheme="telegram"
            onClick={() => {
              // setData(data);
              setIsAdminNotes(!isAdminNotes);
            }}
          >
            {isAdminNotes ? "Switch to Personal Notes" : "Switch to Official Notes"}
          </Button>{" "}
        </GridItem>
        <GridItem colSpan={1} >
          <Box height="full" w="52">
            <SyllabusForCurrentAffairs book={book} changeParentProps={setSyllabus} />
          </Box>
        </GridItem>
        <GridItem colSpan={4} >
          <Center>
            {" "}
            <Text fontWeight="bold" color="gray.600" justifySelf="center" p="2" mb="2">
              {selectedSyllabus === undefined ? "Select Date to View Content" : selectedSyllabus.subheading}
            </Text>
          </Center>
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
                            <AccordionButton bg="gray.50" _expanded={{ bg: "blackAlpha.50" }}>
                              <Box flex="1" textAlign="left">
                                <Flex alignSelf="start" alignItems="center">
                                  <Text
                                    alignSelf={"baseline"}
                                    // bg="brand.100"
                                    p="2"
                                    fontSize="14px"
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
                              isDisabled={false}
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
                                  id={x.id}
                                  content={x.article_english}
                                  saveCallback={saveArticle}
                                  language={"ENG"}
                                ></SuneditorSimple>
                              </TabPanel>
                              <TabPanel px={{ base: 0, lg: "4" }} width="full">
                                <SuneditorSimple
                                  id={x.id}
                                  content={x.article_hindi}
                                  saveCallback={saveArticle}
                                  language={"HINDI"}
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
              display={profile?.role !== "ADMIN" && isAdminNotes ? "none" : undefined}
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
              {articleFormMode !== "NONE" ? "Cancel" : "Create Notes"}
            </Button>
            <br />
            <br />
            <br />
            <br />
            <Box display={articleFormMode === "NONE" ? "none" : undefined}>
              <ArticleForm
                subjectId={undefined}
                subheadingid={selectedSyllabus?.subheading_id}
                question_year={undefined}
                question_type={undefined}
                formMode={"CREATING"}
                setParentProps={changeParentProps}
              />
            </Box>
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
  const [isLoading, setIsLoading] = useState();
  const { mutate } = useSWRConfig();
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
              <>
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
              </>
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
