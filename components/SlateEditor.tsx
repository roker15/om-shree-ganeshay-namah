import React, { useState } from "react";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import katex from "katex";
import "katex/dist/katex.min.css";

typeof window !== "undefined"? (() => {window.katex = katex;})(): "";


const SlateEdit=()=> {
  const [value, setValue] = useState('');

  return (
    <ReactQuill theme="snow" value={value} modules={modules} onChange={setValue}/>
  );
}
export default SlateEdit;


const modules = {
  /*toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ],*/
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    // ["table"],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ header: [1, 2, 3, false] }],

    ["link", "image", "formula"],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],

    ["clean"] // remove formatting button
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  },
  // tableqqq1: true,
};