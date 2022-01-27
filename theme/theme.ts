import { extendTheme } from "@chakra-ui/react";
import { buttons } from "./components/buttons";
import { globalStyles } from "./globalStyles";
import { selects } from "./components/selects";

// theme.js
export const theme = extendTheme({
  defultProps: {
    colorScheme: "#ffb193",
  },
  colors: {
    brand: {
      primary: "#ffbb93",
      secondary: "#153e75",
      700: "#2a69ac",
    },
  },
  styles: {
    global: globalStyles,
  },
  components: {
    Button: buttons,
    Select: selects,
    
  },
});
