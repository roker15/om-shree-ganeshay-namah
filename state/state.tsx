import { createContext, ReactNode, useContext, useState } from "react";

export interface CurrentAppState {
  postHeadingId: number | undefined;

  setPostHeadingId: (id: number) => void;
  paperId: string | undefined;
  setPaperId: (paperId: string) => void;
}
const AppContext = createContext<CurrentAppState>({
  postHeadingId: 0,
  setPostHeadingId: () => {},
  paperId: undefined,
  setPaperId: (paperId: string) => {},
});

export function AppContextWrapper({ children }: { children: ReactNode }) {
  const [postHeadingId, setPostHeadingId] = useState<number | undefined>(1);
  const [paperId, setPaperId] = useState<string | undefined>("");

  function updateId(id: number) {
    setPostHeadingId(id);
  }
  function updatePaperId(id: string) {
    setPaperId(id);
  }

  let sharedState: CurrentAppState = {
    /* whatever you want */
    postHeadingId: postHeadingId,
    setPostHeadingId: updateId,
    paperId: paperId,
    setPaperId: updatePaperId,
  };

  return <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
