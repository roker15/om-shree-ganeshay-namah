//******************* sun editor*************************************** */

// Import katex
import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { MdDoneAll, MdEditOff, MdMode, MdSave, MdShare } from "react-icons/md";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { mutate, useSWRConfig } from "swr";
import { usePostContext } from "../context/PostContext";
import { useAppContext } from "../context/state";
import { myErrorLog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
import { Post, Profile, SharedPost } from "../types/myTypes";
import { customToast } from "./CustomToast";
// import SunEditor from "suneditor-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EditorStyle = styled.div`
  /* ol {
    background: #ff9999 !important;
    padding: 0px !important;
    margin-left: 35px !important;
  } */

  /* ul {
  background: #ebc683;
  padding: 2px;
  margin-left: 35px;
} */

  /* ol li {
    background: #ffe5e5 !important;
    padding: 10px !important;
    margin-left: 25px !important;
    margin-top: -6px !important;
  } */

  .sun-editor {
    /* margin-top: -18px !important; */
    /* border: 1px solid blue; */
    /* border: none; */
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    text-align: left;
    padding: 8px;
    font-family: "Rock Salt", cursive;
    padding: 20px;
    // font-style: italic;
    caption-side: bottom;
    /* color: #666; */
    /* text-align: right; */
    letter-spacing: 1px;
    font-weight: lighter !important;
  }
  th {
    font-style: italic;
    caption-side: bottom;
    color: #616 !important;
    font-weight: lighter !important;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

interface Props {
  postId?: number;
  currentSubheadingId?: number;
  isNew?: boolean;
  postContent?: string;
  isSharedPost?: boolean;
  sharedBy?: string;
}

const buttonList = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  [/*"paragraphStyle",*/ "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "lineHeight"],
  ["table", "link", "image", /* "video","audio",*/ "math"],

  /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
  ["fullScreen" /*, "showBlocks", "codeView"*/],
  ["preview", "print"],
  // ["save", "template"],
];

// const initialState = {
//   content: "",
//   isSubmitting: false,
//   hideToolbar: true,
//   editorReadOnly: true,
//   editMode: false,
//   defaultValue1: "",
//   isNoPostExists: false,
// };
// const reducer = (state, action:"activate"|"save"|"update"|"edit"|) => {
//   switch (action.type) {
//     case 'increment':
//       return { ...state, counter1: state.counter1 + action.value };
//     case 'decrement':
//       return { ...state, counter1: state.counter1 - action.value };
//     case 'reset':
//       return initialState;
//     default:
//       return state;
//   }
// }

const SunEditorForRendering: React.FC<Props> = ({ postId, isNew, postContent, isSharedPost, sharedBy }) => {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */
  // console.log("passed post content is ", postContent);
  console.log("suneditor is rendering");
  const editorRef: React.MutableRefObject<typeof SunEditor | undefined> = useRef();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideToolbar, setHideToolbar] = useState(true);
  const [editorReadOnly, setEditorReadOnly] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [defaultValue1, setDefaultValue1] = useState(postContent);
  const [isNoPostExists, setIsNoPostExists] = useState(false);
  const appcontext = useAppContext();
  const { currentSubheadingProps } = usePostContext();
  const { mutate } = useSWRConfig()
  const toast = useToast();
  useEffect(() => {
    if (isNew) {
      // setEditorReadOnly(false);
      // setHideToolbar(false);
      setIsNoPostExists(true);
    }
  }, [isNew]);

  // // When the editor's content has changed, store it in state
  const handleOnChange = (editorContent: string) => {
    // setDefaultValue1("madarchod")
    setContent(editorContent);
  };
  const createNewPostInDatabase = async () => {
    console.log("creating post ");
    const { data, error } = await supabase.from<Post>("posts").insert([
      {
        post: content,
        subheading_id: currentSubheadingProps?.id,
        created_by: supabase.auth.user()?.id,
      },
    ]);
    if (error) {
      myErrorLog("SunEditorForRendering", error.message);
      customToast({title:"Post not created,error occurred",status: "error"})
    }
    if (data) {
      customToast({ title: "Post Created", status: "success" })
      //refresh user post data
      mutate(`/userpost/${currentSubheadingProps?.id}`)
      setEditMode(true);
      setIsNoPostExists(false);
    }
    setIsSubmitting(false);

    // setDefaultValue1("hello")
  };
  const updatePostInDatabase = async () => {
    const { data, error } = await supabase
      .from<Post>("posts")
      .update({ post: content })
      .eq("id", postId as number);

    setIsSubmitting(false);
    setEditMode(true);
  };

  // Send data to Firebase
  const handleCreateNewPost = () => {
    setIsSubmitting(true);
    try {
      console.log(content);
      createNewPostInDatabase();
    } catch (error) {
      console.error("error is ss", error);
    }
  };
  const handleUpdatePost = () => {
    setIsSubmitting(true);
    try {
      console.log(content);
      // await sendDataToFirebase(content)
      updatePostInDatabase();
    } catch (error) {
      console.error("error is ss", error);
    }
  };
  const handleEditPost = () => {
    setEditorReadOnly(false);
    setHideToolbar(false);
    setEditMode(true);
  };
  const handelCancelEdit = () => {
    setEditorReadOnly(true);
    setHideToolbar(true);
    setEditMode(false);
  };

  useEffect(() => {
    setContent(postContent!);
  }, [postContent]);

  if (isSharedPost) {
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
            <TagLabel>{sharedBy}</TagLabel>
          </Tag>
        </Text>
        <EditorStyle>
          <SunEditor
            setContents={defaultValue1}
            // onChange={handleOnChange}
            hideToolbar={true}
            readOnly={true}
            // disable={true}

            // hide={hideToolbar}
            setOptions={{
              mode: "balloon",
              katex: katex,
              height: "100%",
              buttonList: buttonList,
            }}
          />
        </EditorStyle>
      </>
    );
  }

  return (
    <div>
      <Divider />

      {/* {isSharedPost:():(div)} */}

      {isNoPostExists && hideToolbar ? (
        <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
          <Button
            leftIcon={<MdDoneAll />}
            mt="2"
            
            // colorScheme="blue"
            variant="outline"
            onClick={() => {
              setHideToolbar(false);
              setEditorReadOnly(false);
            }}
          >
            Activate Editor
          </Button>
        </ButtonGroup>
      ) : (
        ""
      )}

      {editMode && !isNoPostExists ? (
        <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
          {" "}
          <Button
            leftIcon={<MdEditOff />}
            mt="2"
            // colorScheme="blue"
            variant="outline"
            onClick={handelCancelEdit}
          >
            Disable edit Mode
          </Button>
          <Button
            leftIcon={<MdDoneAll />}
            mt="2"
            isLoading={isSubmitting}
            // colorScheme="blue"
            variant="outline"
            onClick={handleUpdatePost}
          >
            Update Edit
          </Button>
        </ButtonGroup>
      ) : (
        ""
        // <div></div>
      )}

      {}

      {isNoPostExists ? (
        <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
          <Button
            leftIcon={<MdSave />}
            mt="2"
            // colorScheme="blue"
            // variant="outline"
            isLoading={isSubmitting}
            isDisabled={content == undefined || content.length < 20}
            onClick={handleCreateNewPost}
          >
            Create new Note
          </Button>
        </ButtonGroup>
      ) : (
        ""
        // <div></div>
      )}
      {!editMode && !isNoPostExists ? (
        <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
          <Button
            leftIcon={<MdMode />}
            mt="2"
            // colorScheme="blue"
            // variant="outline"
            onClick={handleEditPost}
          >
            Edit Note
          </Button>
        </ButtonGroup>
      ) : (
        // <div></div>
        ""
      )}
      {!editMode && !isNoPostExists ? (
        <UiForSharing postId={postId as number} subheadingId={currentSubheadingProps?.id as number} />
      ) : (
        ""
      )}

      <EditorStyle>
        <SunEditor
          setDefaultStyle="font-family: arial; font-size: 16px;"
          hideToolbar={hideToolbar}
          setContents={content}
          onChange={handleOnChange}
          readOnly={editorReadOnly}
          // disable={true}

          // hide={hideToolbar}
          setOptions={{
            mode: "balloon-always",
            katex: katex,
            height: "100%",

            buttonList: buttonList,
          }}
        />
      </EditorStyle>
    </div>
  );
};
export default SunEditorForRendering;
interface sharedProps {
  postId: number;
  subheadingId: number;
}
const UiForSharing: React.FC<sharedProps> = ({ postId, subheadingId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputEmail, setInputEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  // const [error, setError] = React.useState(null);

  const initialRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const finalRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const handleSharePost = async () => {
    console.log("handle share clicked");
    const { data: email, error } = await supabase.from<Profile>("profiles").select("id,email").eq("email", inputEmail);
    // .single();
    if (error) {
      console.log("error hai ");
      setMessage("No user found for this email");
      return;
    }
    if (email?.length == 0) {
      setMessage("This email is not valid");
    } else {
      setMessage("");
      const { data: sharedData, error } = await supabase.from<SharedPost>("sharedpost").insert({
        post_id: postId,
        shared_with: email![0].id,
        subheading_id: subheadingId,
      });
      if (error) {
        setMessage(error.message);
      }

      if (sharedData) {
        setMessage("shared successfully");
      }
    }
  };

  const handleChange = (e: any) => {
    setInputEmail(e.target.value);
    // console.log('handle change called')
  };

  return (
    <>
      <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
        <Button leftIcon={<MdShare />} onClick={onOpen}>
          Share This Note
        </Button>
      </ButtonGroup>

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share your post</ModalHeader>
          <Text>{message}</Text>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email of your friend</FormLabel>
              <Input
                name="email"
                value={inputEmail}
                onChange={handleChange}
                ref={initialRef as React.RefObject<HTMLInputElement>}
                placeholder="First name"
              />
              {/* <FormErrorMessage>{error}</FormErrorMessage> */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button leftIcon={<MdShare />} onClick={handleSharePost} colorScheme="blue" mr={3}>
              Share
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

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
