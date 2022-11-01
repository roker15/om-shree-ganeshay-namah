import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

export function createCtx<A>(defaultValue: A) {
  type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
  const defaultUpdate: UpdateType = () => defaultValue;
  const ctx = createContext({
    state: defaultValue,
    update: defaultUpdate,
  });

  function Provider(props: PropsWithChildren<{}>) {
    const [state, update] = useState(defaultValue);
    return <ctx.Provider value={{ state, update }} {...props} />;
  }
  return [ctx, Provider] as const; // alternatively, [typeof ctx, typeof Provider]
}

// usage
import { useContext } from "react";

type StateType = { hi: number; hello: number; gero: string };
const state: StateType = { hi: 2, hello: 4, gero: "number" };
const [ctx, TextProvider] = createCtx(state);
export const TextContext = ctx;
export function App() {
  return (
    <TextProvider>
      <Component />
    </TextProvider>
  );
}
export function Component() {
  const { state, update } = useContext(TextContext);
  return (
    <label>
      {state.hi}
      <input type="text" onChange={(e) => update({ ...state, hi: 2 })} />
    </label>
  );
}
