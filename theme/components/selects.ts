import { color } from "@chakra-ui/react";
import { mode, darken, whiten } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const selects = {
  parts: ["field", "icon"],
  baseStyle: {
    field: {
      bg: colors.brand.primary,
      h: "102px",
      fontSize: "xl",
      px: "16px",
      appearance: "none",
      paddingBottom: "1px",
      lineHeight: "xl",
      "> option, > optgroup": {
        bg: "white",
        _hover: {
          bg: "red.100",
        },
      },
      _hover: {
        bg: colors.brand.secondary,
      },
    },
    // icon: {
    //   bg: "blue.50",
    //   color: "blue.500",
    // },
  },
  // 2. We can add a new button size or extend existing
  sizes: {
    sm: {
      field: { h: "32px", fontSize: "sm", px: "16px", fontWeight: "semibold",},
    },
  },
  // 3. We can add a new visual variant
  variants: {
    light: {
      field: {
        bg: "blue.800",
        boxShadow: "0 0 2px 2px #efdfde",
      },
    },
    variant1: (props: any) => ({
      bg: "#00008B",
      color: "white",
      _hover: {
        bg: mode(darken("#00008B", -20), whiten("#00008B", 20))(props),
        boxShadow: "md",
      },
    }),
    variantoutline: (props: any) => ({
      bg: "transparent",
      border: "1px solid",
      borderColor: "#00008B",
      color: "#00008B",
      size: "sm",
      transition: "transform .2s",
      _hover: {
        boxShadow: "md",
        transform: "scale(1.2)",
      },
    }),
    // 4. We can override existing variants
    solid: (props: any) => ({
      bg: props.colorMode === "dark" ? "red.300" : "red.500",
    }),
  },
};
