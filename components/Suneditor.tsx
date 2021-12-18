//******************* sun editor*************************************** */

// Import katex
import { Box, Button } from "@chakra-ui/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
// import SunEditor from "suneditor-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
// import SunEditor from 'suneditor-react';

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { useAppContext } from "../state/state";
import { supabase } from "../lib/supabaseClient";
import { Post } from "../types/myTypes";

interface Props {
  postId: number;
  subHeadingId: number;
  isNew: string | undefined | string[];
}

const ButtonCustomList = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  ["paragraphStyle", "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "lineHeight"],
  ["table", "link", "image", "video", "audio", "math"],

  /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
  ["save", "template"],
];

const Editor = ({ control, defaultValue, name, ...props }: any) => {
  const {
    field: { value, onChange, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: defaultValue || "",
  });

  // console.log('inputProps:', inputProps);
  // console.log('invalid:', invalid);
  // console.log('isTouched:', isTouched);
  // console.log('isDirty:', isDirty);
  // console.log('touchedFields:', touchedFields);
  // console.log('dirtyFields:', dirtyFields);

  return (
    <SunEditor
      {...props}
      {...inputProps}
      defaultValue={value}
      // setContents={value}
      // onChange={onChange}
      setOptions={{
        height: "100%",
        buttonList: ButtonCustomList,
        mode: "balloon",
        katex: katex,
      }}
    />
  );
};

export default Editor;
