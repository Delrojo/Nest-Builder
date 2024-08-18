import { ComponentStyleConfig } from "@chakra-ui/react";

export const Checkbox: ComponentStyleConfig = {
  baseStyle: (props) => ({
    control: {
      height: "1rem",
      width: "1rem",
      borderColor: "primary.500",
      _checked: {
        bg: "primary.500",
        borderColor: "primary.500",
        color: "white",
        _hover: {
          bg: "primary.400",
          borderColor: "primary.400",
        },
      },
      _hover: {
        borderColor: "primary.400",
      },
    },
    label: {
      color: props.colorMode === "dark" ? "text.dark" : "text.light",
    },
  }),
};
