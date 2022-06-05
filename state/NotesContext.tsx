import React, { useContext, createContext } from 'react';

interface contextTypes {
  
    // ...
}

// private to this file
const DisplayContext = createContext<contextTypes | null>(null);

// Used by any component that needs the value, it returns a non-nullable contextTypes
export function useDisplay() {
  const display = useContext(DisplayContext);
  if (display == null) {
    throw Error("useDisplay requires DisplayProvider to be used higher in the component tree");
  }
  return display;
}

// Used to set the value. The cast is so the caller cannot set it to null,
// because I don't expect them ever to do that.
export const DisplayProvider: React.Provider<contextTypes> = DisplayContext.Provider as any;