import { extendTheme } from "@chakra-ui/react";
import { Button } from "./components/button";
import spacing from "./spacing";
import layout from "./layout";
import { Icon } from "./components/icon";
import { Modal } from "./components/modal";
import { Toast } from "./components/toast";
import { Stepper } from "./components/stepper";
import colors from "./brand_colors";
import { Input } from "./components/input";
import { Checkbox } from "./components/checkbox";

const styles = {
  global: (props: { colorMode: string }) => ({
    body: {
      bg:
        props.colorMode === "dark"
          ? colors.background.dark
          : colors.background.light,
      color: props.colorMode === "dark" ? colors.text.dark : colors.text.light,
      fontFamily: `'Product Sans', sans-serif`,
    },
  }),
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors,
  spacing,
  layout,
  styles,
  fonts: {
    heading: `'Product Sans', sans-serif`,
    body: `'Product Sans', sans-serif`,
  },
  fontSizes: {
    h1: "2.5rem", // Hero sections
    h2: "2rem", // Section headings
    h3: "1.5rem", // Subcategories
    bodyLarge: "1rem",
    bodyMedium: "0.875rem",
    bodySmall: "0.75rem",
  },
  lineHeights: {
    heading: "1.2",
    body: "1.5",
  },
  letterSpacings: {
    normal: "0",
  },
  sizes: {
    iconSize: "1.5rem",
  },
  components: {
    Button,
    Icon,
    Modal,
    Toast,
    Stepper,
    Input,
    Checkbox,
  },
});
