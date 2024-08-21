import React from "react";
import {
  SimpleGrid,
  Box,
  Heading,
  Button,
  Input,
  IconButton,
} from "@chakra-ui/react";
import ColorTestDisplay from "./DemoProfileColors";

const ComponentStylesGrid: React.FC = () => {
  return (
    <SimpleGrid columns={[2, null, 3]} spacing={10}>
      <Box>
        <Heading size="sm">Buttons</Heading>
        <Button variant={"ghost"}>Ghost Variant</Button>
        <Button variant={"outline"}>Outline Variant</Button>
        <Button variant={"solid"}>Solid Variant</Button>
        <IconButton aria-label="Example Icon Button" icon={<Box />} />
      </Box>
      <Box>
        <Heading size="sm">Colors</Heading>
        <ColorTestDisplay />
      </Box>
      <Box>
        <Heading size="sm">Stepper</Heading>
      </Box>
      <Box>
        <Heading size="sm">Input</Heading>
        <Input variant={"filled"} placeholder="Filled Variant" />
      </Box>
    </SimpleGrid>
  );
};

export default ComponentStylesGrid;
