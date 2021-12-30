// Import katex
import { Avatar, Tag, TagLabel, Text } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EditorStyle = styled.div`
  .sun-editor {
    /* margin-top: -18px !important; */
    /* border: 1px solid blue; */
    /* border: none; */
  }
`;

interface Props {
  postId?: number;
  postContent?: string;
  sharedBy?: string;
}

const EditorForShredPost: React.FC<Props> = ({ postId, postContent, sharedBy }) => {
  
  const editor = useRef<SunEditorCore>();
  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  
  //Always keep check of props in useeffect otherwise , old data may show in rerendering, because suneditor is not updated automatically.
  useEffect(() => {
    if (postContent && editor.current && editor.current.core) {
      editor.current?.core.setContents(postContent);
    }
  }, [postContent]);
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */
  return (
    <>
      <Text mb="" fontSize="xl" fontWeight="bold">
        <Tag size="lg" colorScheme="blackAlpha" borderRadius="full">
          <Avatar
            src="https://bit.ly/broken-link"
            // glo="true"
            size="xs"
            // name="Segun Adebayo"
            ml={-1}
            mr={2}
          />
          <TagLabel>Shared By {sharedBy} <span role="img" aria-label="sheep">😀</span></TagLabel>
        </Tag>
      </Text>
      <EditorStyle>
        <SunEditor
          //   setContents={postContent}
          getSunEditorInstance={getSunEditorInstance}
          setDefaultStyle="font-family: arial; font-size: 16px;"
          defaultValue={postContent}
          hideToolbar={true}
          readOnly={true}
          //   disable={true}
          autoFocus={false}
          setOptions={{
            mode: "balloon", // botton bar in editor is not visible in this mode
            katex: katex,
            height: "100%",
          }}
        />
      </EditorStyle>
    </>
  );
};
export default EditorForShredPost;
