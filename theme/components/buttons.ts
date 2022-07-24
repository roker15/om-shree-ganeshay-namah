import { darken, mode, StyleFunctionProps, whiten } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const buttons = {
  baseStyle: {
    // fontWeight: "semibold", // Normally, it is "semibold"
    // bg: "brand.100",
    // _hover: {
    //   bg: "brand.200",
    // },
  },
  // 2. We can add a new button size or extend existing
  sizes: {
    sm: {
      h: "32px",
      fontSize: "sm",
      px: "16px",
    },
  },
  // 3. We can add a new visual variant
  variants: {
    "with-shadow": {
      // bg: "red.400",
      boxShadow: "0 0 2px 2px #efdfde",
      colorScheme: "brand",
    },
    variant1: (props: StyleFunctionProps) => ({
      // bg: "red.300",
      border: "1px solid",
      borderColor: "red.300",
      color: props.colorMode === "dark" ? "" : "gray",
      _hover: {
        bg: props.colorMode === "dark" ? "red.300" : "red.500",
        boxShadow: "md",
      },
    }),
    icong: (props: any) => ({
      // bg: "brand.500",
      // border: "1px solid",
      // borderColor: "#00008B",
      color: "gray.500",
      size: "sm",
      transition: "transform .2s",
      _hover: {
        // color: "gray.800",
        // bg: "gray.100",
        boxShadow: "md",
        // transform: "scale(1.15)",
      },
    }),

    // 4. We can override existing variants
    ghost: (props: any) => ({
      transition: "transform .2s",
      // color: "gray.100",
      // bg: "gray.100",
      _hover: {
        // bg: props.colorMode === "dark" ? "red.300" : "red.500",
        // color: "gray.800",
        // transform: "scale(1.5)",
      },
    }),
  },
    // 4. We can override existing variants
    outline: (props: any) => ({
      transition: "transform .2s",
      color: "gray.500",
      bg: "gray.100",
      _hover: {
        bg: props.colorMode === "dark" ? "red.300" : "red.500",
        color: "gray.800",
        transform: "scale(1.5)",
      },
    }),
  
  // 6. We can overwrite defaultProps
  defaultProps: {
    // size: "xs", // default is md
    // colorScheme: "brand", // default is gray
    // variant: "outline",
  },
};
