//******************* sun editor*************************************** */

// Import katex
import {
  Avatar,
  Box,
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
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdDoneAll, MdEdit, MdEditNote, MdEditOff, MdMode, MdRawOff, MdSave, MdShare } from "react-icons/md";
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
import SunEditorCore from "suneditor/src/lib/core";
import { FaAngrycreative } from "react-icons/fa";

const EditorStyle = styled.div`
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

const SunEditorForRendering: React.FC<Props> = ({ postId, isNew, postContent, isSharedPost, sharedBy }) => {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */
  // console.log("passed post content is ", postContent);
  if (!isSharedPost) {
    console.log("post id is ", postId);
    console.log("post  is ", postContent);
  }
  console.log("suneditor is rendering");
  //new ---editing enabled default, no button shown.
  //editing --> user finished typeing , edit mode off, saving indicator or saved indicator.
  //          ---> user still typeing
  //creating
  //normal --> edit mode on, share note,
  const isPostNewRef = useRef(isNew);
  const postRef = useRef(postContent);
  const isMountedRef = useRef(true);
  const postIdref = useRef<number>();
  postIdref.current = postId;
  const [firstTime, setFirstTime] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editFinished, seteditFinished] = useState(false);
  const [editOngoing, seteditOngoing] = useState(false);

  const [content, setContent] = useState("");

  const { currentSubheadingProps } = usePostContext();
  const [isNoPostExists, setIsNoPostExists] = useState(false);

  const { mutate } = useSWRConfig();
  const editor = useRef<SunEditorCore>();
  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    if (isNew) {
      isPostNewRef.current = true;
    } else {
      isPostNewRef.current = false;
    }
  }, [isNew]);
  useEffect(() => {
    if (editor && editor.current) {
      // editor.current.core.blur();
    }
  },[]);
  useEffect(() => {
    if (postContent) {
      postRef.current=postContent;
    }
  }, [postContent]);

  
  // // When the editor's content has changed, store it in state
  const handleOnChange = (editorContent: string) => {
    
    console.log("post id inside handle change", postIdref.current);
    if (editor.current?.core.hasFocus) {
      debouncedChange(editorContent, postIdref.current, isNoPostExists);
    }
    setContent(editorContent);
    // debouncedChange(editorContent, postId, isNoPostExists);
    // verify();
  };
  const createNewPostInDatabase = async (newcontent: string) => {
    console.log("creating post ");
    const { data, error } = await supabase.from<Post>("posts").insert([
      {
        post: newcontent,
        subheading_id: currentSubheadingProps?.id,
        created_by: supabase.auth.user()?.id,
      },
    ]);
    if (error) {
      myErrorLog("SunEditorForRendering", error.message);
      customToast({ title: "Post not created,error occurred", status: "error" });
    }
    if (data) {
      isPostNewRef.current = false;
      customToast({ title: "Post Created", status: "success" });
      //refresh user post data
      mutate(`/userpost/${currentSubheadingProps?.id}`);
      // setEditMode(true);
    }

    // setDefaultValue1("hello")
  };
  const updatePostInDatabase = async (newcontent: string, postId: number) => {
    console.log("post id inside updatepostmethod", postId);
    const { data, error } = await supabase.from<Post>("posts").update({ post: newcontent }).eq("id", postId);
    if (data) {
      customToast({ title: "Post updated..", status: "success" });
      // mutate(`/userpost/${currentSubheadingProps?.id}`);
    }
    if (isMountedRef.current) {
      // use this always when updating ui after asynchronus call finish
    }
  };

  const verify1 = (newcontent: any, postId: any, isNoPostExists: any) => {
    if (isPostNewRef.current) {
      console.log("creating new post");
      createNewPostInDatabase(newcontent);
    } else {
      console.log("updating old post id no", postId);

      updatePostInDatabase(newcontent, postId);
    }
    // console.log(`processing ${content}`);
  };

  //-------------------------------------------------------

  const debouncedFunctionRef = useRef<(newcontent: any, postId: any, isNoPostExists: any) => void>();
  debouncedFunctionRef.current = (newcontent: any, postId: any, isNoPostExists: any) =>
    verify1(newcontent, postId, isNoPostExists);

  const debouncedChange = useCallback(
    debounce((content1, postId, isNoPostExists) => debouncedFunctionRef.current!(content1, postId, isNoPostExists), 5000),
    []
  );
  //--------------------------------------------------------
  useEffect(() => {
    setContent(postContent as string);
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
            setContents={postContent}
            // defaultValue={postContent}
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
      <ButtonGroup  mb="" justifyContent="end" size="sm" isAttached variant="outline">
        <Box display={editMode ? "none" : "block"}>
          <UiForSharing postId={postId!} subheadingId={currentSubheadingProps?.id!} />
        </Box>
        <Button variant="solid" colorScheme={editMode ? "green" : "red"} onClick={ ()=>setEditMode(!editMode)}leftIcon={editMode?<MdEditOff />:<MdEdit/>}>{editMode ? "Edit mode off" : "Edit mode on"}</Button>
      </ButtonGroup>

      <EditorStyle>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          setDefaultStyle="font-family: arial; font-size: 16px;"
          hideToolbar={!editMode}
          // setContents={postContent} //--- this works
          // defaultValue={postContent}
          // defaultValue={content}
          // setContents={content}
          setContents={postRef.current}
          onChange={handleOnChange}
          readOnly={!editMode}
          // disable={!isPostNewRef.current}

          // hide={hideToolbar}
          setOptions={{
            mode: "balloon-always",
            katex: katex,
            height: "100%",

            buttonList: buttonList,
          }}
        />
      </EditorStyle>
      <Text>content Is : {content}</Text>
      <br />
      <Text>postcontent Is : {postContent}</Text>
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
      const {data:ispostexist,error:ispostexisterror}=await supabase.from<SharedPost>("sharedpost").select(
        `post_id`).match({post_id: postId,shared_with: email![0].id});
      
      if (ispostexist?.length!=0) {
        setMessage("This post is already shared");
      } else {
        
      const { data: sharedData, error } = await supabase.from<SharedPost>("sharedpost").insert({
        post_id: postId,
        shared_with: email![0].id,
        subheading_id: subheadingId,
      });
      if (error) {
        setMessage(error.message);
      }

      if (sharedData) {
        setMessage("Shared successfully");
      }
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
        <Button bg="yellow.200" leftIcon={<MdShare />} onClick={onOpen}>
          Share This Note
        </Button>
      </ButtonGroup>

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share your post</ModalHeader>
          <Text ml="4" color="red.300">{message}</Text>
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

interface editorActionsProps {
  isNew: boolean;
  editOngoing: boolean;
  editFinished: boolean;
  normal: boolean;
  postId: number;
  subheadingId: number;
}
