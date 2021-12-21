import {
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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdEdit, MdEditOff, MdShare } from "react-icons/md";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import SunEditorCore from "suneditor/src/lib/core";
import { useSWRConfig } from "swr";
import { usePostContext } from "../state/PostContext";
import { myErrorLog, myInfoLog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
import { Post, Profile, SharedPost } from "../types/myTypes";
import { customToast } from "./CustomToast";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/main/lib/SupabaseAuthClient";

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
  currentSubheadingId?: number;
  isNew?: boolean;
  postContent?: string;
  isSharedPost?: boolean;
  sharedBy?: string;
}

const buttonList = [
  // ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  [/*"paragraphStyle",*/ "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list" /* "lineHeight"*/],
  ["table", "link", "image", /* "video","audio",*/ "math"],

  /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
  // ["fullScreen" /*, "showBlocks", "codeView"*/],
  [
    // "preview",
    "print",
  ],
  // ["save", "template"],
];

const fontList = [
  "Arial",
  "Comic Sans Ms",
  // "Bookman Old Style",
  // "Georgia",
  // "Calibri",
  // "Comic Sans",
  // "Courier",
  // "Garamond",
  // "Impact",
  // "Lucida Console",
  // "Palatino Linotype",
  // "Segoe UI",
  // "Tahoma",
  // "Times New Roman",
  // "Trebuchet MS",
  // "Open Sans",
  // "Roboto Slab",

];
const SunEditorForRendering: React.FC<Props> = ({ postId, isNew, postContent }) => {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */

  myInfoLog("SunEditorForRendering postContent is ", postContent);
  myInfoLog("SunEditorForRendering ", "component is rendering");

  const isPostNewRef = useRef(isNew);
  const isMountedRef = useRef(true);
  const postIdref = useRef<number | undefined>(postId);
  const [editMode, setEditMode] = useState(true);
  const { currentSubheadingProps } = usePostContext();
  const { mutate } = useSWRConfig();
  const editor = useRef<SunEditorCore>();
  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (isNew) {
      isPostNewRef.current = true;
    } else {
      isPostNewRef.current = false;
    }
  }, [isNew]);

  useEffect(() => {
    postIdref.current = postId;
  }, [postId]);

  // Below useEffect is important because suneditor does not automatically update after first render, we need to manually update, other react component will automatically & correctly update after first render, when props changes.
  useEffect(() => {
    if (postContent && editor.current && editor.current.core) {
      editor.current?.core.setContents(postContent);
    }
  }, [postContent]);

  // // When the editor's content has changed, store it in state
  const handleOnChange = (editorContent: string) => {
    console.log("post id inside handle change", postIdref.current);
    if (editor.current?.core.hasFocus) {
      debouncedFunctionRef.current!(editorContent, postIdref.current);
    }
  };
  const createNewPostInDatabase = async (newcontent: string) => {
    try {
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
        isPostNewRef.current = false; // now post is not new
        postIdref.current = data[0].id; // now post id is available
        customToast({ title: "Post Created", status: "success" });
        // mutate(`/userpost/${currentSubheadingProps?.id}`);
      }
    } catch (error: any) {
      customToast({ title: "Post not updated,error occurred,  " + error.message, status: "error" });
    }
  };
  const updatePostInDatabase = async (newcontent: string, postId: number) => {
    myInfoLog("SunEditorForRendering->updatepostindatabase","method is called")
    try {
      const { data, error } = await supabase.from<Post>("posts").update({ post: newcontent }).eq("id", postId);
      if (error) {
        myErrorLog("SunEditorForRendering", error.message);
        customToast({ title: "Post not updated,error occurred", status: "error" });
      }

      if (data) {
        customToast({ title: "Post updated...", status: "success" });
        // mutate(`/userpost/${currentSubheadingProps?.id}`);
      }
      if (isMountedRef.current) {
        // use this always when updating ui after asynchronus call finish
      }
    } catch (error: any) {
      customToast({ title: "Post not updated,error occurred,  " + error.message, status: "error" });
    }
  };

  const createOrUpdatePost = (newcontent: any, postId: any) => {
    if (isPostNewRef.current) {
      createNewPostInDatabase(newcontent);
    } else {
      updatePostInDatabase(newcontent, postId);
    }
  };

  //-------------------------------------------------------

  // const debouncedFunctionRef = useRef<(newcontent: any, postId: any) => void>((newcontent: any, postId: any) =>
  //   createOrUpdatePost(newcontent, postId)
  // );
  // const debouncedChange = useCallback(
  //   // debounce((editorContent, postId) => debouncedFunctionRef.current!(editorContent, postId), 5000),
  //   // []

  //   debounce((editorContent, postId) => createOrUpdatePost(editorContent, postId), 5000),
  //   []
  // );

  const debouncedFunctionRef = useRef<(newcontent: any, postId: any) => void>();
  debouncedFunctionRef.current = debounce((newcontent: any, postId: any) => createOrUpdatePost(newcontent, postId), 5000);
  const debouncedChange = useCallback(
    // debounce((editorContent, postId) => debouncedFunctionRef.current!(editorContent, postId), 5000),
    // []

    debounce((editorContent, postId) => createOrUpdatePost(editorContent, postId), 5000),
    []
  );

  return (
    <div>
      <Divider />
      <ButtonGroup mb="-3" justifyContent="end" size="sm" isAttached variant="outline">
        <Button
          variant="solid"
          colorScheme={editMode ? "twitter" : "facebook"}
          onClick={() => setEditMode(!editMode)}
          leftIcon={editMode ? <MdEditOff /> : <MdEdit />}
        >
          {editMode ? "Deactivate Edit Mode" : "Activate Edit Mode"}
        </Button>
        <Box display={editMode ? "none" : "block"}>
          <UiForSharing postId={postId!} subheadingId={currentSubheadingProps?.id!} />
        </Box>
      </ButtonGroup>

      <EditorStyle>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          setDefaultStyle="font-family: arial; font-size: 16px;"
          hideToolbar={!editMode}
          defaultValue={postContent}
          // key={postId}
          onChange={handleOnChange}
          readOnly={!editMode}
          autoFocus={false}
          setOptions={{
            placeholder: "**** Start Writing your notes here, we will save it automatically!!!",
            mode: "balloon",
            katex: katex,
            height: "100%",
            buttonList: buttonList,
            formats: ["p", "div", "h1", "h2", "h3"],
            font: fontList,
            fontSize: [12, 14, 16, 20],
            
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
  const [isLoading, setIsLoading] = React.useState(false);
  // const [error, setError] = React.useState(null);

  const initialRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const finalRef = useRef<HTMLInputElement | HTMLButtonElement | HTMLLabelElement>(null);
  const handleSharePost = async () => {
    setIsLoading(true);
    if (inputEmail == supabase.auth.session()?.user?.email) {
      setMessage("**You can not share your post to yourself ! ");
      setIsLoading(false);
      return;
    }
    const { data: email, error } = await supabase.from<Profile>("profiles").select("id,email").eq("email", inputEmail);
    // .single();
    if (error) {
      setMessage("Something went wrong!");
      return;
    }
    if (email?.length == 0) {
      setMessage("This email is not valid");
    } else {
      setMessage("");
      const { data: ispostexist, error: ispostexisterror } = await supabase
        .from<SharedPost>("sharedpost")
        .select(`post_id`)
        .match({ post_id: postId, shared_with: email![0].id });

      if (ispostexist?.length != 0) {
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
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    setInputEmail(e.target.value);
    // console.log('handle change called')
  };

  return (
    <>
      <ButtonGroup mb="" justifyContent="end" size="sm" isAttached variant="outline">
        <Button colorScheme="facebook" variant="outline" leftIcon={<MdShare />} onClick={onOpen}>
          Share This Note
        </Button>
      </ButtonGroup>

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share your post</ModalHeader>
          <Text ml="4" color="blue.400">
            {message}
            {message ? "..." : ""}
          </Text>
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
            <Button isLoading={isLoading} leftIcon={<MdShare />} onClick={handleSharePost} colorScheme="blue" mr={3}>
              Share
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
