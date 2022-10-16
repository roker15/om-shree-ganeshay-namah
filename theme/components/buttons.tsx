// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { colors } from "../colors";

// import theme from "../foundations/borders";

const buttons = {
  // 1. We can update the base styles
  baseStyle: {
    fontWeight: "semibold", // Normally, it is "semibold"
  },
  // 2. We can add a new button size or extend existing
  sizes: {
    xs: {
      // h: "18px",
      // fontSize: "8px",
      // px: "4px",
    },
  },
  // 3. We can add a new visual variant
  variants: {
    "with-shadow": {
      bg: "red.400",
      boxShadow: "0 0 2px 2px #efdfde",
    },
    // 4. We can override existing variants
    // solid: (props: StyleFunctionProps) => ({
    //   bg: props.colorMode === "dark" ? "red.300" : "red.500",
    // }),
    // 5. We can add responsive variants
    sm: {
      bg: "red.500",
      fontSize: "lg",
    },
  },
  // 6. We can overwrite defaultProps
  defaultProps: {
    size: "sm", // default is md
    variant: "sm", // default is solid
    colorScheme: colors.colorSchemePrimary, // default is gray
  },
};
//   },
// });

export default buttons;
