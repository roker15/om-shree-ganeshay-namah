import { EditIcon } from "@chakra-ui/icons";
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
  Container,
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
  Spinner,
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
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdCancel, MdDone, MdLightMode, MdMoreVert } from "react-icons/md";
import { useSWRConfig } from "swr";
// import { ArticleCounter } from "../components/CurrentAffair/SyllabusForCurrentAffairs";
import ErrorBoundary from "../components/ErrorBoundary";
import { ArticleCounter } from "../componentv2/ArticleCounter";
import { CustomAlert } from "../componentv2/CustomAlert";
import { DeleteAlert } from "../componentv2/DeleteAlert";
import SuneditorForNotesMakingg from "../componentv2/editor/SuneditorForNotesMakingg";
import LandingPageCurrentAffairs from "../componentv2/LandingPageCurrentAffairs";
import NotesSearchResult from "../componentv2/NotesSearchResult";
import NotesSharing from "../componentv2/NotesSharing";
import SharedNotesPanel from "../componentv2/SharedNotesPanel";
import { useGetArticlesbyUserandSubheading, useGetSyllabusByBookId } from "../customHookes/apiHooks";
import LayoutWithTopNavbarForNotes from "../layout/LayoutWithTopNavbarForNotes";
import { colorPrimary, currentAffairTags, fontPrimary } from "../lib/constants";
import { Database } from "../lib/database";
import { elog, sentenseCase } from "../lib/mylog";
import { useAuthContext } from "../state/Authcontext";
import { useNotesContextNew } from "../state/NotesContextNew";
import PageWithLayoutType from "../types/pageWithLayout";
import { ApiArticleTitle } from "./api/prisma/posts/getarticlesbyuserandsubheading";
import { Data_headings, Data_subheadings } from "./api/prisma/syllabus/syllabus";
// import { GotoQuestion } from "..";
const Notes: React.FC = () => {
  const { book, selectedSubheading, setNotesCreator, notesCreator, searchText } = useNotesContextNew();
  const changeContextNotesCreator = (id: string, name: string) => {
    setNotesCreator({ id: id, name: name });
  };
  if (searchText) {
    return (
      <Container maxW="5xl">
        <NotesSearchResult searchKeys={searchText}  />
      </Container>
    );
  }
  return (
    <Box>
      {!book && (
        <VStack>
          <CustomAlert title={"Syllabus not selected"} des={"Select syllabus from top to create or view notes"} />{" "}
          <LandingPageCurrentAffairs />
        </VStack>
      )}

      {book && (
        <Grid templateColumns="repeat(9, 1fr)" gap={0.5}>
          <GridItem w="100%" colSpan={2} minH="100vh" bg="brand.50">
            <Syllabus bookId={book.bookId} bookName={book.bookName} />
          </GridItem>
          <GridItem w="100%" colSpan={6}>
            <NotesContainer />
          </GridItem>
          <GridItem w="100%" colSpan={1} bg="brand.50">
            <SharedNotesPanel subheadingid={selectedSubheading?.id} changeParentProps={changeContextNotesCreator} />
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

(Notes as PageWithLayoutType).layout = LayoutWithTopNavbarForNotes;
export default Notes;

export const Syllabus = (props: { bookId: number | undefined; bookName: string | undefined }) => {
  // const { book } = useNotesContextNew();
  const user = useUser();
  const { data, swrError, isLoading } = useGetSyllabusByBookId(props.bookId);

  return (
    <Box maxW="full" p="2" bg="brand.50">
      {user && (
        <VStack display="inline-block" w="full">
          <HStack bg="brand.50" alignItems={"baseline"} p="4">
            <Text fontFamily={fontPrimary} casing="capitalize" fontSize="lg" fontWeight="bold" color={colorPrimary}>
              {props?.bookName}
            </Text>
          </HStack>
          {isLoading ? (
            <Center h="70vh" w="full">
              <Spinner />
            </Center>
          ) : (
            <VStack alignItems="left" spacing="4">
              {data?.books_headings.map((headings) => (
                <Headings key={headings.id} headings={headings} />
              ))}
            </VStack>
          )}
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
      {!hide && (
        <VStack alignItems={"left"} pl="12" spacing="4">
          {props.headings.books_subheadings.map((subheading) => (
            <Subheading key={subheading.id} subheading={subheading} />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
const Subheading = (props: { subheading: Data_subheadings }) => {
  const { setSelectedSubheading, setNotesCreator } = useNotesContextNew();
  const { profile } = useAuthContext();
  const changeContextSubheading = () => {
    setSelectedSubheading({ id: props.subheading.id, name: props.subheading.subheading! });
    setNotesCreator({ id: profile?.id, name: profile?.username });
  };
  return (
    <HStack>
      <Text fontSize={"sm"} cursor="pointer" onClick={changeContextSubheading}>
        {sentenseCase(props.subheading.subheading!)}
      </Text>
      {profile && <ArticleCounter subheadingId={props.subheading.id} creatorId={profile.id} />}
    </HStack>
  );
};

const NotesContainer = () => {
  const { book, selectedSubheading, notesCreator } = useNotesContextNew();
  const [formMode, setFormMode] = useState<"CREATING" | "EDITING" | undefined>(undefined);
  const [selectedNotes, setSelectedNotes] = useState<ApiArticleTitle | undefined>(undefined);
  const { mutate } = useGetArticlesbyUserandSubheading({
    subheadingId: selectedSubheading?.id!,
    creatorId: notesCreator?.id!,
  });
  useEffect(() => {
    setFormMode(undefined);
    setSelectedNotes(undefined);
  }, [selectedSubheading]);

  const changeFormProps = (x: ApiArticleTitle | undefined) => {
    setSelectedNotes(x);
    setFormMode("EDITING");
  };

  return (
    <div>
      {!selectedSubheading && (
        <CustomAlert title={"Topic not Selected"} des={"Select Topic from Syllabus to Create or View Notes"} />
      )}
      {selectedSubheading && (
        <Center h="16" gap="4">
          <Text casing="capitalize" fontSize="large" fontFamily={fontPrimary} fontWeight="bold" color={colorPrimary}>
            {selectedSubheading.name}
          </Text>

          <NotesSharing subheadingId={selectedSubheading.id!} />
        </Center>
      )}
      {selectedSubheading && (
        <NoteList subheadingId={selectedSubheading?.id!} onChangeCallback={changeFormProps} creatorId={notesCreator?.id!} />
      )}
      {formMode && (
        <ArticleForm
          key={selectedNotes?.id}
          id={selectedNotes?.id}
          subheadingid={selectedSubheading?.id!}
          mutate={mutate}
          bookId={book?.bookId!}
          formInput={{
            articleTitle: selectedNotes?.article_title,
            sequence: selectedNotes?.sequence!,
            questionType: selectedNotes?.question_type,
            question_year: selectedNotes?.question_year,
            tags: selectedNotes?.current_affair_tags,
          }}
        />
      )}
      <br />
      {selectedSubheading && (
        <Center>
          <Button
            onClick={() => {
              setFormMode(formMode ? undefined : "CREATING");
              setSelectedNotes(undefined);
            }}
            variant="solid"
            size="lg"
            colorScheme="gray"
            leftIcon={formMode ? <MdCancel /> : <MdAdd />}
          >
            {formMode ? "Cancel" : "Create New Notes"}
          </Button>
        </Center>
      )}
    </div>
  );
};

export const NoteList = (props: {
  subheadingId: number;
  creatorId: string;
  onChangeCallback: (x: ApiArticleTitle | undefined) => void;
}) => {
  const { profile } = useAuthContext();
  const { articleTitles, mutate } = useGetArticlesbyUserandSubheading({
    subheadingId: props.subheadingId,
    creatorId: props.creatorId,
  });

  return (
    <Box mt="16">
      <Accordion allowMultiple>
        <VStack>
          {articleTitles
            ?.sort((a, b) => a.sequence! - b.sequence!)
            .map((x) => (
              <HStack key={x.id} w="full" alignItems="baseline">
                <NotesContextMenu article={x} onChangeCallback={props.onChangeCallback} mutate={mutate} />
                <AccordionItem w="full" border="none">
                  {({ isExpanded }) => (
                    <Box key={x.id}>
                      <Flex alignItems="left">
                        <AccordionButton
                          border={"0px"}
                          bg="brand.50"
                          _hover={{ bg: "brand.100" }}
                          _expanded={{ bg: "brand.100", color: colorPrimary }}
                          justifyContent="space-between"
                        >
                          <Text p="1" fontSize="16px" lineHeight={"tall"} align="start">
                            <Text as="b">Article Name :- </Text> {sentenseCase(x.article_title)}
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>

                      <AccordionPanel pb={4} borderTopWidth="0px" borderBottomWidth="0px" px={{ base: "-0.5", lg: "0" }}>
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
                                <SuneditorForNotesMakingg article1={x.id} language={"HINDI"} isEditable={true} />
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

export const NotesContextMenu = (props: {
  mutate: any;
  article: ApiArticleTitle | undefined;
  onChangeCallback: (x: ApiArticleTitle | undefined) => void;
}) => {
  const supabaseClient = useSupabaseClient<Database>();
  const deleteArticle = async (id: number) => {
    const { error } = await supabaseClient.from("books_articles").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    props.mutate();
  };
  return (
    <Menu>
      <MenuButton>
        <MdMoreVert />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<EditIcon />} onClick={() => props.onChangeCallback(props.article)}>
          Edit Notes Title
        </MenuItem>

        <Box w="full">
          <DeleteAlert
            buttonType="MENU"
            handleDelete={deleteArticle}
            dialogueHeader={"Delete Article"}
            id={props.article!.id}
          />
        </Box>
      </MenuList>
    </Menu>
  );
};
interface IArticleForm {
  id: number | undefined;
  subheadingid: number;
  mutate: any;
  bookId: number;
  formInput: {
    articleTitle: string | undefined;
    sequence: number | undefined;
    questionType: "MODEL" | "PREV" | "NONE" | null | string | undefined;
    question_year: number | undefined | null;
    tags: number[] | undefined;
  };
}
const ArticleForm = (props: IArticleForm) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [isLoading, setIsLoading] = useState(false);
  const isQuestionc = props.formInput.questionType === "MODEL" || props.formInput.questionType === "PREV";
  const [isQuestion, setIsQuestion] = useState(isQuestionc);
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
      questionType: props.formInput.questionType,
      question_year: props.formInput.question_year,
      tags: props.formInput.tags,
    },
    shouldUnregister: true, // This to prevent submitting hidden form values
  });
  const watchQuestionType = watch("questionType");

  const onSubmit: SubmitHandler<IArticleForm["formInput"]> = async (d) => {
    setIsLoading(true);
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
    props.mutate().then(setIsLoading(false));
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
            defaultChecked={isQuestion}
            onChange={(e) => setIsQuestion(e.target.checked)}
          >
            <Text casing="capitalize">This is a Question</Text>
          </Checkbox>
          {isQuestion && (
            <Box>
              <FormControl p="2" isInvalid={errors.questionType as any} maxW="500px" bg="gray.50">
                <RadioGroup defaultValue={props.formInput.questionType!} size="sm">
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

        {props.bookId === 125 && (
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
          // m="2"
          type="submit"
          isLoading={isLoading}
          // borderRadius={"full"}
          variant="solid"
          size="md"
          colorScheme="facebook"
          leftIcon={<MdDone />}
        >
          Done
        </Button>
      </form>
    </Flex>
  );
};
