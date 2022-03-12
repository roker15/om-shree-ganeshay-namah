import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Select,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdCancel, MdDone, MdModeEdit, MdOutlineContentCopy } from "react-icons/md";
import styled from "styled-components";
// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import { useSWRConfig } from "swr";
import { useGetUserArticles } from "../../customHookes/networkHooks";
import { colors, sunEditorButtonList, sunEditorfontList } from "../../lib/constants";
import { elog } from "../../lib/mylog";
import { supabase } from "../../lib/supabaseClient";
import { useAuthContext } from "../../state/Authcontext";
import { definitions } from "../../types/supabase";
import { customToast } from "../CustomToast";
import DeleteConfirmation from "../syllabus/DeleteConfirmation";
import { UiForImageUpload } from "../UiForImageUpload";
// import "../../styles/suneditor.module.css";
interface Props {
  subheadingid: number | undefined;
  notesCreator: string | undefined;
  isCopyable: boolean | undefined;
  isEditable: boolean | undefined;
  changeParentProps: () => void;
}
type Inputs = {
  articleTitle: string;
  sequence: number;
};
const MyNotes: React.FC<Props> = ({ subheadingid, notesCreator, changeParentProps, isCopyable, isEditable }) => {
  const { profile } = useAuthContext();
  const { data: articles, isLoading: isArticleLoading } = useGetUserArticles(subheadingid, notesCreator);
  const [isLoadingCopyButton, setIsLoadingCopyButton] = useState<boolean | undefined>(false);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState<number | undefined>();
  const [isArticleCreating, setIsArticleCreating] = useState<"CREATING" | "EDITING" | "NONE">("NONE");
  const { mutate } = useSWRConfig();

  const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
  });

  const deleteArticle = async (id: number): Promise<void> => {
    const { data, error } = await supabase.from<definitions["books_articles"]>("books_articles").delete().eq("id", id);
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

  const copyArticleToNewUser = async (x: definitions["books_articles"]) => {
    setIsLoadingCopyButton(true);
    const { data, error } = await supabase.from<definitions["books_articles"]>("books_articles").insert({
      books_subheadings_fk: x.books_subheadings_fk,
      article_hindi: x.article_hindi,
      article_english: x.article_english,
      article_audio_link: x.article_audio_link,
      created_by: profile?.id,
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
    <Box>
      {articles
        ?.sort((a, b) => a.sequence! - b.sequence!)
        .map((x) => {
          return (
            <Box key={x.id} mt="16">
              {isCopyable ? (
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
              ) : null}
              <Flex role={"group"} align="center">
                {/* <Badge> */}
                <VStack>
                  <Text bg="orange.100" p="2" fontSize="16px" casing="capitalize" align="left">
                    <Text as="b">Article Name :- </Text> {x.article_title}
                  </Text>
                  {isArticleCreating === "EDITING" && x.id === selectedArticleForEdit ? (
                    <ArticleForm
                      subheadingid={subheadingid}
                      articleId={x.id}
                      articleTitle={x.article_title}
                      sequence={x.sequence}
                      formMode={"EDITING"}
                      x={setIsArticleCreating}
                    ></ArticleForm>
                  ) : null}
                </VStack>
                {/* </Badge> */}
                <Box display={profile?.id !== notesCreator ? "none" : "undefined"}>
                  <IconButton
                    display="none"
                    _groupHover={{ display: "center" }}
                    // _hover={{ color: "pink", fontSize: "22px" }}
                    size="xs"
                    // ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="whatsapp"
                    aria-label="Call Sage"
                    fontSize="20px"
                    onClick={() => handleArticleEdit(x.id, false)}
                    icon={<MdModeEdit />}
                  />
                  <IconButton
                    display={isArticleCreating === "EDITING" && selectedArticleForEdit === x.id ? "undefined" : "none"}
                    size="xs"
                    ml="2"
                    borderRadius={"full"}
                    variant="outline"
                    colorScheme="whatsapp"
                    aria-label="Call Sage"
                    fontSize="20px"
                    onClick={() => handleArticleEdit(undefined, true)}
                    icon={<MdCancel />}
                  />
                  <Box display="none" _groupHover={{ display: "center" }}>
                    <DeleteConfirmation
                      handleDelete={deleteArticle}
                      dialogueHeader={"Delete this Article?"}
                      isDisabled={false}
                      isIconButton={true}
                      id={x.id}
                    ></DeleteConfirmation>
                  </Box>
                </Box>
              </Flex>
              <Tabs size="md" colorScheme="whatsapp">
                <TabList>
                  <Tab>Hindi</Tab>
                  <Tab>English</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel pl="2" pr="0.5">
                    {isArticleLoading ? (
                      <Box boxShadow="lg" bg="white">
                        <SkeletonCircle isLoaded={false} size="10" />
                        <SkeletonText isLoaded={false} noOfLines={4} spacing="4" />
                      </Box>
                    ) : (
                      <SuneditorForNotesMaking article={x} language={"HINDI"} isEditable={isEditable} />
                    )}
                  </TabPanel>
                  <TabPanel>
                    {isArticleLoading ? (
                      <Box boxShadow="lg" bg="white">
                        <SkeletonCircle isLoaded={false} size="10" />
                        <SkeletonText isLoaded={false} noOfLines={4} spacing="4" />
                      </Box>
                    ) : (
                      <SuneditorForNotesMaking article={x} language={"ENGLISH"} isEditable={isEditable} />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          );
        })}
      <Stack align="center" justifyContent="center" pb="16" direction={"row"}>
        <Box display={isArticleCreating === "NONE" ? "none" : "block"}>
          {/* {form()} */}

          {isArticleCreating === "CREATING" ? (
            <ArticleForm subheadingid={subheadingid} formMode={"CREATING"} x={setIsArticleCreating}></ArticleForm>
          ) : null}
        </Box>
        <Box display={profile?.id !== notesCreator ? "none" : "undefined"}>
          <Tooltip label="Create New Article in This Topic" fontSize="sm">
            <span>
              <IconButton
                // _groupHover={{ size: "" }}
                display={isArticleCreating === "CREATING" || !subheadingid ? "none" : "flex"}
                _hover={{ color: " #FF1493" }}
                size="auto"
                ml="2"
                onClick={() => setIsArticleCreating("CREATING")}
                borderRadius={"full"}
                variant="outline"
                colorScheme="whatsapp"
                aria-label="Call Sage"
                fontSize="25px"
                w="35px"
                h="35px"
                icon={<MdAdd />}
              />
            </span>
          </Tooltip>
        </Box>

        {/* <Tooltip label="Create New Article in This Topic" fontSize="sm"> */}
        <IconButton
          // _groupHover={{ size: "" }}
          display={isArticleCreating === "CREATING" ? "flex" : "none"}
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
  subheadingid: number | undefined;
  articleId?: number;
  articleTitle?: string;
  sequence?: number;
  formMode: "CREATING" | "EDITING";
  x: React.Dispatch<React.SetStateAction<"CREATING" | "EDITING" | "NONE">>;
  setParentProps?: (x: string) => {};
};
const ArticleForm: React.FC<ArticleFormProps> = ({
  subheadingid,
  formMode,
  articleId,
  articleTitle,
  sequence,
  setParentProps,
  x,
}) => {
  const [isLoading, setIsLoading] = useState();
  const { mutate } = useSWRConfig();
  const { profile } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      articleTitle: articleTitle,
      sequence: sequence,
    },
  });
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
      if (error) {
        elog("MyNotes->onSubmit", error.message);
        return;
      }
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
      if (error) {
        elog("MyNotes->onSubmit", error.message);
        return;
      }
    }
    x("NONE");
    mutate([`/get-user-articles/${subheadingid}/${profile?.id}`]);
  };
  return (
    <Flex justify="space-between">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl p="2" isInvalid={errors.articleTitle as any}>
          <Input
            focusBorderColor="lime"
            placeholder="Article Title"
            {...register("articleTitle", { required: "This is required" })}
          />
          <FormErrorMessage>{errors.articleTitle && errors.articleTitle.message}</FormErrorMessage>
        </FormControl>
        <FormControl p="2" isInvalid={errors.articleTitle as any}>
          <Input
            focusBorderColor="lime"
            type="number"
            placeholder="Article Sequence (10,20,30.. etc)"
            {...register("sequence", { required: "This is required" })}
          />
          <FormErrorMessage>{errors.sequence && errors.sequence.message}</FormErrorMessage>
        </FormControl>

        <IconButton
          // _groupHover={{ size: "" }}
          // display={isArticleCreating === "CREATING" || !subheadingid ? "none" : "flex"}
          // _hover={{ color: " #FF1493" }}
          size="auto"
          m="2"
          // onClick={() => setIsArticleCreating("CREATING")}
          type="submit"
          isLoading={isLoading}
          borderRadius={"full"}
          variant="outline"
          colorScheme="whatsapp"
          aria-label="Call Sage"
          fontSize="25px"
          w="35px"
          h="35px"
          icon={<MdDone />}
        />
        {/* </ButtonGroup> */}
      </form>
    </Flex>
  );
};

