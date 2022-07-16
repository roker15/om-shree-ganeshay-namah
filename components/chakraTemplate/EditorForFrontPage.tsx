import { Box } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import React, { useRef } from "react";
import { BASE_URL, colors, SunEditor, sunEditorButtonList, sunEditorfontList } from "../../lib/constants";
import { useAuthContext } from "../../state/Authcontext";

// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
// import SunEditor from "suneditor-react";
import styled from "styled-components";
import SunEditorCore from "suneditor/src/lib/core";

const EditorForFrontPage: React.FunctionComponent = () => {
  const [editorMode, setEditorMode] = React.useState("READ");
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  return (
    <div>
      <Box>
        <EditorStyle title={editorMode === "READ" ? "READ" : "EDIT"}>
          <Center>
            <Editor getSunEditorInstance={getSunEditorInstance}></Editor>
          </Center>
        </EditorStyle>
      </Box>
    </div>
  );
};
export default EditorForFrontPage;

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
    border: ${(props) => (props.title === "READ" ? "none" : undefined)};
  }
`;

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
}

function Editor(props: editorProps): JSX.Element {
  return (
    <SunEditor
      getSunEditorInstance={props.getSunEditorInstance}
      setDefaultStyle="font-family: arial; font-size: 16px;"
      defaultValue="Type of Content Here"
      setOptions={{
        placeholder: `Try you content here, It's for demo purpose, data will not be saved`,
        mode: "classic",
        hideToolbar: true,
        katex: katex,
        colorList: colors,
        textStyles: textStyles,
        // height: "100%",
        // width: "auto",
        minWidth: "350px",
        maxWidth: "650px",
        minHeight: "300px",
        buttonList: sunEditorButtonList,
        resizingBar: false,
        // formats: ["p", "div", "h1", "h2", "h3"],
        font: sunEditorfontList,
        fontSize: [12, 14, 16, 20],
        imageSizeOnlyPercentage: false, //changed on 6 june
      }}
    />
  );
}
