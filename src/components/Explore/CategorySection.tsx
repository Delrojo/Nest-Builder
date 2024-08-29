import { SettingsIcon } from "@chakra-ui/icons";
import {
  AccordionItem,
  AccordionButton,
  Box,
  Flex,
  Heading,
  IconButton,
  AccordionIcon,
  AccordionPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import ExploreCard from "./ExploreCard";
import { PlacesModel } from "./ExploreCard";

type CategorySectionProps = {
  results: PlacesModel[];
  title: string;
};

const CategorySection: React.FC<CategorySectionProps> = ({
  results,
  title,
}) => {
  const hoverBg = useColorModeValue("gray.100", "primary.200");

  return (
    <AccordionItem>
      <h2>
        <AccordionButton
          _hover={{
            bg: hoverBg,
          }}
        >
          <Box as="span" flex="1" textAlign="left">
            <Heading as="h1" size="lg">
              {title}
            </Heading>
          </Box>
          <IconButton
            icon={<SettingsIcon />}
            onClick={(e) => {
              e.preventDefault();
              alert("HELLO");
            }}
            aria-label="Settings"
            variant={"ghost"}
            w={"fit-content"}
            h={"2.5rem"}
          />
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Box overflowX="scroll" whiteSpace="nowrap" p={4}>
          <Flex>
            {results.map((result, index) => (
              <Box key={index} display="inline-block" mr={4}>
                <ExploreCard place={result} />
              </Box>
            ))}
          </Flex>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
export default CategorySection;
