import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export type SubheadingformProps = {
  formMode: "CREATE_SUBHEADING" | "UPDATE_SUBHEADING";
  id?: number;
  subheading?: string;
  sequence?: number;
  heading_fk?: number;
};
export type HeadingformProps = {
  formMode: "CREATE_HEADING" | "UPDATE_HEADING";
  id?: number;
  heading?: string;
  sequence?: number;
  book_fk?: number;
};
export interface Book {
  bookId: number;
  bookName: string;
  colleges_fk?: number | null| undefined;
  syllabus_owner_fk?: string | null| undefined;
  moderator?: string[] | null | undefined;
  publication_fk?: number | null| undefined;
}

type formType = "HEAD" | "SUBHEAD" | undefined;
type displayType = "SYLLABUS" | "COLLEGE" | "COLLEGE_COURSE" | "PERSONAL_COURSE" |"NONE"| undefined;

interface State {
  headingFormProps: HeadingformProps | undefined;
  setHeadingFormProps: Dispatch<SetStateAction<HeadingformProps | undefined>>;
  subheadingFormProps: SubheadingformProps | undefined;
  setSubheadingFormProps: Dispatch<SetStateAction<SubheadingformProps | undefined>>;
  formType: formType;
  setFormType: Dispatch<SetStateAction<formType>>;
  book: Book | undefined;
  setBook: Dispatch<SetStateAction<Book | undefined>>;
  displayMode: displayType;
  setDisplayMode: Dispatch<SetStateAction<displayType>>;
  category: string| undefined;
  setCategory:Dispatch<SetStateAction<string| undefined>>;
}

const SyllabusContext = createContext<State>({} as State);

//This is for providing contenxt, i,e context provider
export function SyllabusContextProviderWrapper({ children }: { children: ReactNode }) {
  const [headingFormProps, setHeadingFormProps] = useState<HeadingformProps | undefined>(undefined);
  const [subheadingFormProps, setSubheadingFormProps] = useState<SubheadingformProps | undefined>(undefined);
  const [formType, setFormType] = useState<formType>(undefined);
  const [displayMode, setDisplayMode] = useState<displayType>(undefined);
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
 
  let sharedState: State = {
    /* whatever you want */
    headingFormProps,
    setHeadingFormProps,
    subheadingFormProps,
    setSubheadingFormProps,
    formType,
    setFormType,
    book,
    setBook,
    displayMode,
    setDisplayMode,
    category,
    setCategory
  };
  //return provider
  return <SyllabusContext.Provider value={sharedState}>{children}</SyllabusContext.Provider>;
}

//This is for consumer
export function useSyllabusContext() {
  return useContext(SyllabusContext);
}
