import { extendTheme } from "@chakra-ui/react";

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
    global: {
      // styles for the `body`
      body: {
        // bg: "gray.400",
        // color: "white",
      },
      // styles for the `a`
      a: {
        color: "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  components: {
    Button: {
      // 1. We can update the base styles
      baseStyle: {
        fontWeight: "bold", // Normally, it is "semibold"
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        xl: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      // 3. We can add a new visual variant
      variants: {
        "with-shadow": {
          bg: "red.400",
          boxShadow: "0 0 2px 2px #efdfde",
        },
        // 4. We can override existing variants
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "red.300" : "red.500",
        }),
      },
    },
  },
});
