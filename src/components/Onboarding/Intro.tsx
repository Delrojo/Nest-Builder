import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  Input,
  FormControl,
  FormLabel,
  Flex,
  useDisclosure,
  Icon,
  VStack,
  useColorModeValue,
  HStack,
  Heading,
  Tooltip,
  SimpleGrid,
  Card,
  Spinner,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  InfoOutlineIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { FaCar, FaListAlt, FaTags } from "react-icons/fa";
import StepNavigation from "./TakeoutStepNavigation";
import { isAuthenticToken, userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import GoogleDriveButton from "./GoogleDriveButton";
import {
  findMostCompleteBirthday,
  findMostCompleteGender,
  formatBirthday,
  GenderDTO,
} from "@/utils/functions/introFunctions";
import { BirthdayDTO } from "@/utils/functions/introFunctions";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/hooks/useAuth";
import { onboardingProfileAtom } from "@/atoms/onboardingProfileAtom";
import {
  createTransportationInstruction,
  createLifestylePreferencesInstruction,
  createCategoriesInstruction,
} from "@/utils/functions/uploadFunctions";
import {
  fetchCategories,
  fetchProfile,
  updatePredictedCategories,
  updateLifestyle,
  updateTransportation,
} from "@/utils/functions/onboardingDBFunctions";
import { categoryAtom } from "@/atoms/categoryAtom";

interface PeopleInfo {
  genders: GenderDTO[];
  birthdays: BirthdayDTO[];
}

const IntroPage = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
  const [_, setCategoryAtom] = useRecoilState(categoryAtom);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [sectionStatus, setSectionStatus] = useState({
    transportation: "neutral",
    lifestyle: "neutral",
    categories: "neutral",
  });
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userState, setUserState] = useRecoilState(userAtom);
  const { logOut } = useAuth();
  const router = useRouter();

  const cardBg = useColorModeValue("primary.100", "primary.800");

  const handleBirthdayChange = (e: { target: { value: string } }) => {
    const newBirthday = e.target.value;
    setBirthday(newBirthday);
    setOnboardingProfile((prevProfile) => ({
      ...prevProfile,
      birthday: newBirthday,
    }));
  };
  const handleGenderChange = (e: { target: { value: string } }) => {
    const newGender = e.target.value;
    setGender(newGender);
    setOnboardingProfile((prevProfile) => ({
      ...prevProfile,
      gender: newGender,
    }));
  };

  const extractUserInfo = useCallback(
    (data: PeopleInfo) => {
      const birthday = findMostCompleteBirthday(data.birthdays);
      const gender = findMostCompleteGender(data.genders);

      if (birthday) {
        const formattedBirthday = formatBirthday(birthday);
        setBirthday(formattedBirthday);
        setOnboardingProfile((prevProfile) => ({
          ...prevProfile,
          birthday: formattedBirthday,
        }));
      }

      if (gender?.formattedValue) {
        setGender(gender.formattedValue);
        setOnboardingProfile((prevProfile) => ({
          ...prevProfile,
          gender: gender.formattedValue || "",
        }));
      }
    },
    [setBirthday, setOnboardingProfile, setGender]
  );

  const getPeopleInfo = useCallback(
    async (token: string) => {
      console.log("Making API call to fetch extra user information");
      const response = await fetch(
        `/api/fetchExtraUserInformation?token=${token}`
      );

      if (response.ok) {
        const data = await response.json();
        extractUserInfo(data);
      } else {
        console.error("Failed to fetch people info");
      }
    },
    [extractUserInfo]
  );

  useEffect(() => {
    if (onboardingProfile.birthday && onboardingProfile.gender) {
      setBirthday(onboardingProfile.birthday || "");
      setGender(onboardingProfile.gender || "");
    } else {
      const token = userState.user?.googleAuthToken;

      if (
        (token && isAuthenticToken(token)) ||
        token === "FirebaseAuthEmulatorFakeAccessToken_google.com"
      ) {
        getPeopleInfo(token);
      } else {
        logOut();
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingProfile, userState.user]);

  const handleUpload = async (fileUri: string, fileName: string) => {
    setIsUploading(true);

    const sectionNames = ["transportation", "lifestyle", "categories"];

    const apiCallPromises = sectionNames.map(async (section) => {
      console.log(`Processing section: ${section}`);

      setSectionStatus((prevStatus) => ({
        ...prevStatus,
        [section]: "processing",
      }));

      let success = 0;
      let systemInstructions = "";
      let dbFunction;

      switch (section) {
        case "transportation":
          systemInstructions += createTransportationInstruction();
          dbFunction = updateTransportation;
          break;
        case "lifestyle":
          systemInstructions += createLifestylePreferencesInstruction();
          dbFunction = updateLifestyle;
          break;
        case "categories":
          systemInstructions += createCategoriesInstruction();
          dbFunction = updatePredictedCategories;
          break;
        default:
          console.error("Invalid section name");

          return;
      }

      const requestBody = {
        fileUri,
        instructions: systemInstructions,
      };

      try {
        const response = await fetch("/api/fetchPredictionsWithFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("This is the response data", data);

        //TODO: Remove this debugging step
        //if in category section, we need to make sure that the data is cleaned because the AI might return the wrong json format
        if (section === "categories") {
          console.log("Received response:", data);

          if (!data || !Array.isArray(data.categories)) {
            console.error(
              "The 'categories' field is missing or is not an array."
            );
          } else {
            data.categories.forEach((category: any, index: number) => {
              if (typeof category.title !== "string") {
                console.error(
                  `Category at index ${index} has an invalid 'title'. Expected string, got ${typeof category.title}.`
                );
              }
              if (typeof category.preference !== "string") {
                console.error(
                  `Category at index ${index} has an invalid 'preference'. Expected string, got ${typeof category.preference}.`
                );
              }
              if (
                !Array.isArray(category.vibes) ||
                !category.vibes.every((vibe: any) => typeof vibe === "string")
              ) {
                console.error(
                  `Category at index ${index} has an invalid 'vibes' array. Expected array of strings, got ${JSON.stringify(
                    category.vibes
                  )}.`
                );
              }
              if (
                !Array.isArray(category.subcategories) ||
                !category.subcategories.every(
                  (subcategory: any) => typeof subcategory === "string"
                )
              ) {
                console.error(
                  `Category at index ${index} has an invalid 'subcategories' array. Expected array of strings, got ${JSON.stringify(
                    category.subcategories
                  )}.`
                );
              }
              if (
                typeof category.cost !== "string" ||
                !["$", "$$", "$$$", "$$$$"].includes(category.cost)
              ) {
                console.error(
                  `Category at index ${index} has an invalid 'cost'. Expected one of '$', '$$', '$$$', '$$$$', got ${category.cost}.`
                );
              }
            });

            // Optionally check if all categories passed validation
            const isValid = data.categories.every(
              (category: any) =>
                typeof category.title === "string" &&
                typeof category.preference === "string" &&
                Array.isArray(category.vibes) &&
                category.vibes.every((vibe: any) => typeof vibe === "string") &&
                Array.isArray(category.subcategories) &&
                category.subcategories.every(
                  (subcategory: any) => typeof subcategory === "string"
                ) &&
                typeof category.cost === "string" &&
                ["$", "$$", "$$$", "$$$$"].includes(category.cost)
            );

            if (isValid) {
              console.log("The categories structure is correct.");
            } else {
              console.error(
                "The categories structure is incorrect. See above for details."
              );
            }
          }
        }

        if (data.result) {
          dbFunction(userState.user?.uid || "", data.result);
          success = 1;
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error("Fetch request timed out");
          } else {
            console.error("Fetch error:", error);
          }
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        // Update section status based on success or failure
        setSectionStatus((prevStatus) => ({
          ...prevStatus,
          [section]: success ? "success" : "failed",
        }));
      }
    });

    try {
      await Promise.all(apiCallPromises);
    } finally {
      refreshData(userState.user?.uid || "", userState.user?.name || "");
      setIsUploading(false);
      try {
        const response = await fetch("/api/removeTakeoutData", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName }), // Pass the file URI to the API
        });

        if (response.ok) {
          const data = await response.json();
          console.log("File deleted successfully:", data);
        } else {
          console.error("Failed to delete the file");
        }
      } catch (error) {
        console.error("Error removing file:", error);
      }
    }
  };

  const refreshData = async (userId: string, userName: string) => {
    if (userId && userName) {
      try {
        const profile = await fetchProfile(userId, userName);
        if (profile) {
          // Update Recoil state with the fetched profile but keep the existing birthday and gender
          setOnboardingProfile((prevProfile) => ({
            ...profile,
            birthday: prevProfile.birthday,
            gender: prevProfile.gender,
            name: prevProfile.name,
          }));
          const categories = await fetchCategories(userId);
          setCategoryAtom(categories);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }
  };

  return (
    <Flex direction="column" height="100%" width="100%" p={6}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" mt={4} size="lg">
          Hey There, {userState.user?.name}!
        </Heading>
        <Text fontSize="md" mt={2} mb={4}>
          Welcome to Nested! We are excited to help you find the perfect places
          in your new city using your Google Maps data.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card p={4} bg={cardBg}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Confirm Your Information
          </Text>
          <Text fontSize="sm" mb={4}>
            Let&apos;s start by confirming these details about you to start
            building your profile.
          </Text>

          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Birthday</FormLabel>
              <Input
                type="date"
                value={birthday}
                onChange={handleBirthdayChange}
                placeholder="YYY-MM-DD"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Gender</FormLabel>
              <Input
                type="text"
                value={gender}
                onChange={handleGenderChange}
                placeholder="Gender (e.g., Male, Female, Non-binary)"
              />
            </FormControl>
          </VStack>
        </Card>

        <Card p={4} bg={cardBg}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            AI Onboarding [Optional]
          </Text>
          <Text fontSize="sm" mb={4}>
            Adding your Google Takeout data helps Nested autofill onboarding
            questions to save you time and is not stored. You also have the
            option to answer questions manually, up to you!{" "}
          </Text>
          <Flex alignItems="center" mb={4}>
            <GoogleDriveButton handleUpload={handleUpload} />
            <Tooltip
              label="Don't know how to get your Google Maps data? No worries! We'll guide you through the process."
              maxWidth={"14rem"}
            >
              <Icon
                as={InfoOutlineIcon}
                w={5}
                h={5}
                ml={2}
                mr={2}
                onClick={onOpen}
                cursor="pointer"
              />
            </Tooltip>
          </Flex>

          <SimpleGrid
            columns={3}
            mt={8}
            justifyContent="center"
            justifyItems="center"
          >
            {[
              {
                label: "Transportation",
                status: sectionStatus.transportation,
                icon: FaCar,
              },
              {
                label: "Lifestyle",
                status: sectionStatus.lifestyle,
                icon: FaListAlt,
              },
              {
                label: "Categories",
                status: sectionStatus.categories,
                icon: FaTags,
              },
            ].map(({ label, status, icon }) => (
              <HStack key={label}>
                <Icon
                  as={
                    status === "neutral"
                      ? icon
                      : status === "processing"
                      ? Spinner
                      : status === "success"
                      ? CheckCircleIcon
                      : WarningIcon
                  }
                  color={
                    status === "success"
                      ? "green.500"
                      : status === "failed"
                      ? "yellow.500"
                      : status === "processing"
                      ? "blue.500"
                      : "gray.500"
                  }
                />
                <Text>{label}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Card>
      </SimpleGrid>

      <StepNavigation
        isOpen={isOpen}
        onClose={onClose}
        onAuthorize={() => {
          console.log("Authorized");
        }}
      />
    </Flex>
  );
};

export default IntroPage;
