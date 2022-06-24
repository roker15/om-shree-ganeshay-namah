import { Box, Checkbox, Flex, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { BASE_URL, colors, sunEditorButtonList, sunEditorfontList } from "../../lib/constants";
import { elog } from "../../lib/mylog";
import { useAuthContext } from "../../state/Authcontext";
import { definitions } from "../../types/supabase";

import { customToast } from "../CustomToast";
// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import styled from "styled-components";
import SunEditorCore from "suneditor/src/lib/core";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

type SuneditorForNotesMakingProps = {
  article: definitions["books_articles"];
  language: "HINDI" | "ENGLISH";
  isEditable: boolean | undefined;
};

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
    const { data, error } = await supabaseClient
      .from<definitions["books_articles"]>("books_articles")
      .update(language === "ENGLISH" ? { article_english: newcontent } : { article_hindi: newcontent })
      .eq("id", article.id);
    if (error) {
      customToast({ title: "Article not updated error occurred  " + error.message, status: "error", isUpdating: false });
      elog("MyNotes->deleteArticle", error.message);
      return;
    }

    if (data) {
      customToast({ title: "Updated...", status: "success", isUpdating: true });
    }
  };

  return (
    <div>
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
          <Flex alignItems={"center"} pb="2"direction={{ base: "column", sm: "row" }} display={editorMode === "READ" ? "none" : "flex"}>
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
              <option value="font-family: arial; font-size: 24px;">large</option>
            </Select>

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
          <Center>
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              setDefaultStyle={fontSize}
              hideToolbar={editorMode === "READ" ? true : false}
              defaultValue={language === "ENGLISH" ? article.article_english : article.article_hindi}
              onChange={handleOnChange}
              readOnly={editorMode === "READ" ? true : false}
              autoFocus={false}
              
              // disable={editorMode === "READ" ? true : false}
              setOptions={{
                callBackSave(contents, isChanged) {
                  updateArticleInDatabase(contents);
                },
                // hideToolbar: true, // to be implemented
                placeholder: `Click Edit and Start Typing Press Crtl + S to save your Notes.
                 Or press "Save Button in Editor to Save your notes"`,
                
                mode: "classic",
                hideToolbar:true,
                katex: katex,
                colorList: colors,
                imageUploadUrl: `${BASE_URL}/api/uploadImage`,
                paragraphStyles: [
                  "spaced",

                  //   {
                  //     name: "Custom",
                  //     class: "__se__customClass",
                  //   },
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
                    name: "Highlighter 4",
                    style: "background-color:#E1D5E7;padding: 1px;padding-left: 1px",
                    // style: "background-color:#f7f3e2;padding: 1px;padding-left: 1px",
                    tag: "p",
                  },
                ],
                height: "100%",
                width: "auto",
                minWidth: "350px",
                buttonList: sunEditorButtonList,
                resizingBar: false,
                formats: ["p", "div", "h1", "h2", "h3"],
                font: sunEditorfontList,

                fontSize: [12, 14, 16, 20],
                imageFileInput: true, //this disable image as file, only from url allowed
                imageSizeOnlyPercentage: false, //changed on 6 june

                // imageUrlInput: true,
                // imageGalleryUrl: "www.qlook.com",
              }}
            />
          </Center>
        </EditorStyle>
      </Box>
    </div>
  );
};
export default SuneditorForNotesMaking;

export const Center = styled.div`
  th,
  td {
    min-width: 250px;
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
    /* padding-left: -30px !important;
    padding-right: -30px !important;
    margin-left: -20px !important;
    margin-right: 0px !important; */
    border: ${(props) => (props.title === "READ" ? "none" : undefined)};
  }
`;
