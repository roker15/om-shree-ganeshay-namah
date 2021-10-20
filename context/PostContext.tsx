import { createContext, ReactNode, useContext, useState } from "react";
import { Post } from "../types/myTypes";

export interface CurrentAppState {
  currentHeadingId: number|undefined;
  currentSubheadingId:number|undefined;
  currentSubheading:string|undefined;

  updateCurrentHeadingId: (id: number) => void;
  updateCurrentSubheadingId: (id: number) => void;
  updateCurrentSubheading: (subheading: string) => void;

  // subHeadingIdForNewPost: number|undefined;
  // setSubheadingIdForNewPost: (id: number) => void;
  // postForEdit: Post|undefined;
  // setPostForEdit: (post: Post) => void;
}
const PostContext = createContext<CurrentAppState>({
  currentHeadingId: undefined,
  updateCurrentHeadingId: () => {},
  currentSubheadingId: undefined,
  updateCurrentSubheadingId: () => {},
  currentSubheading:undefined,
  updateCurrentSubheading:()=>{}
});

export function PostContextWrapper({ children }: { children: ReactNode }) {
  const [currentHeadingId, setCurrentHeadingId] = useState<number|undefined>(undefined);
  const [currentSubheadingId, setCurrentSubheadingId] = useState<number|undefined>(undefined);
  const [currentSubheading, setCurrentSubheading] = useState<string|undefined>(undefined);
 

  function updateCurrentHeadingId(id: number) {
    console.log("current heading is ", id)
    setCurrentHeadingId(id);
  }
  function updateCurrentSubheadingId(id: number) {
    console.log("current subheading is ", id)
    setCurrentSubheadingId(id);
  }
  function updateCurrentSubheading(subheading: string) {
    setCurrentSubheading(subheading);
  }

  let sharedState: CurrentAppState = {
    /* whatever you want */
    currentHeadingId: currentHeadingId,
    updateCurrentHeadingId: updateCurrentHeadingId,
    currentSubheadingId: currentSubheadingId,
    updateCurrentSubheadingId: updateCurrentSubheadingId,
    currentSubheading:currentSubheading,
    updateCurrentSubheading:updateCurrentSubheading
    };

  return (
    <PostContext.Provider value={sharedState}>{children}</PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
