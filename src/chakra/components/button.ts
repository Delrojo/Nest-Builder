import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "md",
    width: "100%",
  },
  sizes: {
    lg: {
      h: "14",
      fontSize: "lg",
    },
    md: {
      h: "12",
      fontSize: "md",
    },
    sm: {
      h: "10",
      fontSize: "sm",
    },
  },
  variants: {
    solid: (props) => ({
      bg: "primary.500",
      color: "text.dark",
      _hover: {
        bg: props.colorMode === "dark" ? "primary.400" : "primary.600",
      },
      _active: {
        bg: "primary.700",
      },
      _focus: {
        boxShadow: `0 0 0 3px ${
          props.colorMode === "dark"
            ? "rgba(67, 160, 71, 0.5)"
            : "rgba(46, 125, 50, 0.5)"
        }`,
      },
    }),
    outline: (props) => ({
      borderColor: "primary.500",
      color: props.colorMode === "dark" ? "text.dark" : "primary.500",
      _hover: {
        bg: props.colorMode === "dark" ? "primary.800" : "primary.100",
      },
      _active: {
        bg: "secondary.500",
      },
      _focus: {
        boxShadow: `0 0 0 3px ${
          props.colorMode === "dark"
            ? "rgba(67, 160, 71, 0.5)"
            : "rgba(46, 125, 50, 0.5)"
        }`,
      },
    }),
    ghost: (props) => ({
      color: props.colorMode === "light" ? "primary.500" : "primary.400",
      bg: "transparent",
      _hover: {
        color: props.colorMode === "light" ? "primary.500" : "primary.400",
        bg:
          props.colorMode === "light"
            ? "rgba(99, 167, 87, 0.2)"
            : "rgba(68, 116, 66, 0.2)",
      },
      _active: {
        bg: "transparent",
      },
    }),
  },
};

export default Button;
