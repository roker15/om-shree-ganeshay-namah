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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdClose, MdDone, MdModeEdit } from "react-icons/md";
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
  const { data: articles } = useGetUserArticles(subheadingid, profile?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [isArticleCreating, setIsArticleCreating] = useState(false);
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
  return (
    <Box mx="2">
      {articles?.map((x) => {
        return (
          <Box key={x.id}>
            <Flex role={"group"}>
              {/* <Badge> */}
              <Text bg="blue.50" as="label" casing="capitalize" align="left">
                {x.sequence + " " + x.article_title}
              </Text>
              {/* </Badge> */}

              <IconButton
                display="none"
                _groupHover={{ display: "inline" }}
                // _hover={{ color: "pink", fontSize: "22px" }}
                size="xs"
                ml="2"
                borderRadius={"full"}
                variant="outline"
                colorScheme="orange"
                aria-label="Call Sage"
                fontSize="20px"
                // onClick={() =>
                //   changeFormProps({
                //     formMode: "UPDATE_HEADING",
                //     book_id: book?.id,
                //     book_name: book?.book_name,
                //     heading_id: Number(key.split(",")[1]),
                //     heading: key.split(",")[2],
                //     heading_sequence: Number(key.split(",")[0]),
                //   })
                // }
                icon={<MdModeEdit />}
              />
              <DeleteConfirmation
                handleDelete={deleteArticle}
                dialogueHeader={"Are you sure to delete this Article?"}
                isDisabled={false}
                isIconButton={true}
                id={x.id}
              ></DeleteConfirmation>
            </Flex>
            <Tabs>
              <TabList>
                <Tab>Hindi</Tab>
                <Tab>English</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SuneditorForNotesMaking article={x} />
                </TabPanel>
                <TabPanel>2</TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        );
      })}
      <VStack align="center">
        <Box display={isArticleCreating ? "block" : "none"}>
          {/* {form()} */}
          <ArticleForm subheadingid={subheadingid} formMode={"CREATING"} x={setIsArticleCreating}></ArticleForm>
        </Box>

        <Tooltip label="Create New Article in This Topic" fontSize="sm">
          <IconButton
            // _groupHover={{ size: "" }}
            display={isArticleCreating || !subheadingid ? "none" : "flex"}
            _hover={{ color: " #FF1493", fontSize: "45px", w: "45px", h: "45px" }}
            size="auto"
            ml="2"
            onClick={() => setIsArticleCreating(true)}
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
  x: React.Dispatch<React.SetStateAction<boolean>>;
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
      const { data, error } = await supabase.from<definitions["books_articles"]>("books_articles").update({
        id: articleId,
        article_title: d.articleTitle,
        // created_by: profile?.id,
        books_subheadings_fk: subheadingid,
        sequence: d.sequence,
      });
    }
    x(false);
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
};
// import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const SuneditorForNotesMaking: React.FC<SuneditorForNotesMakingProps> = ({ article }) => {
  const [editMode, setEditMode] = useState(false);
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  return (
    <Box>
      {/* <ButtonGroup>
        <Switch size="sm" />
        <Switch size="sm" />
      </ButtonGroup> */}
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        setDefaultStyle="font-family: arial; font-size: 16px;"
        hideToolbar={!editMode}
        defaultValue={article.article_english}
        // key={postId}
        // onChange={handleOnChange}
        readOnly={!editMode}
        autoFocus={false}
        setOptions={{
          placeholder: "**** Start Writing your notes here, we will save it automatically!!!",
          mode: "balloon",
          katex: katex,
          height: "100%",
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
    </Box>
  );
};
