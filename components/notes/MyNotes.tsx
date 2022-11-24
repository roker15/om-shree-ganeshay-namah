import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import "katex/dist/katex.min.css";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { MdAdd, MdCancel, MdDone, MdOutlineContentCopy, MdOutlineMenuOpen } from "react-icons/md";
// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
import { useSWRConfig } from "swr";
import { useGetUserArticles, useGetUserArticless } from "../../customHookes/networkHooks";
import { currentAffairTags } from "../../lib/constants";
import { Database } from "../../lib/database";
import { elog, sentenseCase } from "../../lib/mylog";
import { useAuthContext } from "../../state/Authcontext";
import { useNoteContext } from "../../state/NoteContext";
import { customToast } from "../CustomToast";
import SuneditorForNotesMakingg from "../editor/SuneditorForNotesMakingg";
import ErrorBoundary from "../ErrorBoundary";

import DeleteConfirmation from "../syllabus/DeleteConfirmation";
// import "../../styles/suneditor.module.css";
interface Props {
  subjectId: number | undefined;
  subheadingid: number | undefined;
  notesCreator: string | undefined;
  isCopyable: boolean | undefined;
  isEditable: boolean | undefined;
  changeParentProps: () => void;
}
type Inputs = {
  articleTitle: string;
  sequence: number;
  tags: unknown[] | undefined;
  questionType: "MODEL" | "PREV" | "NONE" | undefined;
  question_year: number | undefined;
  isQuestion: boolean;
  // tags1: string | undefined;
};

function CustomIconbutton(props: { handleArticleEdit: (arg0: any, arg1: boolean) => void; id: any; icon: IconType }) {
  return (
    <IconButton
      display="none"
      _groupHover={{
        display: "center",
      }} // _hover={{ color: "pink", fontSize: "22px" }}
      size="xs" // ml="2"
      borderRadius={"full"}
      variant="outline"
      colorScheme="whatsapp"
      aria-label="Call Sage"
      fontSize="20px"
      onClick={() => props.handleArticleEdit(props.id, false)}
      icon={<props.icon />}
    />
  );
}

