import { extendTheme } from "@chakra-ui/react";

import { globalStyles } from "./globalStyles";
import { selects } from "./components/selects";
import { radio } from "./components/radio";
import { colors } from "./colors";
import buttons from "./components/buttons";


// theme.js
export const theme = extendTheme({
  // defultProps: {
  //   colorScheme: "#ffb193",
  // },
  colors: {
    brand: colors.brand,
    error: colors.error,
  },
  styles: {
    global: globalStyles,
  },
  components: {
    Button: buttons,
    Select: selects,
    // Radio: radio
  },
});
