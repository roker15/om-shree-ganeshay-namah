//******************* sun editor*************************************** */

// Import katex
import { Box, Button } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
// import SunEditor from "suneditor-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { useAppContext } from "../context/state";
import { supabase } from "../lib/supabaseClient";
import { Post } from "../types/myTypes";

interface Props {
  postId: number;
  subHeadingId: number;
  isNew: string | undefined | string[];
}

const EditorComponent: React.FC<Props> = ({ postId, isNew, subHeadingId }) => {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */
  const editorRef: React.MutableRefObject<typeof SunEditor | undefined> =
    useRef();
  const [content, setContent] = useState("");
  const [defaultValue1, setDefaultValue1] = useState("");
  const appcontext = useAppContext();

  // // When the editor's content has changed, store it in state
  const handleOnChange = (editorContent: string) => {
    // setDefaultValue1("madarchod")
    setContent(editorContent);
  };
  const createNewPostInDatabase = async () => {
    const { data, error } = await supabase
      .from<Post>("posts")
      .insert([{ post: content, subheading_id: subHeadingId }]);
    // setDefaultValue1("hello")
  };
  const updatePostInDatabase = async () => {
    const { data, error } = await supabase
      .from<Post>("posts")
      .update({ post: content })
      .eq("id", appcontext.postForEdit?.id!);
    // setDefaultValue1("hello")
  };

  // Send data to Firebase
  const handleCreateNewPost = () => {
    try {
      console.log(content);
      // await sendDataToFirebase(content)
      createNewPostInDatabase();
    } catch (error) {
      console.error("error is ss", error);
    }
  };
  const handleUpdatePost = () => {
    try {
      console.log(content);
      // await sendDataToFirebase(content)
      updatePostInDatabase();
    } catch (error) {
      console.error("error is ss", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here

      if (appcontext.isNew) {
        setDefaultValue1("");
      } else {
        setDefaultValue1(appcontext.postForEdit!.post);
      }
    }
    fetchData();

    // Get underlining core object here
    // Notice that useEffect is been used because you have to make sure the editor is rendered.
    // console.log(editorRef.current!.editor.core)
    console.log("from use effect in editor", editorRef);
  }, []);

  return (
    <div>
      <p> My Other Contents </p>
      <SunEditor
        setContents={defaultValue1}
        // defaultValue={defaultValue1}
        onChange={handleOnChange}
        setOptions={{
          katex: katex,
          height: "500",

          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            "/", // Line break
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio", "math"], // You must add the 'katex' library at options to use the 'math' plugin.
            /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["save", "template"],
          ],
          // plugins: [font] set plugins, all plugins are set by default
          // Other option
        }}
      />
      {appcontext.isNew === true ? (
        <Button mt="2" colorScheme="blue" variant="outline" onClick={handleUpdatePost}>
          Create Post
        </Button>
      ) : (
        <Button mt="2" colorScheme="blue" variant="outline" onClick={handleUpdatePost}>
          Update Post
        </Button>
      )}
    </div>
  );
};
export default EditorComponent;

//******************* draft.js*************************************** */
// import React, { useEffect, useState } from "react";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState } from "draft-js";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// const MyComponent=()=> {
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );
//   useEffect(() => {
//     console.log(editorState);
//   }, [editorState]);
//   return (
//     <div>
//       <h1 >React Editors</h1>
//       <h2>Start editing to see some magic happen!</h2>
//       <div style={{ border: "1px solid black", padding: '2px', minHeight: '400px' }}>
//         <Editor
//           editorState={editorState}
//           onEditorStateChange={setEditorState}
//         />
//       </div>
//     </div>
//   );
// }
// export default MyComponent;

//******************* quill.js*************************************** */
// import { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const MyComponent = () => {
//   const [convertedText, setConvertedText] = useState("Some default content");
//   return (
//     <div>
//       <ReactQuill
//         modules={{
//           formula: true,
//           toolbar: [
//             ["bold", "italic", "underline", "strike"], // toggled buttons
//             ["blockquote", "code-block"],

//             [{ header: 1 }, { header: 2 }], // custom button values
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }], // superscript/subscript
//             [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//             [{ direction: "rtl" }], // text direction

//             [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],

//             [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//             [{ font: [] }],
//             [{ align: [] }],

//             ["clean"], // remove formatting button
//             ['formula']
//           ],
//         }}
//         theme="snow"
//         value={convertedText}
//         onChange={setConvertedText}
//         style={{ minHeight: "300px" }}
//       />
//     </div>
//   );
// };
// export default MyComponent;
