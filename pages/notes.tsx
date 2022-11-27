import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
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
  VStack,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";
import { MdAdd, MdCancel, MdDone, MdLightMode, MdMoreVert, MdOutlineMenuOpen } from "react-icons/md";
import { useSWRConfig } from "swr";
import SuneditorForNotesMakingg from "../components/editor/SuneditorForNotesMakingg";
import ErrorBoundary from "../components/ErrorBoundary";
import { CustomAlert } from "../componentv2/CustomAlert";
import { useGetArticlesbyUserandSubheading, useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbarForNotes from "../layout/LayoutWithTopNavbarForNotes";
import { currentAffairTags, markitWebColor } from "../lib/constants";
import { Database } from "../lib/database";
import { elog, sentenseCase } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import { BookCtx, useNotesContextNew } from "../state/NotesContextNew";
import PageWithLayoutType from "../types/pageWithLayout";
import { ApiArticleTitle } from "./api/prisma/posts/getarticlesbyuserandsubheading";
import { Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
import { DeleteAlert } from "./manageSyllabusv2";
// import { GotoQuestion } from "..";

const Notes: React.FC = () => {
  const { book, selectedSubheading } = useNotesContextNew();
  return (
    <Box>
      {!book ? (
        <CustomAlert title={"Syllabus not Selected"} des={"Select Syllabus from top to Create or View Notes"} />
      ) : (
        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          <GridItem w="100%" colSpan={2} minH="100vh" bg="brand.50">
            <Syllabus />
          </GridItem>
          <GridItem w="100%" colSpan={5}>
            <NotesContainer />
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

(Notes as PageWithLayoutType).layout = LayoutWithTopNavbarForNotes;
export default Notes;

const Syllabus: React.FunctionComponent = () => {
  const { book } = useNotesContextNew();
  const { profile } = useAuthContext();
  const user = useUser();
  const { data, swrError } = useGetSyllabusByBookId(book?.bookId);

  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && (
        <VStack display="inline-block">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text casing="capitalize" fontSize="lg" fontWeight="medium" color={markitWebColor}>
              {book?.bookName}
            </Text>
          </HStack>
          <VStack alignItems="left" spacing="4">
            {data?.books_headings.map((headings) => (
              <Headings key={headings.id} headings={headings} />
            ))}
          </VStack>
        </VStack>
      )}{" "}
    </Box>
  );
};

const Headings = (props: { headings: Data_headings }) => {
  const [hide, setHide] = useState(true);
  return (
    <VStack key={Number(props.headings!.id!)} alignItems="left">
      <HStack
        alignItems={"baseline"}
        onClick={() => {
          setHide(!hide);
        }}
      >
        <IconButton variant="ghost" size="md" aria-label="Call Sage" icon={hide ? <MdAdd /> : <MdLightMode />} />
        <Text casing={"capitalize"} cursor="pointer" as="address" color=" #FF1493">
          {props.headings.heading}
        </Text>
      </HStack>
      <VStack alignItems={"left"} pl="16" spacing="4" display={hide ? "none" : undefined}>
        {props.headings.books_subheadings.map((subheading) => (
          <Subheading key={subheading.id} subheading={subheading} />
        ))}
      </VStack>
    </VStack>
  );
};
const Subheading = (props: { subheading: Data_subheadings }) => {
  const { setSelectedSubheading } = useNotesContextNew();
  const changeContextSubheading = () => {
    setSelectedSubheading({ id: props.subheading.id, name: props.subheading.subheading! });
  };
  return (
    <Text fontSize={"sm"} casing={"capitalize"} cursor="pointer" onClick={changeContextSubheading}>
      {props.subheading.subheading}
    </Text>
  );
};

const NotesContainer = () => {
  const { book, selectedSubheading } = useNotesContextNew();
  const [formMode, setFormMode] = useState<"CREATING" | "EDITING" | undefined>(undefined);
  const [selectedNotes, setSelectedNotes] = useState<ApiArticleTitle | undefined>(undefined);
  const changeFormProps = (x: ApiArticleTitle| undefined) => {
    setSelectedNotes(x);
    setFormMode("EDITING");
  };
  

  return (
    <div>
      {selectedNotes?.id}
      {!selectedSubheading && (
        <CustomAlert title={"Topic not Selected"} des={"Select Topic from Syllabus to Create or View Notes"} />
      )}
      {selectedSubheading && (
        <Center h="16">
          <Text casing="capitalize" fontSize="lg" fontWeight="medium" color={markitWebColor}>
            {selectedSubheading.name}
          </Text>
        </Center>
      )}
      {selectedSubheading && <NoteList subheadingId={selectedSubheading?.id!} onChangeCallback={changeFormProps} />}
      {formMode && (
        <ArticleForm
          id={undefined}
          subheadingid={0}
          mutate={undefined}
          subjectId={0}
          formInput={{
            articleTitle: undefined,
            sequence: undefined,
            isQuestion: false,
            questionType: undefined,
            question_year: undefined,
            tags: undefined,
          }}
        />
      )}
      <Button
        onClick={() => setFormMode(formMode ? undefined : "CREATING")}
        variant="solid"
        size="lg"
        colorScheme="gray"
        aria-label="Call Sage"
        leftIcon={formMode ? <MdCancel /> : <MdAdd />}
      >
        {formMode ? "Cancel" : "Create New Notes"}
      </Button>
    </div>
  );
};

export const NoteList = (props: {
  subheadingId: number;
  onChangeCallback: (x: ApiArticleTitle| undefined)=>void;
}) => {
  const supabaseClient = useSupabaseClient<Database>();
  const { profile } = useAuthContext();
  const { articleTitles } = useGetArticlesbyUserandSubheading({ subheadingId: props.subheadingId, creatorId: profile?.id! });

  return (
    <Box mt="16">
      <Accordion allowMultiple>
        <VStack>
          {articleTitles
            ?.sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => (
              <HStack key={x.id} w="full">
                <NotesContextMenu article={x} onChangeCallback={props.onChangeCallback} />
                <AccordionItem w="full" borderTopWidth="0px" borderBottomWidth="0px">
                  {({ isExpanded }) => (
                    <Box key={x.id}>
                      <Flex alignItems="left">
                        <AccordionButton
                          bg="pink.100"
                          _hover={{ color: markitWebColor }}
                          _expanded={{ bg: "blue.50", color: markitWebColor }}
                          justifyContent="space-between"
                        >
                          <Text p="1" fontSize="16px" lineHeight={"tall"} align="start">
                            <Text as="b">Article Name :- </Text> {sentenseCase(x.article_title)}
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>

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
                                  <SuneditorForNotesMakingg article1={x.id} language={"ENGLISH"} isEditable={true} />
                                </ErrorBoundary>
                              </TabPanel>
                              <TabPanel px={{ base: "-0.5", lg: "4" }}>
                                <ErrorBoundary>
                                  <SuneditorForNotesMakingg article1={x.id} language={"HINDI"} isEditable={true} />
                                </ErrorBoundary>
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        )}
                      </AccordionPanel>
                    </Box>
                  )}
                </AccordionItem>
              </HStack>
            ))}
        </VStack>
      </Accordion>
    </Box>
  );
};

const NotesContextMenu = (props: {
  article: ApiArticleTitle | undefined;
  onChangeCallback: (x: ApiArticleTitle| undefined)=>void;
}) => {
  return (
    <Menu>
      <MenuButton>
        <MdMoreVert />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<EditIcon />} onClick={() => props.onChangeCallback(props.article)}>
          Edit Notes Title
        </MenuItem>

        <MenuItem>
          <Box ml="-1.5">
            <DeleteAlert
              handleDelete={function (id: number): Promise<void> {
                throw new Error("Function not implemented.");
              }}
              dialogueHeader={"Delete Article"}
              id={props.article!.id}
            />
          </Box>
          <Box ml="2">Delete Article</Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
interface IArticleForm {
  id: number | undefined;
  subheadingid: number;
  mutate: any;
  subjectId: number;
  formInput: {
    articleTitle: string | undefined;
    sequence: number | undefined;
    isQuestion: boolean;
    questionType: "MODEL" | "PREV" | "NONE" | undefined;
    question_year: number | undefined;
    tags: number[] | undefined;
  };
}
const ArticleForm = (props: IArticleForm) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [isLoading, setIsLoading] = useState();
  const { mutate } = useSWRConfig();
  const { profile } = useAuthContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IArticleForm["formInput"]>({
    defaultValues: {
      articleTitle: props.formInput.articleTitle,
      sequence: props.formInput.sequence,
      isQuestion: props.formInput.isQuestion,
      questionType: props.formInput.questionType,
      question_year: props.formInput.question_year,
      tags: props.formInput.tags,
    },
    shouldUnregister: true, // This to prevent submitting hidden form values
  });
  const watchQuestionType = watch("questionType");
  const watchIsQuestion = watch("isQuestion");

  const onSubmit: SubmitHandler<IArticleForm["formInput"]> = async (d) => {
    const { data, error } = await supabaseClient.from("books_articles").upsert([
      {
        id: props.id,
        article_title: d.articleTitle!,
        created_by: profile?.id!,
        books_subheadings_fk: props.subheadingid,
        sequence: d.sequence,
        current_affair_tags: d.tags ? (d.tags as number[]) : [],
        question_type: d.questionType ? d.questionType : "NONE",
        question_year: d.question_year ? d.question_year : 0,
      },
    ]);
    if (error) {
      elog("MyNotes->onSubmit", error.message);
      return;
    }
    props.mutate();
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
            defaultChecked={props.formInput.questionType === "MODEL" || props.formInput.questionType === "PREV"}
          >
            <Text casing="capitalize">This is a Question</Text>
          </Checkbox>
          {watchIsQuestion && (
            <Box>
              <FormControl p="2" isInvalid={errors.questionType as any} maxW="500px" bg="gray.50">
                <RadioGroup defaultValue={props.formInput.questionType} size="sm">
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

        {props.subjectId === 60 && (
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
                    defaultChecked={props.formInput.tags?.includes(value.id) ? true : false}
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
        )}

        <Button
          m="2"
          type="submit"
          isLoading={isLoading}
          // borderRadius={"full"}
          variant="solid"
          colorScheme="facebook"
          leftIcon={<MdDone />}
        >
          Done
        </Button>
        {/* </ButtonGroup> */}
      </form>
    </Flex>
  );
};
