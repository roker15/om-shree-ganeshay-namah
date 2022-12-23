import { Box, Center, Flex, Radio, RadioGroup, Select, Spinner, Stack, Text } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import React, { useEffect, useRef } from "react";
import { BASE_URL, colors, SunEditor, sunEditorButtonList, sunEditorfontList } from "../../lib/constants";

import { customToast } from "../CustomToast";
// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
import { StringOrNumber } from "@chakra-ui/utils";
import styled from "styled-components";
import SunEditorCore from "suneditor/src/lib/core";
import { useGetArticleById } from "../../customHookes/networkHooks";
import { Database } from "../../lib/database";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type SuneditorForNotesMakingProps = {
  article1: number; //definitions["books_articles"];
  language: "HINDI" | "ENGLISH";
  isEditable: boolean | undefined;
};

const SuneditorForNotesMaking: React.FunctionComponent<SuneditorForNotesMakingProps> = ({
  article1,
  language,
  isEditable,
}) => {
  const supabaseClient = useSupabaseClient<Database>();
  const [editorMode, setEditorMode] = React.useState("READ");

  const [fontSize, setFontSize] = React.useState("font-family: arial; font-size: 16px;");
  const { article, isError, isLoading } = useGetArticleById(article1);
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    if (language === "HINDI" && article && article.article_hindi && editor.current && editor.current.core) {
      editor.current?.core.setContents(article.article_hindi);
    }
    if (language === "ENGLISH" && article && article.article_english && editor.current && editor.current.core) {
      editor.current?.core.setContents(article.article_english);
    }
  }, [article, language]);

  const updateArticleInDatabase = async (newcontent: string | undefined) => {
    const { data, error } = await supabaseClient
      .from("books_articles")
      .update(language === "ENGLISH" ? { article_english: newcontent } : { article_hindi: newcontent })
      .eq("id", article!.id);
    if (error) {
      customToast({ title: "Article not updated error occurred  " + error.message, status: "error", isUpdating: false });
      return;
    }
    // if (data) {
    customToast({ title: "Updated...", status: "success", isUpdating: true });
    // }
  };

  return (
    <div>
      <Box spellCheck={editorMode === "READ" ? "false" : "true"}>
        {/* //use above attributes if you want to override spellcheck of browser */}
        <Flex
          // display={profile?.id !== article.created_by ? "none" : "undefined"}
          display={isEditable ? "undefined" : "none"}
          justifyContent="space-between"
          align="center"
        >
          <ChangeEditorMode editorMode={editorMode} setEditorMode={setEditorMode}></ChangeEditorMode>
          <Flex
            alignItems={"center"}
            pb="2"
            direction={{ base: "column", sm: "row" }}
            display={editorMode === "READ" ? "none" : "flex"}
          >
            <FontOptions setFontSize={setFontSize}></FontOptions>
          </Flex>
        </Flex>

        <EditorStyle title={editorMode === "READ" ? "READ" : "EDIT"}>
          <Centerr>
            <Editor
              editorMode={editorMode}
              fontSize={fontSize}
              getSunEditorInstance={getSunEditorInstance}
              // handleOnChange={handleOnChange}
              updateArticleInDatabase={updateArticleInDatabase}
              article={article!}
              language={language}
            ></Editor>
          </Centerr>
        </EditorStyle>
      </Box>
    </div>
  );
};
export default SuneditorForNotesMaking;

export const Centerr = styled.div`
  th,
  td {
    /* min-width: 50px; */
   
  }
  .sun-editor-editable table {
    display: block;
    overflow-x: auto;
    /* white-space: nowrap; */
  }
  .__se__customClass {
    display: inline-block;
    width: 50px;
    border: 1px solid #000;
    text-align: center;
  }
`;
export const EditorStyle = styled.div`
  .sun-editor {
    border: ${(props) => (props.title === "READ" ? "none" : undefined)};
  }
`;

function FontOptions(props: { setFontSize: (arg0: string) => void }) {
  return (
    <Select
      size="sm"
      px="2"
      placeholder="Font Size"
      onChange={(e) => {
        props.setFontSize(e.target.value);
      }}
    >
      <option value="font-family: arial; font-size: 14px;">small</option>
      <option value="font-family: arial; font-size: 16px;">medium</option>
      <option value="font-family: arial; font-size: 24px;">large</option>
    </Select>
  );
}

function ChangeEditorMode(props: {
  setEditorMode: ((nextValue: string) => void) | undefined;
  editorMode: StringOrNumber | undefined;
}) {
  return (
    <RadioGroup onChange={props.setEditorMode} value={props.editorMode?.toString()}>
      <Stack direction="row">
        <Radio colorScheme="whatsapp" borderColor={"gray.400"} size="sm" value="READ">
          <Text as="b" casing="capitalize">
            Read
          </Text>
        </Radio>
        <Radio colorScheme="pink" borderColor={"gray.400"} size="sm" value="EDIT">
          <Text as="b" casing="capitalize">
            Edit
          </Text>
        </Radio>
      </Stack>
    </RadioGroup>
  );
}
const textStyles = [
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
    style: "background-color:#E1D5E7;padding: 1px;padding-left: 1px",
    // style: "background-color:#f7f3e2;padding: 1px;padding-left: 1px",
    tag: "p",
  },
];

interface editorProps {
  getSunEditorInstance: ((sunEditor: SunEditorCore) => void) | undefined;
  fontSize: string | undefined;
  editorMode: string;
  language: "HINDI" | "ENGLISH";
  article: Database["public"]["Tables"]["books_articles"]["Row"] | undefined;
  // handleOnChange: ((content: string) => void) | undefined;
  updateArticleInDatabase: (arg0: string) => void;
}

function Editor(props: editorProps): JSX.Element {
  if (!props.article) {
    return (
      <Center h="100px">
        <Spinner />
      </Center>
    );
  }
  return (
    <Box boxShadow="none">
      <SunEditor
        getSunEditorInstance={props.getSunEditorInstance}
        setDefaultStyle={props.fontSize}
        hideToolbar={props.editorMode === "READ" ? true : false}
        defaultValue={props.language === "ENGLISH" ? props.article.article_english! : props.article.article_hindi!}
        // setContents={props.language === "ENGLISH" ? props.article.article_english : props.article.article_hindi} //cause blank editor to render first and then put content, so creates flickering effect . so move to defaultValue
        readOnly={props.editorMode === "READ" ? true : false}
        autoFocus={false} // disable={editorMode === "READ" ? true : false}
        setOptions={{
          callBackSave(contents, isChanged) {
            props.updateArticleInDatabase(contents);
          },
          placeholder: `Step 1 - Click Edit and Start Typing 
        Step 2 - Press "Crtl + S" to save your Notes (keep mouse cursor inside Editor).
        Step 3 - You can also press "Save" Button in Editor to Save your notes"`,
          mode: "classic",
          hideToolbar: true,
          katex: katex,
          colorList: colors,
          imageUploadUrl: `${BASE_URL}/api/uploadImage`,
          textStyles: textStyles,
          height: "100%",
          width: "auto",
          minWidth: "auto",
          minHeight: "100px",
          buttonList: sunEditorButtonList,
          resizingBar: false,
          formats: ["p", "div", "h1", "h2", "h3"],
          font: sunEditorfontList,
          fontSize: [12, 14, 16, 20],
          imageSizeOnlyPercentage: false, //changed on 6 june
        }}
      />
    </Box>
  );
}
