import {
  Box,
  ButtonGroup,
  FormControl,
  Text,
  FormErrorMessage,
  IconButton,
  Input,
  Tooltip,
  VStack,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  Tag,
  Badge,
  Switch,
  Radio,
  RadioGroup,
  Stack,
  Button,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdCancel, MdClose, MdDone, MdModeEdit } from "react-icons/md";
import { useGetUserArticles } from "../../customHookes/networkHooks";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { definitions } from "../../types/supabase";
import DeleteConfirmation from "../syllabus/DeleteConfirmation";
import useSWR, { useSWRConfig } from "swr";
import katex from "katex";
// import SunEditor from "suneditor-react";
import { sunEditorButtonList, sunEditorfontList } from "../../lib/constants";
import dynamic from "next/dynamic";
interface Props {
  subheadingid: number | undefined;
  changeParentProps: () => void;
}
type Inputs = {
  articleTitle: string;
  sequence: number;
};
const MyNotes: React.FC<Props> = ({ subheadingid, changeParentProps }) => {
  const { profile } = useAuthContext();
  const { data: articles, isLoading: isArticleLoading } = useGetUserArticles(subheadingid, profile?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState<number | undefined>();
  const [isArticleCreating, setIsArticleCreating] = useState<"CREATING" | "EDITING" | "NONE">("NONE");
  const { mutate } = useSWRConfig();

  // const handleSyllabusClick = (x: BookSyllabus) => {
  //   setSelectedSubheading(x.subheading_id);
  //   changeParentProps(x);
  // };
  const [article, setArticle] = React.useState();
  const deleteArticle = async (id: number): Promise<void> => {
    const { data, error } = await supabase.from<definitions["books_articles"]>("books_articles").delete().eq("id", id);
    if (data) {
      //   mutate(`/book_id_syllabus/${x?.book_id}`);
      mutate([`/get-user-articles/${subheadingid}/${profile?.id}`]);
    }
  };
  const cancelForm = async (e: any) => {
    const { data, error } = await supabase
      .from<definitions["books_articles"]>("books_articles")
      .insert([{ article_title: e.target.value, created_by: profile?.id, books_subheadings_fk: subheadingid }]);
    setArticle(e.target.value);
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
  return (
    <Box mx="2">
      {articles?.map((x) => {
        return (
          <Box key={x.id} mt="16">
            <Flex role={"group"}>
              {/* <Badge> */}
              <VStack>
                <Text bg="blue.50" as="label" casing="capitalize" align="left">
                  {x.sequence + " " + x.article_title}
                </Text>
                {isArticleCreating === "EDITING" && x.id === selectedArticleForEdit ? (
                  <ArticleForm
                    subheadingid={subheadingid}
                    articleId={x.id}
                    formMode={"EDITING"}
                    x={setIsArticleCreating}
                  ></ArticleForm>
                ) : null}
              </VStack>
              {/* </Badge> */}

              <IconButton
                display="none"
                _groupHover={{ display: "center" }}
                // _hover={{ color: "pink", fontSize: "22px" }}
                size="xs"
                // ml="2"
                borderRadius={"full"}
                variant="outline"
                colorScheme="orange"
                aria-label="Call Sage"
                fontSize="20px"
                onClick={() => handleArticleEdit(x.id, false)}
                icon={<MdModeEdit />}
              />
              <IconButton
                display={isArticleCreating === "EDITING" && selectedArticleForEdit === x.id ? "center" : "none"}
                size="xs"
                ml="2"
                borderRadius={"full"}
                variant="outline"
                colorScheme="orange"
                aria-label="Call Sage"
                fontSize="20px"
                onClick={() => handleArticleEdit(undefined, true)}
                icon={<MdCancel />}
              />
              <DeleteConfirmation
                handleDelete={deleteArticle}
                dialogueHeader={"Are you sure to delete this Article?"}
                isDisabled={false}
                isIconButton={true}
                id={x.id}
              ></DeleteConfirmation>
            </Flex>
            <Tabs size="md">
              <TabList>
                <Tab>Hindi</Tab>
                <Tab>English</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {isArticleLoading ? "Loading..." : <SuneditorForNotesMaking article={x} language={"HINDI"} />}
                </TabPanel>
                <TabPanel>
                  {isArticleLoading ? "Loading..." : <SuneditorForNotesMaking article={x} language={"ENGLISH"} />}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        );
      })}
      <VStack align="center">
        <Box display={isArticleCreating === "NONE" ? "none" : "block"}>
          {/* {form()} */}

          {isArticleCreating === "CREATING" ? (
            <ArticleForm subheadingid={subheadingid} formMode={"CREATING"} x={setIsArticleCreating}></ArticleForm>
          ) : null}
        </Box>

        <Tooltip label="Create New Article in This Topic" fontSize="sm">
          <IconButton
            // _groupHover={{ size: "" }}
            display={isArticleCreating === "CREATING" || !subheadingid ? "none" : "flex"}
            _hover={{ color: " #FF1493", fontSize: "45px", w: "45px", h: "45px" }}
            size="auto"
            ml="2"
            onClick={() => setIsArticleCreating("CREATING")}
            borderRadius={"full"}
            variant="outline"
            colorScheme="linkedin"
            aria-label="Call Sage"
            fontSize="25px"
            w="35px"
            h="35px"
            icon={<MdAdd />}
          />
        </Tooltip>
      </VStack>
    </Box>
  );
};
export default MyNotes;

type ArticleFormProps = {
  subheadingid: number | undefined;
  articleId?: number;
  articleTitle?: string;
  sequence?: number;
  formMode: "CREATING" | "EDITING";
  x: React.Dispatch<React.SetStateAction<"CREATING" | "EDITING" | "NONE">>;
  setParentProps?: (x: string) => {};
};
const ArticleForm: React.FC<ArticleFormProps> = ({ subheadingid, formMode, articleId, setParentProps, x }) => {
  const [isLoading, setIsLoading] = useState();
  const { mutate } = useSWRConfig();
  const { profile } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (d) => {
    if (formMode === "CREATING") {
      const { data, error } = await supabase.from<definitions["books_articles"]>("books_articles").insert([
        {
          article_title: d.articleTitle,
          created_by: profile?.id,
          books_subheadings_fk: subheadingid,
          sequence: d.sequence,
        },
      ]);
    }
    if (formMode === "EDITING") {
      const { data, error } = await supabase
        .from<definitions["books_articles"]>("books_articles")
        .update({
          // id: articleId,
          article_title: d.articleTitle,
          // created_by: profile?.id,
          // books_subheadings_fk: subheadingid,
          sequence: d.sequence,
        })
        .eq("id", articleId);
    }
    x("NONE");
    mutate([`/get-user-articles/${subheadingid}/${profile?.id}`]);
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.articleTitle as any}>
          <Input placeholder="Article Title" {...register("articleTitle", { required: "This is required" })} />
          <FormErrorMessage>{errors.articleTitle && errors.articleTitle.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.articleTitle as any}>
          <Input
            type="number"
            placeholder="Article Sequence (10,20,30.. etc)"
            {...register("sequence", { required: "This is required" })}
          />
          <FormErrorMessage>{errors.sequence && errors.sequence.message}</FormErrorMessage>
        </FormControl>
        <ButtonGroup variant="with-shadow" colorScheme="pink">
          <IconButton
            // borderRadius={"full"}
            isLoading={isLoading}
            type="submit"
            aria-label="Search database"
            icon={<MdDone />}
            size="s"
          />
        </ButtonGroup>
      </form>
    </Box>
  );
};

type SuneditorForNotesMakingProps = {
  article: definitions["books_articles"];
  language: "HINDI" | "ENGLISH";
};
// import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import { debounce } from "lodash";
import { customToast } from "../CustomToast";
import { myErrorLog } from "../../lib/mylog";
import styled from "styled-components";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const SuneditorForNotesMaking: React.FC<SuneditorForNotesMakingProps> = ({ article, language }) => {
  const [editorMode, setEditorMode] = React.useState("READ");
  const [isAutosaveOn, setIsAutosaveOn] = React.useState(false);
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  useEffect(() => {
    if (!isAutosaveOn) {
      debouncedFunctionRef.current = undefined;
    }
  });
  useEffect(() => {
    if (language === "HINDI" && article && article.article_hindi && editor.current && editor.current.core) {
      editor.current?.core.setContents(article.article_hindi);
    }
    if (language === "ENGLISH" && article && article.article_english && editor.current && editor.current.core) {
      editor.current?.core.setContents(article.article_english);
    }
  }, [article, language]);

  const debouncedFunctionRef = useRef<(newcontent: any) => void>();
  debouncedFunctionRef.current = debounce((newcontent: any) => createOrUpdatePost(newcontent), 5000);
  const debouncedChange = useCallback(
    debounce((editorContent) => debouncedFunctionRef.current!(editorContent), 5000),
    []

    // debounce((editorContent, postId) => createOrUpdatePost(editorContent, postId), 5000),
    // []
  );
  const handleOnChange = (editorContent: string) => {
    if (editor.current?.core.hasFocus && debouncedFunctionRef.current) {
      debouncedFunctionRef.current(editorContent);
    }
  };

  const createOrUpdatePost = (newcontent: any) => {
    updateArticleInDatabase(newcontent);
  };
  const updateArticleInDatabase = async (newcontent: string | undefined) => {
    try {
      const { data, error } = await supabase
        .from<definitions["books_articles"]>("books_articles")
        .update(language === "ENGLISH" ? { article_english: newcontent } : { article_hindi: newcontent })
        .eq("id", article.id);
      if (error) {
        customToast({ title: "Post not updated,error occurred", status: "error", isUpdating: false });
      }

      if (data) {
        customToast({ title: "Your changes have been saved...", status: "success", isUpdating: true });
        // mutate(`/userpost/${currentSubheadingProps?.id}`);
      }
    } catch (error: any) {
      customToast({ title: "Post not updated,error occurred,  " + error.message, status: "error", isUpdating: false });
    }
  };
  // const EditorStyle =
  //   editorMode === "READ"
  //     ? styled.div`
  //         .sun-editor {
  //           /* margin-top: -18px !important; */
  //           /* border: 1px solid blue; */
  //           border: none;
  //         }
  //       `
  //     : styled.div`
  //         .sun-editor {
  //           /* margin-top: -18px !important; */
  //           /* border: 1px solid blue; */
  //           /* border: none; */
  //         }
  //       `;
  return (
    <Box>
      <Flex justifyContent="space-between">
        <RadioGroup onChange={setEditorMode} value={editorMode}>
          <Stack direction="row">
            <Radio colorScheme="orange" size="sm" value="READ">
              <Text as="b" casing="capitalize">
                Read
              </Text>
            </Radio>
            <Radio colorScheme="orange" size="sm" value="EDIT">
              <Text as="b" casing="capitalize">
                Edit
              </Text>
            </Radio>
          </Stack>
        </RadioGroup>
        <HStack display={editorMode === "READ" ? "none" : "flex"}>
          <Button
            onClick={() => {
              updateArticleInDatabase(editor.current?.getContents(false));
            }}
            display={isAutosaveOn ? "none" : undefined}
            size="sm"
            // colorScheme="orange"
            variant="ghost"
          >
            Save
          </Button>
          <Checkbox
            colorScheme="orange"
            // color="gray.300"
            borderColor="gray.300"
            // isChecked={isAutosaveOn}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIsAutosaveOn(e.target.checked);
            }}
          >
            <Text casing={"capitalize"}>Autosave</Text>
          </Checkbox>
        </HStack>
      </Flex>

      {/* <ButtonGroup>
        <Switch size="sm" />
        <Switch size="sm" />
      </ButtonGroup> */}
      {/* <EditorStyle
        // title={editorMode === "READ" ? "READ" : "EDIT"}
      > */}
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          setDefaultStyle="font-family: arial; font-size: 16px;"
          hideToolbar={editorMode === "READ" ? true : false}
          defaultValue={language === "ENGLISH" ? article.article_english : article.article_hindi}
          // key={postId}

          onChange={handleOnChange}
          readOnly={editorMode === "READ" ? true : false}
          autoFocus={false}
          // disable={editorMode === "READ" ? true : false}
          setOptions={{
            placeholder: "**** Start Writing your notes here, we will save it automatically!!!",
            mode: "classic",
            katex: katex,
            height: "100%",
            // resizingBar: false,
            buttonList: sunEditorButtonList,
            formats: ["p", "div", "h1", "h2", "h3"],
            font: sunEditorfontList,
            fontSize: [12, 14, 16, 20],
            imageFileInput: false, //this disable image as file, only from url allowed
            imageSizeOnlyPercentage: false,
            // imageUrlInput: true,
            // imageGalleryUrl: "www.qlook.com",
          }}
        />
      {/* </EditorStyle> */}
    </Box>
  );
};
const EditorStyle = styled.div`
  .sun-editor {
    /* margin-top: -18px !important; */
    /* border: 1px solid blue; */
    border: ${props => props.title==="READ" ? "none" : undefined};
    border: "none";
  }
`;
