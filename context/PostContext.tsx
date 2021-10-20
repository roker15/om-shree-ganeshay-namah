import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Post } from "../types/myTypes";

export interface CurrentAppState {
  currentHeadingId: number | undefined;
  currentSubheadingId: number | undefined;
  currentSubheading: string | undefined;
  currentPapername: string | undefined;

  updateCurrentHeadingId: (id: number) => void;
  updateCurrentSubheadingId: (id: number) => void;
  updateCurrentSubheading: (subheading: string) => void;
  updateCurrentPapername: (papername: string) => void;

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
});

export function PostContextWrapper({ children }: { children: ReactNode }) {
  const [currentHeadingId, setCurrentHeadingId] = useState<number | undefined>(
    undefined
  );
  const [currentSubheadingId, setCurrentSubheadingId] = useState<
    number | undefined
  >(undefined);
  const [currentSubheading, setCurrentSubheading] = useState<
    string | undefined
  >(undefined);
  const [currentPapername, setCurrentPapername] = useState<string | undefined>(
    undefined
  );

  // useEffect(() => {
  //   if (currentSubheadingId) {
  //     window.localStorage.setItem(
  //       "currentSubheadingId",
  //       String(currentSubheadingId as number)
  //     );
  //   }
  // }, [currentSubheadingId]);

  // useEffect(() => {
  //   if (JSON.parse(window.localStorage.getItem("currentSubheadingId")=="undefined") {

  //   }
  //   setCurrentSubheadingId(
  //     Number(
  //       JSON.parse(window.localStorage.getItem("currentSubheadingId") as string)
  //     )
  //   );
  // }, []);

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

  let sharedState: CurrentAppState = {
    /* whatever you want */
    currentHeadingId: currentHeadingId,
    updateCurrentHeadingId: updateCurrentHeadingId,
    currentSubheadingId: currentSubheadingId,
    updateCurrentSubheadingId: updateCurrentSubheadingId,
    currentSubheading: currentSubheading,
    updateCurrentSubheading: updateCurrentSubheading,
    currentPapername:currentPapername,
    updateCurrentPapername:updateCurrentPapername
  };

  return (
    <PostContext.Provider value={sharedState}>{children}</PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
