import {
  Box,
  Card,
  Checkbox,
  Flex,
  Heading,
  Text,
  Stack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

type TransportationProps = {};

const Transportation: React.FC<TransportationProps> = () => {
  const bgColor = useColorModeValue("primary.100", "primary.800");
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        How do you like to get around?
      </Heading>
      <Text fontSize="md" mt={2} mb={4} textAlign="center">
        Select the transportation methods you most use and how far you&apos;re
        willing to travel with each method.
      </Text>
      <Flex
        direction={{ base: "column", lg: "row" }}
        wrap="wrap"
        gap={4}
        mt={8}
        maxWidth="75rem"
        width="100%"
        alignContent="center"
        justify="center"
      >
        <Card
          size="sm"
          flex="1"
          minWidth={{ base: "100%", md: "48%" }}
          maxWidth="500px"
          p={6}
          borderRadius="md"
          bg={bgColor}
        >
          <Heading as="h2" size="md" textAlign="start">
            Transportation Methods
          </Heading>
          <Text fontSize="sm" mt={1} textAlign="start">
            We&apos;ll use this information to help find you the best places to
            visit.
          </Text>
          <Stack spacing={4} mt={4}>
            {["Walking", "Biking", "Driving", "Bus", "Train"].map((method) => (
              <Flex key={method} direction="row" align="center" gap={2}>
                <Checkbox>{method}</Checkbox>
                <Slider
                  aria-label="slider-ex-2"
                  colorScheme={"primary.500"}
                  defaultValue={30}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text>miles</Text>
              </Flex>
            ))}
          </Stack>
        </Card>

        <Card
          mt={{ base: 4, md: 0 }}
          flex="1"
          minWidth={{ base: "100%", md: "48%" }}
          maxWidth="500px"
          p={6}
          borderRadius="md"
          bg={bgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg={cardBg}
            borderRadius="md"
            width="100%"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="md"
          >
            Map will go here
          </Box>
        </Card>
      </Flex>
    </Flex>
  );
};

export default Transportation;
