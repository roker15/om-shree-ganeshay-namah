import { extendTheme } from "@chakra-ui/react";
import { buttons } from "./components/buttons";
import { globalStyles } from "./globalStyles";

// theme.js
export const theme = extendTheme({
  colors: {
    brand: {
      900: "#1a09b3",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  styles: {
    global: globalStyles,
  },
  components: {
    Button: buttons,
  },
});
