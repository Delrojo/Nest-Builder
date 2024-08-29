import { ComponentStyleConfig } from "@chakra-ui/react";

export const Input: ComponentStyleConfig = {
  baseStyle: (props) => ({
    field: {
      borderRadius: "md",
      color: props.colorMode === "dark" ? "text.dark" : "text.light",
      padding: "0.75rem 1.5rem",
      _placeholder: {
        color: props.colorMode === "dark" ? "gray.400" : "gray.600",
      },
    },
  }),
  sizes: {
    lg: {
      field: {
        padding: 0,
        paddingLeft: "2.5rem",
      },
    },
  },
  variants: {
    outline: (props) => ({
      field: {
        borderWidth: "1px",
        borderColor:
          props.colorMode === "dark" ? "border.inactive" : "gray.300",
        bg: "transparent",
        color: props.colorMode === "dark" ? "text.dark" : "text.light",
        _hover: {
          borderColor:
            props.colorMode === "dark" ? "primary.700" : "primary.400",
          color: props.colorMode === "dark" ? "text.dark" : "text.light",
        },
        _focus: {
          borderColor:
            props.colorMode === "dark" ? "primary.700" : "primary.400",
          boxShadow: `0 0 0 1px primary.500`,
          color: props.colorMode === "dark" ? "text.dark" : "text.light",
        },
        _focusVisible: {
          borderColor:
            props.colorMode === "dark" ? "primary.700" : "primary.400",
          boxShadow: `0 0 0 1px primary.500`,
          color: props.colorMode === "dark" ? "text.dark" : "text.light",
        },
        _placeholder: {
          color: props.colorMode === "dark" ? "border.inactive" : "gray.300",
        },
      },
    }),
    filled: (props) => ({
      field: {
        bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
        borderColor: "transparent",
        color: props.colorMode === "dark" ? "text.dark" : "text.light",
        _hover: {
          bg: props.colorMode === "dark" ? "gray.600" : "gray.200",
        },
        _focus: {
          bg: props.colorMode === "dark" ? "gray.600" : "gray.200",
          borderColor:
            props.colorMode === "dark" ? "primary.700" : "primary.400",
          boxShadow: `0 0 0 1px primary.500`,
        },
        _placeholder: {
          color: props.colorMode === "dark" ? "gray.400" : "gray.600",
        },
      },
    }),
    ghost: (props) => ({
      field: {
        bg: "transparent",
        borderColor: "transparent",
        color: props.colorMode === "dark" ? "text.dark" : "text.light",
        _hover: {
          bg:
            props.colorMode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
        },
        _focus: {
          borderColor:
            props.colorMode === "dark" ? "primary.700" : "primary.400",
          boxShadow: `0 0 0 1px primary.500`,
        },
        _placeholder: {
          color: props.colorMode === "dark" ? "gray.400" : "gray.600",
        },
        _focusVisible: {
          bg:
            props.colorMode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
    }),
  },
  defaultProps: {
    variant: "outline",
    size: "md",
  },
};

export default Input;
