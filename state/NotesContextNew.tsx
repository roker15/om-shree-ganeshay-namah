import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
export interface SubheadingCtx {
  id: number | undefined;
  name: string | undefined;
}
export interface NotesCreatorCtx {
  id: string | undefined| null;
  name: string | undefined|null;
}
export interface BookCtx {
  bookId: number | undefined;
  bookName: string | undefined;
}
interface State {
  selectedSubheading: SubheadingCtx | undefined;
  setSelectedSubheading: Dispatch<SetStateAction<SubheadingCtx | undefined>>;
  book: BookCtx | undefined;
  setBook: Dispatch<SetStateAction<BookCtx | undefined>>;
  notesCreator: NotesCreatorCtx | undefined;
  setNotesCreator: Dispatch<SetStateAction<NotesCreatorCtx | undefined>>;
  searchText: string | undefined;
  setSearchText: Dispatch<SetStateAction<string | undefined>>;
}

const NotesContextNew = createContext<State>({} as State);

//This is for providing contenxt, i,e context provider
export function NotesContextNewWrapper({ children }: { children: ReactNode }) {
  const [book, setBook] = useState<BookCtx | undefined>(undefined);
  const [selectedSubheading, setSelectedSubheading] = useState<SubheadingCtx | undefined>(undefined);
  const [notesCreator, setNotesCreator] = useState<NotesCreatorCtx | undefined>(undefined);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  let sharedState: State = {
    /* whatever you want */
    book,
    setBook,
    selectedSubheading,
    setSelectedSubheading,
    notesCreator,
    setNotesCreator,
    searchText,
    setSearchText
  };
  //return provider
  return <NotesContextNew.Provider value={sharedState}>{children}</NotesContextNew.Provider>;
}

//This is for consumer
export function useNotesContextNew() {
  return useContext(NotesContextNew);
}
