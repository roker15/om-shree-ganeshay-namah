import { darken, mode, StyleFunctionProps, whiten } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const radio = {
  baseStyle: {
    // fontWeight: "semibold", // Normally, it is "semibold"
    // bg: "brand.100",
    // _hover: {
    //   bg: "brand.200",
    // },
  },
  // 2. We can add a new button size or extend existing
  // sizes: {
  //   sm: {
  //     h: "32px",
  //     fontSize: "sm",
  //     px: "16px",
  //   },
  // },

  // 6. We can overwrite defaultProps
  defaultProps: {
    size: "sm", // default is md
    colorScheme: "brand", // default is gray
  },
};
