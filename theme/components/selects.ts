import { color } from "@chakra-ui/react";
import { mode, darken, whiten } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const selects = {
  parts: ["field", "icon"],
  baseStyle: {
    field: {
      // bg: "brand.50",
      // color:"red",
      px: "1000px",
      // border: "4px solid",
      _hover: {
        // bg: "blue.100",
      },
    },
    icon: {
      // bg: "brand.500",
      color: "brand.300",
      _hover: {
        bg: "brand.600",
      },
    },
  },

  sizes: {
    sm: {
      field: { h: "32px", fontSize: "sm", px: "16px", fontWeight: "semibold" },
    },
  },
  // 3. We can add a new visual variant
  variants: {
    light: {
      field: {
        // bg: "blue.800",
        // boxShadow: "0 0 2px 2px #efdfde",
        // _hover: {
        //   bg: "blue.100",
        //   boxShadow: "md",
        // },
      },
    },
    filled: (props: any) => ({
      field: {
        bg: "brand.50",
        borderRadius: "full",
        // color: "white",
        _hover: {
          bg: mode(darken("#00008B", -20), whiten("#00008B", 20))(props),
          // color: "blue",
          // boxShadow: "md",
        },
      },
    }),
    outline: (props: any) => ({
      field: {
        bg: "transparent",
        borderRadius: "full",
        border: "1px solid",
        borderColor: "brand.500",
        // color: "brand.800",
        size: "sm",
        transition: "transform .2s",
        _hover: {
          // boxShadow: "md",
          transform: "scale(1.002)",
        },
      },
    }),
  },
  defaultProps: {
    focusBorderColor: "red.100",
    variant: "outline",
    size: "md",
  },

  // },
};