const MyNotes: React.FC<Props> = ({ subheadingid, notesCreator, changeParentProps, isCopyable, isEditable }) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const { data: articles, isLoading: isArticleLoading, swrError } = useGetUserArticless(subheadingid, notesCreator);
  const [isLoadingCopyButton, setIsLoadingCopyButton] = useState<boolean | undefined>(false);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState<number | undefined>();
  const [isArticleCreating, setIsArticleCreating] = useState<"CREATING" | "EDITING" | "NONE">("NONE");
  const { mutate } = useSWRConfig();
  const { setIsTagSearchActive, setTagsArray, tagsArray } = useNoteContext();
  // const { article, isError, isLoading } = useGetArticleById(article1);
  const deleteArticle = async (id: number): Promise<void> => {
    const { data, error } = await supabaseClient.from("books_articles").delete().eq("id", id);
    if (error) {
      elog("MyNotes->deleteArticle", error.message);
      return;
    }
    if (data) {
      mutate([`/get-user-articles/${subheadingid}/${profile?.id}`]);
    }
  };

  const handleArticleEdit = (articleId: number | undefined, isCancel: boolean) => {
    if (isCancel) {
      setSelectedArticleForEdit(undefined);
      setIsArticleCreating("NONE");
    } else {
      setSelectedArticleForEdit(articleId);
      setIsArticleCreating("EDITING");
    }
  };

  const copyArticleToNewUser = async (x: Database["public"]["Tables"]["books_articles"]["Row"]) => {
    setIsLoadingCopyButton(true);
    const { data, error } = await supabaseClient.from("books_articles").insert({
      books_subheadings_fk: x.books_subheadings_fk,
      article_hindi: x.article_hindi,
      article_english: x.article_english,
      article_audio_link: x.article_audio_link,
      created_by: profile?.id!,
      article_title: x.article_title,
      sequence: x.sequence,
      copied_from_articleid: x.id,
      copied_from_userid: x.created_by,
    });
    if (error) {
      elog("MyNotes->copyArticleToNewUser", error.message);
      return;
    }
    if (data) {
      customToast({ title: "Article copied, Check inside your notes", status: "success", isUpdating: false });
    }
    setIsLoadingCopyButton(false);
  };
  return (
    <Box mt="16" >
      <Accordion allowMultiple >
        {articles
          ?.sort((a, b) => a.sequence! - b.sequence!)
          .map((x) => {
            return (
              <AccordionItem
                key={x.id}
                borderTopWidth="0px"
                borderBottomWidth="0px"
               
                my={x.current_affair_tags && x.current_affair_tags.length > 0 ? "6" : "2"}
              >
                {({ isExpanded }) => (
                  <Box key={x.id}>
                    {isCopyable && (
                      <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="whatsapp"
                        aria-label="Call Sage"
                        fontSize="20px"
                        isLoading={isLoadingCopyButton}
                        onClick={() => copyArticleToNewUser(x)}
                        icon={<MdOutlineContentCopy />}
                      />
                    )}
                    <Flex alignItems="left">
                      <Box display={profile?.id !== notesCreator ? "none" : "undefined"}>
                        <Menu>
                          <MenuButton as={IconButton} aria-label="Options" icon={<MdOutlineMenuOpen />} variant="link" />
                          <MenuList>
                            <MenuItem icon={<EditIcon />} onClick={() => handleArticleEdit(x.id, false)}>
                              Edit Notes Heading
                            </MenuItem>
                            <MenuItem icon={<ExternalLinkIcon />} onClick={() => handleArticleEdit(undefined, true)}>
                              Cancel Edit
                            </MenuItem>

                            <MenuItem>
                              <DeleteConfirmation
                                handleDelete={deleteArticle}
                                dialogueHeader={"Delete this Article?"}
                                isIconButton={false}
                                id={x.id}
                                display={undefined}
                              ></DeleteConfirmation>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                      <VStack w="full" justifyContent="center" alignItems="left">
                        {x.current_affair_tags && x.current_affair_tags.length > 0 ? (
                          <Wrap spacing="5px">
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
                        <AccordionButton
                          bg="gray.50"
                          _expanded={{ bg: "gray.100" }}
                          justifyContent="space-between"
                          alignItems={"center"}
                          alignSelf="self-start"
                        >
                          <Text p="1" fontSize="16px" lineHeight={"tall"} align="start">
                            <Text as="b">Article Name :- </Text> {sentenseCase(x.article_title)}
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                      </VStack>
                    </Flex>
                    {isArticleCreating === "EDITING" && x.id === selectedArticleForEdit ? (
                      <ArticleForm
                        tags={x.current_affair_tags!}
                        subheadingid={subheadingid}
                        articleId={x.id}
                        articleTitle={x.article_title}
                        sequence={x.sequence!}
                        formMode={"EDITING"}
                        x={setIsArticleCreating}
                        question_year={x.question_year!}
                        question_type={x.question_type!}
                      ></ArticleForm>
                    ) : null}
                    <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: "-0.5", lg: "4" }}>
                      {isExpanded && (
                        <Tabs variant="line" size="sm" colorScheme="gray">
                          <TabList>
                            <Tab>English</Tab>
                            <Tab>Hindi</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel px={{ base: "-0.5", lg: "4" }}>
                              <ErrorBoundary>
                                <SuneditorForNotesMakingg article1={x.id} language={"ENGLISH"} isEditable={isEditable} />
                              </ErrorBoundary>
                            </TabPanel>
                            <TabPanel px={{ base: "-0.5", lg: "4" }}>
                              <ErrorBoundary>
                                <SuneditorForNotesMakingg article1={x.id} language={"HINDI"} isEditable={isEditable} />
                              </ErrorBoundary>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      )}
                    </AccordionPanel>
                  </Box>
                )}
              </AccordionItem>
            );
          })}
      </Accordion>
      <Stack align="center" justifyContent="center" pb="16" direction={"row"}>
        <Box display={isArticleCreating === "NONE" ? "none" : "block"}>
          {/* {form()} */}

          {isArticleCreating === "CREATING" && subheadingid ? (
            <ArticleForm
              subheadingid={subheadingid}
              formMode={"CREATING"}
              x={setIsArticleCreating}
              question_year={undefined}
              question_type={undefined}
            ></ArticleForm>
          ) : null}
        </Box>
        <Box display={profile?.id !== notesCreator ? "none" : "undefined"}>
          <Tooltip label="Create New Notes in This Topic" fontSize="sm">
            <span>
              <Button
                mt="28"
                // _groupHover={{ size: "" }}
                display={isArticleCreating === "CREATING" || !subheadingid ? "none" : "flex"}
                ml="2"
                onClick={() => setIsArticleCreating("CREATING")}
                // borderRadius={"full"}
                variant="solid"
                size="lg"
                colorScheme="gray"
                aria-label="Call Sage"
                leftIcon={<MdAdd />}
              >
                Create Notes
              </Button>
            </span>
          </Tooltip>
        </Box>

        {/* <Tooltip label="Create New Article in This Topic" fontSize="sm"> */}
        <IconButton
          // _groupHover={{ size: "" }}
          display={isArticleCreating === "CREATING" && subheadingid ? "flex" : "none"}
          _hover={{ color: " #FF1493" }}
          size="auto"
          ml="2"
          onClick={() => setIsArticleCreating("NONE")}
          borderRadius={"full"}
          variant="outline"
          colorScheme="red"
          aria-label="Call Sage"
          fontSize="25px"
          w="35px"
          h="35px"
          icon={<MdCancel />}
        />
        {/* </Tooltip> */}
      </Stack>
    </Box>
  );
};
export default MyNotes;

