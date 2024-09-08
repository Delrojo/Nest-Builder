import { onboardingProfileAtom } from "@/atoms/onboardingProfileAtom";
import { userAtom } from "@/atoms/userAtom";
import { getAge, snakeCaseToTitleCase } from "@/utils/functions/introFunctions";
import {
  Box,
  Text,
  Tag,
  VStack,
  Divider,
  Input,
  useColorModeValue,
  Flex,
  Textarea,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import React, { useEffect } from "react";

const ReviewInformation: React.FC = () => {
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
  const [userState] = useRecoilState(userAtom);
  const cardBg = useColorModeValue("primary.100", "primary.800");
  const tagBg = useColorModeValue("primary.700", "primary.500");

  const router = useRouter();

  useEffect(() => {
    // Redirect to home if userState is not loaded
    if (!userState.user) {
      router.push("/");
    }
  }, [userState, router]);

  // Return null or a loading spinner if the data isn't loaded yet
  if (!userState.user || !onboardingProfile) {
    return null; // or a loading spinner
  }

  const handleOnRoutineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOnboardingProfile((prev) => ({
      ...prev,
      lifestyle_paragraph: e.target.value,
    }));
  };

  const handleAdditionalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOnboardingProfile((prev) => ({
      ...prev,
      additional_info: e.target.value,
    }));
  };

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Review Information
      </Heading>
      <Text fontSize="md" mt={2} mb={4} textAlign="start">
        Hey, {userState.user?.name}! This is what Nested has learned from your
        answers and Google takeout data. Is this correct?
      </Text>
      <Box
        background={cardBg}
        p={5}
        borderRadius="lg"
        boxShadow="md"
        maxWidth="50rem"
        mx="auto"
        mt={5}
      >
        <VStack spacing={4} align="stretch">
          <Text>
            I am {getAge(onboardingProfile.birthday)} year old{" "}
            {onboardingProfile.gender}, and I moved/am moving to{" "}
            {onboardingProfile.home_address}. I prefer to travel by{" "}
            {onboardingProfile.transportations
              ? Object.entries(onboardingProfile.transportations)
                  .filter(([_, { selected }]) => selected)
                  .map(([mode, { radius }]) => `${mode} (${radius} miles)`)
                  .join(" and ")
              : "Loading..."}
            .
          </Text>

          <Divider my={1} />

          <Text fontSize="md" mt={1} textAlign="start">
            I have the following routines and preferences in my locations:
          </Text>
          <Textarea
            fontSize={"md"}
            value={onboardingProfile.lifestyle_paragraph || ""}
            onChange={handleOnRoutineChange}
          />
          <Divider my={1} />

          <Text>
            When deciding on the places I go frequently, I care about the
            following priorities:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {onboardingProfile.lifestyle_traits
              ? Object.keys(onboardingProfile.lifestyle_traits)
                  .filter((trait) => onboardingProfile.lifestyle_traits[trait])
                  .map((pref) => (
                    <Tag size="md" variant="solid" bg={tagBg} key={pref}>
                      {snakeCaseToTitleCase(pref)}
                    </Tag>
                  ))
              : "Loading..."}
          </Flex>

          <Divider my={1} />

          <FormControl>
            <FormLabel>Additional Comments</FormLabel>
            <Input
              variant="ghost"
              placeholder="e.g., Any specific requirements or notes"
              size="md"
              value={onboardingProfile.additional_info || ""}
              onChange={handleAdditionalInfoChange}
            />
          </FormControl>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ReviewInformation;
