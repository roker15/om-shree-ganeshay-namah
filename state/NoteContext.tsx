import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { BookResponse } from "../types/myTypes";

export interface CurrentAppState {
  isTagSearchActive: boolean | undefined;
  setIsTagSearchActive: (tagSearchActive: boolean) => void;
  tagsArray?: number[] ;
  setTagsArray?: (tags: number[]) => void;
  bookResponse: BookResponse | undefined;
  setBookResponse: Dispatch<SetStateAction<BookResponse | undefined>>;
}

const NoteContext = createContext<CurrentAppState>({
  isTagSearchActive: false,
  setIsTagSearchActive: () => {},
  tagsArray: [],
  setTagsArray: () => {},
  bookResponse: undefined,
  setBookResponse: () => {},
});

export function NoteContextWrapper({ children }: { children: ReactNode }) {
  const [isTagSearchActive, setIsTagSearchActive] = useState<boolean | undefined>(false);
  const [bookResponse, setBookResponse] = useState<BookResponse | undefined>();
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
    setTagsArray: setTagsArray,
    isTagSearchActive: isTagSearchActive,
    setIsTagSearchActive: setIsTagSearchActive,
    bookResponse: bookResponse,
    setBookResponse: setBookResponse,
  };

  return <NoteContext.Provider value={sharedState}>{children}</NoteContext.Provider>;
}

export function useNoteContext() {
  return useContext(NoteContext);
}
