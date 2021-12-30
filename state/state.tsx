import { createContext, ReactNode, useContext, useState } from "react";
import { Post } from "../types/myTypes";

export interface CurrentAppState {
  postHeadingId: number|undefined;

  setPostHeadingId: (id: number) => void;

  // subHeadingIdForNewPost: number|undefined;
  // setSubheadingIdForNewPost: (id: number) => void;
  // postForEdit: Post|undefined;
  // setPostForEdit: (post: Post) => void;
  // isNewPost: boolean|undefined;
  // setIsNew: (isNew: boolean) => void;
  //******paperId for syllabus heading*** */
  paperId: string|undefined;
  setPaperId: (paperId: string) => void;
}
const AppContext = createContext<CurrentAppState>({
  postHeadingId: 0,
  setPostHeadingId: () => {},
  // subHeadingIdForNewPost: undefined,
  // setSubheadingIdForNewPost: () => {},
  // postForEdit:undefined,
  // setPostForEdit: () => {},
  // isNewPost: false,
  // setIsNew: (isNew: boolean) => {},
  paperId:undefined,
  setPaperId: (paperId: string) => {},
});

export function AppContextWrapper({ children }: { children: ReactNode }) {
  const [postHeadingId, setPostHeadingId] = useState<number|undefined>(1);
  // const [subHeadingIdForNewPost, setSubheadingIdForNewPost] = useState<number|undefined>(undefined);
  // const [postForEdit, setPostForEdit] = useState<Post|undefined>(undefined);
  // const [isNew, setIsNew] = useState<boolean|undefined>(true);
  const [paperId, setPaperId] = useState<string|undefined>("");

  function updateId(id: number) {
    setPostHeadingId(id);
  }
  // function updateSubHeadingIdForNewPost(id: number) {
  //   setSubheadingIdForNewPost(id);
  // }
  // function updatePostForEdit(post: Post) {
  //   setPostForEdit(post);
  // }
  // function updateIsNew(id: boolean) {
  //   setIsNew(id);
  // }
  function updatePaperId(id: string) {
    setPaperId(id);
  }

  let sharedState: CurrentAppState = {
    /* whatever you want */
    postHeadingId: postHeadingId,
    setPostHeadingId: updateId,
    // subHeadingIdForNewPost: subHeadingIdForNewPost,
    // setSubheadingIdForNewPost: updateSubHeadingIdForNewPost,
    // postForEdit: postForEdit,
    // setPostForEdit: updatePostForEdit,
    // isNewPost: isNew,
    // setIsNew: updateIsNew,
    paperId:paperId,
    setPaperId:updatePaperId
    };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
