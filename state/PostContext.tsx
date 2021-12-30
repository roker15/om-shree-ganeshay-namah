import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Post } from "../types/myTypes";

export interface CurrentAppState {
  currentHeadingId: number | undefined;
  currentSubheadingId: number | undefined;
  currentSubheading: string | undefined;
  currentPapername: string | undefined;
  currentHeadingname: string | undefined;
  currentSubheadingProps: { id: number | undefined; topic: string | undefined } | undefined;

  updateCurrentHeadingId: (id: number) => void;
  updateCurrentSubheadingId: (id: number) => void;
  updateCurrentSubheading: (subheading: string) => void;
  updateCurrentPapername: (papername: string) => void;
  updateCurrentHeadingname: (headingname: string) => void;
  updateCurrentSubheadingProps: (id: number,topic:string) => void;

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
  currentSubheading: undefined,
  updateCurrentSubheading: () => {},
  currentPapername: undefined,
  updateCurrentPapername: () => {},
  currentHeadingname: undefined,
  updateCurrentHeadingname: () => {},
  currentSubheadingProps: undefined,
  updateCurrentSubheadingProps: () => {},
});

export function PostContextWrapper({ children }: { children: ReactNode }) {
  const [currentHeadingId, setCurrentHeadingId] = useState<number | undefined>(undefined);
  const [currentSubheadingId, setCurrentSubheadingId] = useState<number | undefined>(undefined);
  const [currentSubheading, setCurrentSubheading] = useState<string | undefined>(undefined);
  const [currentPapername, setCurrentPapername] = useState<string | undefined>(undefined);
  const [currentHeadingname, setCurrentHeadingname] = useState<string | undefined>(undefined);
  const [currentSubheadingProps, setCurrentSubheadingProps] = useState<{ id: number; topic: string } | undefined>(undefined);

  useEffect(() => {
    setCurrentSubheadingId(Number(window.localStorage.getItem("currentSubheadingId") as string));
    setCurrentHeadingId(Number(window.localStorage.getItem("currentHeadingId") as string));
    setCurrentSubheading(window.localStorage.getItem("currentSubheading") as string);
    setCurrentHeadingname(window.localStorage.getItem("currentHeadingname") as string);
    setCurrentPapername(window.localStorage.getItem("currentPapername") as string);
    setCurrentSubheadingProps({...currentSubheadingProps,
      id: parseInt(window.localStorage.getItem("id") as string, 10),
      topic: window.localStorage.getItem("topic") as string,
    });
  }, []);

  useEffect(() => {
    if (currentSubheadingId) {
      window.localStorage.setItem("currentSubheadingId", String(currentSubheadingId as number));
    }
    if (currentHeadingId) {
      window.localStorage.setItem("currentHeadingId", String(currentHeadingId as number));
    }
    if (currentSubheading) {
      window.localStorage.setItem("currentSubheading", currentSubheading);
    }
    if (currentHeadingname) {
      window.localStorage.setItem("currentHeadingname", currentHeadingname);
    }
    if (currentPapername) {
      window.localStorage.setItem("currentPapername", currentPapername);
    }
    if (currentSubheadingProps) {
      window.localStorage.setItem("id", String(currentSubheadingProps.id));
      window.localStorage.setItem("topic", currentSubheadingProps.topic);
    }
  }, [
    currentHeadingId,
    currentHeadingname,
    currentPapername,
    currentSubheading,
    currentSubheadingId,
    currentSubheadingProps,
  ]);

  function updateCurrentHeadingId(id: number) {
    console.log("current heading is ", id);
    setCurrentHeadingId(id);
  }
  function updateCurrentSubheadingId(id: number) {
    console.log("current subheading is ", id);
    setCurrentSubheadingId(id);
  }
  function updateCurrentSubheading(subheading: string) {
    setCurrentSubheading(subheading);
  }
  function updateCurrentPapername(papername: string) {
    setCurrentPapername(papername);
  }
  function updateCurrentHeadingname(heading: string) {
    setCurrentHeadingname(heading);
  }
  function updateCurrentSubheadingProps(id: number,topic:string) {
    setCurrentSubheadingProps({id:id,topic:topic});
  }
  let sharedState: CurrentAppState = {
    /* whatever you want */
    currentHeadingId: currentHeadingId,
    updateCurrentHeadingId: updateCurrentHeadingId,
    currentSubheadingId: currentSubheadingId,
    updateCurrentSubheadingId: updateCurrentSubheadingId,
    currentSubheading: currentSubheading,
    updateCurrentSubheading: updateCurrentSubheading,
    currentPapername: currentPapername,
    updateCurrentPapername: updateCurrentPapername,
    currentHeadingname: currentHeadingname,
    updateCurrentHeadingname: updateCurrentHeadingname,
    currentSubheadingProps: currentSubheadingProps,
    updateCurrentSubheadingProps: updateCurrentSubheadingProps
  };

  return <PostContext.Provider value={sharedState}>{children}</PostContext.Provider>;
}

export function usePostContext() {
  return useContext(PostContext);
}
