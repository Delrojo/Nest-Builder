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
import { onboardingProfileAtom } from "@/atoms/onboardingProfileAtom";
import { useRecoilState } from "recoil";
import { snakeCaseToTitleCase } from "@/utils/functions/introFunctions";
import { LifestyleDTO } from "@/atoms/onboardingProfileAtom";

const Lifestyle: React.FC = () => {
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
  const [preferences, setPreferences] = useState<LifestyleDTO>(
    onboardingProfile.lifestyle_traits || {}
  );
  const [newPreference, setNewPreference] = useState<string>("");

  const togglePreference = (key: string) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [key]: !prevPreferences[key],
    }));
  };

  const addPreference = () => {
    if (newPreference.trim() === "") return;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [newPreference.trim()]: true,
    }));
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
        {Object.entries(preferences).map(([key, isActive]) => (
          <GridItem key={key}>
            <Button
              onClick={() => togglePreference(key)}
              variant={isActive ? "solid" : "outline"}
            >
              {snakeCaseToTitleCase(key)}
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
            <InputRightElement top="3px" right="3px">
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
