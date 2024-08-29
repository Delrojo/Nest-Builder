import { SettingsIcon } from "@chakra-ui/icons";
import {
  AccordionItem,
  AccordionButton,
  Box,
  Flex,
  Heading,
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
  const buttonBg = useColorModeValue("gray.200", "primary.800");
  const buttonColor = useColorModeValue("primary.500", "primary.400");

  const OnCategoryClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    alert("HELLO");
  };

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
          <Box
            onClick={OnCategoryClick}
            aria-label="Settings"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={"2.5rem"}
            h={"2.5rem"}
            borderRadius={"full"}
            color={buttonColor}
            cursor="pointer"
            _hover={{
              bg: buttonBg,
            }}
          >
            <SettingsIcon />
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Box overflowX="scroll" whiteSpace="nowrap" p={2}>
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
