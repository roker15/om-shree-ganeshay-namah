import { extendTheme } from "@chakra-ui/react";
import { buttons } from "./components/buttons";
import { globalStyles } from "./globalStyles";
import { selects } from "./components/selects";
import { radio } from "./components/radio";
import { colors } from "./colors";

// theme.js
export const theme = extendTheme({
  // defultProps: {
  //   colorScheme: "#ffb193",
  // },
  colors: {
    brand: colors.brand,
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
