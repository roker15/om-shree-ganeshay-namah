import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { ReactNode } from "react";
// import EditorComponent from "../components/Suneditor";
// const MyComponent = dynamic(() => import("../components/Suneditor"),{ ssr: false });
import LayoutWithTopAndSideNavbar from "../layout/LayoutWithTopAndSideNavbar";
import PageWithLayoutType from "../types/pageWithLayout";

type PropTypes = {
  children?: ReactNode;
  subheadingId?: number;
  userId?: string; 
};
const Editor: React.FC = () => {
  const router = useRouter();
  const {
    query: { postId, isNew, subHeadingId }
  } = router;
  

  return (
    <div>
      edior not working
      {/* <div>{postId}</div>
      <div>{isNew}</div>
      <EditorComponent isNew={isNew} postId={Number(postId)} subHeadingId={Number(subHeadingId)} /> */}
    </div>
  );
};

(Editor as PageWithLayoutType).layout = LayoutWithTopAndSideNavbar;
export default Editor;