type SuneditorForNotesMakingProps = {
  article: definitions["books_articles"];
  language: "HINDI" | "ENGLISH";
  isEditable: boolean | undefined;
};
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const SuneditorForNotesMaking: React.FC<SuneditorForNotesMakingProps> = ({ article, language, isEditable }) => {
  const [editorMode, setEditorMode] = React.useState("READ");
  const [isAutosaveOn, setIsAutosaveOn] = React.useState(false);
  const [fontSize, setFontSize] = React.useState("font-family: arial; font-size: 14px;");
  const { profile } = useAuthContext();
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
      // editor.current?.core.conten(article.article_hindi);
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
    const { data, error } = await supabase
      .from<definitions["books_articles"]>("books_articles")
      .update(language === "ENGLISH" ? { article_english: newcontent } : { article_hindi: newcontent })
      .eq("id", article.id);
    if (error) {
      customToast({ title: "Article not updated error occurred  " + error.message, status: "error", isUpdating: false });
      elog("MyNotes->deleteArticle", error.message);
      return;
    }

    if (data) {
      customToast({ title: "Your changes have been saved...", status: "success", isUpdating: true });
    }
  };
  return (
    <Box spellCheck="false">
      {/* //use above attrivutes if you want to override spellcheck of browser */}
      <Flex
        // display={profile?.id !== article.created_by ? "none" : "undefined"}
        display={isEditable ? "undefined" : "none"}
        justifyContent="space-between"
        align="center"
        // alignItems="center"
      >
        <RadioGroup onChange={setEditorMode} value={editorMode}>
          <Stack direction="row">
            <Radio colorScheme="whatsapp" size="sm" value="READ">
              <Text as="b" casing="capitalize">
                Read
              </Text>
            </Radio>
            <Radio colorScheme="pink" size="sm" value="EDIT">
              <Text as="b" casing="capitalize">
                Edit
              </Text>
            </Radio>
          </Stack>
        </RadioGroup>
        <Flex align="center" display={editorMode === "READ" ? "none" : "flex"}>
          <Select
            size="sm"
            px="2"
            placeholder="Font Size"
            onChange={(e) => {
              setFontSize(e.target.value);
            }}
          >
            <option value="font-family: arial; font-size: 14px;">small</option>
            <option value="font-family: arial; font-size: 16px;">medium</option>
            <option value="font-family: arial; font-size: 20px;">large</option>
          </Select>
          <Box pb="3">
            <UiForImageUpload />
          </Box>

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
            colorScheme="whatsapp"
            // color="gray.300"
            borderColor="gray.300"
            // isChecked={isAutosaveOn}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIsAutosaveOn(e.target.checked);
            }}
          >
            <Text casing={"capitalize"}>Autosave</Text>
          </Checkbox>
        </Flex>
      </Flex>

      <EditorStyle title={editorMode === "READ" ? "READ" : "EDIT"}>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          setDefaultStyle={fontSize}
          // setDefaultStyle={font-family: ${fontFamily}; font-size: 14px;}
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
            colorList: colors,
            paragraphStyles: [
              "spaced",
              // "neon",
              {
                name: "Box",
                class: "__se__customClass",
              },
              {
                name: "ph22",
                class: "__se__taggg",
              },
            ],
            textStyles: [
              "shadow",
              "code",
              "translucent",

              {
                name: "Highlighter 1",
                style: "background-color:#FFFF88;padding: 1px;",
                tag: "span",
              },
              {
                name: "Highlighter 2",
                style: "background-color:#CDEB8B;padding: 1px;",
                tag: "span",
              },
              {
                name: "Highlighter 3",
                style: "background-color:#E1D5E7;padding: 1px;",
                tag: "span",
              },
              {
                name: "Highlighter 4",
                style: "background-color:#E1D5E7;padding: 1px;padding-left: 1px",
                // style: "background-color:#f7f3e2;padding: 1px;padding-left: 1px",
                tag: "p",
              },
            ],
            height: "100%",
            width: "auto",
            minWidth: "350px",
            resizingBar: false,
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
      </EditorStyle>
    </Box>
  );
};

const EditorStyle = styled.div`
  .sun-editor .se-dialog {
    z-index: 2 !important; /* default value */
  }
  .sun-editor {
    /* margin-top: -18px !important; */
    /* border: 1px solid blue; */
    padding-left: -30px !important;
    padding-right: -30px !important;
    margin-left: -20px !important;
    margin-right: 0px !important;
    border: ${(props) => (props.title === "READ" ? "none" : undefined)};
    /* border: "none"; */
    z-index: 2 !important;
  }
  .__se__customClass {
    /* background: #7e7575;
    padding: 5px;
    list-style-position: inside;
    font-weight: 500;
    color: #464242; */

    background-color: #6e3c3c !important;
    padding: 5px !important;
    color: #464242 !important;
    /* list-style-position: inside; */
    border: 1px solid blue !important;
  }
  .__se__taggg {
    background-color: #641717 !important;
    padding: 5px;
    list-style-position: inside;
    font-weight: 500;
    color: #464242 !important;
    border: 1px solid blue;
    text-shadow: 2px 2px 5px green;
  }
  /* blockquote {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    quotes: "\201C""\201D""\2018""\2019";
  }
  blockquote:before {
    color: #ccc;
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
  blockquote p {
    display: inline;
  } */
`;
