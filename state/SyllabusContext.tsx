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

interface State {
  headingFormProps: HeadingformProps | undefined;
  setHeadingFormProps: Dispatch<SetStateAction<HeadingformProps | undefined>>;
  subheadingFormProps: SubheadingformProps | undefined;
  setSubheadingFormProps: Dispatch<SetStateAction<SubheadingformProps | undefined>>;
  formType: "HEAD" | "SUBHEAD" | undefined;
  setFormType: Dispatch<SetStateAction<"HEAD" | "SUBHEAD" | undefined>>;
}

const SyllabusContext = createContext<State>({} as State);

//This is for providing contenxt, i,e context provider
export function SyllabusContextProviderWrapper({ children }: { children: ReactNode }) {
  const [headingFormProps, setHeadingFormProps] = useState<HeadingformProps | undefined>(undefined);
  const [subheadingFormProps, setSubheadingFormProps] = useState<SubheadingformProps | undefined>(undefined);
  const [formType, setFormType] = useState<"HEAD" | "SUBHEAD" | undefined>(undefined);

  let sharedState: State = {
    /* whatever you want */
    headingFormProps,
    setHeadingFormProps,
    subheadingFormProps,
    setSubheadingFormProps,
    formType,
    setFormType,
  };
  //return provider
  return <SyllabusContext.Provider value={sharedState}>{children}</SyllabusContext.Provider>;
}

//This is for consumer
export function useSyllabusContext() {
  return useContext(SyllabusContext);
}
