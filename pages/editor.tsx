import { useQuery } from "@chakra-ui/media-query";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { ReactNode } from "react";
import EditorComponent from "../components/Suneditor";
// const MyComponent = dynamic(() => import("../components/Suneditor"),{ ssr: false });
import MainLayout from "../layout/LayoutWithTopAndSideNavbar";
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
      <div>{postId}</div>
      <div>{isNew}</div>
      <EditorComponent isNew={isNew} postId={Number(postId)} subHeadingId={Number(subHeadingId)} />
    </div>
  );
};

(Editor as PageWithLayoutType).layout = MainLayout;
export default Editor;
