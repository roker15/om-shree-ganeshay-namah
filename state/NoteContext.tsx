import { createContext, ReactNode, useContext, useState } from "react";

export interface CurrentAppState {
  isTagSearchActive: boolean | undefined;
  setIsTagSearchActive: (tagSearchActive: boolean) => void;
  tagsArray?: number[] | undefined;
  setTagsArray?: (tags: number[]) => void;
}

const NoteContext = createContext<CurrentAppState>({
  isTagSearchActive: false,
  setIsTagSearchActive: () => {},
  tagsArray: [],
  setTagsArray: () => {},
});

export function NoteContextWrapper({ children }: { children: ReactNode }) {
  const [isTagSearchActive, setIsTagSearchActive] = useState<boolean | undefined>(false);
  const [tagsArray, setTagsArray] = useState<number[]>([]);

  function updateIsTagSearchActive(x: boolean) {
    setIsTagSearchActive(x);
  }
  function updateTagsArray(x: number[]) {
    setTagsArray(x);
  }

  let sharedState: CurrentAppState = {
    /* whatever you want */
    tagsArray: tagsArray,
    setTagsArray: updateTagsArray,
    isTagSearchActive: isTagSearchActive,
    setIsTagSearchActive: updateIsTagSearchActive,
  };

  return <NoteContext.Provider value={sharedState}>{children}</NoteContext.Provider>;
}

export function useNoteContext() {
  return useContext(NoteContext);
}
