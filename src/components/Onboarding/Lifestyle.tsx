import React, { useState } from "react";
import {
  Button,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Define the button type
type PreferenceButton = {
  text: string;
  isActive: boolean;
};

const Lifestyle: React.FC = () => {
  const [preferences, setPreferences] = useState<PreferenceButton[]>([
    { text: "Family-Friendly", isActive: false },
    { text: "Cost-Effective", isActive: false },
    { text: "Pet-Friendly", isActive: false },
    { text: "Gym Access", isActive: false },
    { text: "Public Transport", isActive: false },
    { text: "Green Spaces", isActive: false },
    { text: "Nightlife", isActive: false },
  ]);
  const [newPreference, setNewPreference] = useState<string>("");

  const togglePreference = (index: number) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index].isActive = !updatedPreferences[index].isActive;
    setPreferences(updatedPreferences);
  };

  const addPreference = () => {
    if (newPreference.trim() === "") return;
    setPreferences([
      ...preferences,
      { text: newPreference.trim(), isActive: false },
    ]);
    setNewPreference("");
  };

  return (
    <VStack w="full" align="stretch">
      <Flex direction="column" align="center">
        <Heading as="h1" mt={4} textAlign="center" size="lg">
          What is important to you?
        </Heading>
        <Text fontSize="md" mt={2} mb={4} textAlign="center">
          We use these preferences to help you find the best places to live, so
          please select at least 3. You can change these later!
        </Text>
      </Flex>

      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap={4}
        p={12}
      >
        {preferences.map((preference, index) => (
          <GridItem key={index}>
            <Button
              onClick={() => togglePreference(index)}
              variant={preference.isActive ? "solid" : "outline"}
            >
              {preference.text}
            </Button>
          </GridItem>
        ))}
        <GridItem>
          <InputGroup>
            <Input
              placeholder="Add Preference"
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              color={"primary.500"}
              width={"full"}
              height={"full"}
            />
            <InputRightElement>
              <IconButton
                icon={<AddIcon />}
                variant="ghost"
                color="gray.500"
                onClick={addPreference}
                aria-label="Add Preference"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </GridItem>
      </Grid>
    </VStack>
  );
};

export default Lifestyle;
