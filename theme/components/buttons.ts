import { darken, mode, whiten } from "@chakra-ui/theme-tools";

export const buttons = {
  baseStyle: {
    fontWeight: "semibold", // Normally, it is "semibold"
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
      bg: "red.400",
      boxShadow: "0 0 2px 2px #efdfde",
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
      size:"sm",
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