type ArticleFormProps = {
  tags?: unknown[] | undefined;
  // subjectId: number | undefined;
  subheadingid: number | undefined;
  articleId?: number;
  articleTitle?: string;
  sequence?: number;
  question_year: number | undefined;
  question_type: string | undefined;
  formMode: "CREATING" | "EDITING";
  x: React.Dispatch<React.SetStateAction<"CREATING" | "EDITING" | "NONE">>;
  setParentProps?: (x: string) => {};
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
  const supabaseClient = useSupabaseClient<Database>();
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
      // tags: [],
    },
    shouldUnregister: true,
  });
  const watchQuestionType = watch("questionType");
  const watchIsQuestion = watch("isQuestion");

  const onSubmit: SubmitHandler<Inputs> = async (d) => {
    if (formMode === "CREATING") {
      const { data, error } = await supabaseClient.from("books_articles").insert([
        {
          article_title: d.articleTitle,
          created_by: profile?.id!,
          books_subheadings_fk: subheadingid!,
          sequence: d.sequence,
          current_affair_tags: d.tags ? d.tags as number[] : [],
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
        .from("books_articles")
        .update({
          // id: articleId,
          article_title: d.articleTitle,
          // created_by: profile?.id,
          // books_subheadings_fk: subheadingid,
          sequence: d.sequence,
          current_affair_tags: d.tags ? d.tags as number[] : [],
          question_type: d.questionType ? d.questionType : "NONE",
          question_year: d.question_year ? d.question_year : 0,
        })
        .eq("id", articleId);
      if (error) {
        elog("MyNotes->onSubmit", error.message);
        return;
      }
    }
    x("NONE");
    mutate([`/get-user-articles/${subheadingid}/${profile?.id}`]);
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
              {...register("articleTitle", {
                required: "This field is required",
                maxLength: { value: 400, message: "Maximum 400 Characters allowed" },
              })}
            />
            <FormErrorMessage>{errors.articleTitle?.message}</FormErrorMessage>
          </FormControl>
          <FormControl p="2" isInvalid={errors.articleTitle as any} maxW="500px">
            <Input
              size="sm"
              focusBorderColor="brand.500"
              type="number"
              placeholder="Notes Sequence (1,2,3  ....)"
              {...register("sequence", { required: "This field is required" })}
            />
            <FormErrorMessage>{errors.sequence?.message}</FormErrorMessage>
          </FormControl>
          <Checkbox
            size="sm"
            colorScheme="brand"
            {...register("isQuestion")}
            defaultChecked={question_type === "MODEL" || question_type === "PREV"}
          >
            <Text casing="capitalize">This is a Question</Text>
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
                <FormErrorMessage>{errors.questionType?.message}</FormErrorMessage>
              </FormControl>
              {watchQuestionType === "PREV" && (
                <FormControl p="2" isInvalid={errors.question_year as any} maxW="500px">
                  <Input
                    size="sm"
                    focusBorderColor="brand"
                    type="number"
                    placeholder="Question year (1995-2022)"
                    {...register("question_year", {
                      required: "This is required",
                      min: { value: 1995, message: "min 1995" },
                      max: 2022,
                    })}
                  />
                  <FormErrorMessage>{errors.question_year?.message}</FormErrorMessage>
                </FormControl>
              )}
            </Box>
          )}
        </VStack>

        {subjectId === 60 ? (
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
        ) : null}

        <Button
          // _groupHover={{ size: "" }}
          // display={isArticleCreating === "CREATING" || !subheadingid ? "none" : "flex"}
          // _hover={{ color: " #FF1493" }}
          m="2"
          // onClick={() => setIsArticleCreating("CREATING")}
          type="submit"
          isLoading={isLoading}
          // borderRadius={"full"}
          variant="solid"
          colorScheme="facebook"
          aria-label="Call Sage"
          leftIcon={<MdDone />}
        >
          Done
        </Button>
        {/* </ButtonGroup> */}
      </form>
    </Flex>
  );
};
