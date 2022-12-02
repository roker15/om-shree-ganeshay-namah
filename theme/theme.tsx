import { extendTheme } from "@chakra-ui/react";

import { globalStyles } from "./globalStyles";
import { selects } from "./components/selects";
import { radio } from "./components/radio";
import { colors } from "./colors";
import buttons from "./components/buttons";
import checkbox from "./components/checkbox";


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
    Checkbox: checkbox,
    Radio: radio,
  },
});
