// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { extendTheme, theme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { colors } from "../colors";

// import theme from "../foundations/borders";

const buttons = {
  // parts: ["label", "icon"],
  // 1. We can update the base styles
  baseStyle: {
    // label: {
    //   color: "red",
    //   fontWeight: "semibold", // Normally, it is "semibold"
    // },
    // icon: {
    //   color: "blue",
    //   fontWeight: "semibold", // Normally, it is "semibold"
    // },
  },
  // 2. We can add a new button size or extend existing
  sizes: {
    xl: {
      icon: {
        // h: "56px",
        fontSize: "lg",
        // px: "32px",
      },
      label: {
        // h: "56px",
        fontSize: "lg",
        // px: "32px",
      },
    },
  },
  // 3. We can add a new visual variant
  // variants: {
  //   "with-shadow": {
  //     bg: "red.400",
  //     boxShadow: "0 0 2px 2px #efdfde",
  //   },
  //   // 4. We can override existing variants
  //   // solid: (props: StyleFunctionProps) => ({
  //   //   bg: props.colorMode === "dark" ? "red.300" : "red.500",
  //   // }),
  //   // 5. We can add responsive variants
  //   // sm: {
  //   //   bg: "red.500",
  //   //   fontSize: "lg",
  //   // },
  // },
  // 6. We can overwrite defaultProps
  defaultProps: {
    size: "xl", // default is md
    // variant: "outline", // default is solid
    colorScheme: "brand", // default is gray
  },
};
//   },
// });

export default buttons;
