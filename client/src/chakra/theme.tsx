import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

const colors = {
  green: {
    50: "#F0F6EE",
    100: "#D4E7D0",
    200: "#B8D7B2",
    300: "#9CC793",
    400: "#80B875",
    500: "#64A857",
    600: "#2E7D32",
    700: "#276B2B",
    800: "#1F5823",
    900: "#132211",
  },
  red: {
    50: "#FAEDEA",
    100: "#F2CCC5",
    200: "#E9AB9F",
    300: "#E18A7A",
    400: "#D96954",
    500: "#D0482F",
    600: "#A73A25",
    700: "#7D2B1C",
    800: "#531D13",
    900: "#2A0E09",
  },
  orange: {
    50: "#FCF7E8",
    100: "#F7E7BF",
    200: "#F2D896",
    300: "#EDC96D",
    400: "#E9BA44",
    500: "#E4AA1B",
    600: "#B68816",
    700: "#896610",
    800: "#5B440B",
    900: "#2E2205",
  },
  teal: {
    50: "#ECF8F8",
    100: "#CAECEC",
    200: "#A8E0E0",
    300: "#86D4D4",
    400: "#64C8C8",
    500: "#43BCBC",
    600: "#359797",
    700: "#287171",
    800: "#1B4B4B",
    900: "#0D2626",
  },
  blue: {
    50: "#EAF0FB",
    100: "#C3D5F3",
    200: "#9DBAEC",
    300: "#76A0E5",
    400: "#5085DD",
    500: "#296AD6",
    600: "#2155AB",
    700: "#194080",
    800: "#112A55",
    900: "#08152B",
  },
  gray: {
    50: "#f9faf6",
    100: "#f2f2f2",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  yellow: {
    50: "#FDF6E8",
    100: "#F8E5BE",
    200: "#F4D595",
    300: "#EFC56C",
    400: "#EBB442",
    500: "#E6A419",
    600: "#B88314",
    700: "#8A620F",
    800: "#5C410A",
    900: "#2E2105",
  },
  brand: {
    50: "#e7f5ff",
    100: "#d0ebff",
    200: "#a5d8ff",
    300: "#74c0fc",
    400: "#4dabf7",
    500: "#339af0",
    600: "#228be6",
    700: "#1c7ed6",
    800: "#1971c2",
    900: "#1864ab",
  },
};

const fonts = {
  body: "Product Sans, sans-serif",
  heading: "Product Sans, sans-serif",
};

const styles = {
  global: {
    body: {
      bg: "gray.100",
    },
  },
};

export const theme = extendTheme({
  colors,
  fonts,
  styles,
  components: {
    Button,
  },
});
