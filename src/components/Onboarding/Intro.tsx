import { SetStateAction, useEffect, useState, useCallback } from "react";
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
  baseInstruction,
  createCategoriesInstruction,
  createLifestylePreferencesInstruction,
  createTransportationInstruction,
  taskInstructions,
} from "@/utils/functions/uploadFunctions";

interface PeopleInfo {
  genders: GenderDTO[];
  birthdays: BirthdayDTO[];
}

const IntroPage = () => {
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
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

  const handleBirthdayChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    console.log(e.target.value);
    setBirthday(e.target.value);
  };

  const handleGenderChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setGender(e.target.value);
  };

  const getPeopleInfo = useCallback(async (token: string) => {
    console.log("Fetching people info");
    const response = await fetch(
      `/api/fetchExtraUserInformation?token=${token}`
    );

    if (response.ok) {
      const data = await response.json();
      extractUserInfo(data);
    } else {
      console.error("Failed to fetch people info");
    }
  }, []);

  useEffect(() => {
    console.log("onboardingProfile:", onboardingProfile);

    if (onboardingProfile.birthday && onboardingProfile.gender) {
      console.log("Setting birthday and gender from onboardingProfile");
      setBirthday(onboardingProfile.birthday || "");
      setGender(onboardingProfile.gender || "");
    } else {
      const token = userState.user?.googleAuthToken;
      console.log("Token:", token);

      if (
        (token && isAuthenticToken(token)) ||
        token === "FirebaseAuthEmulatorFakeAccessToken_google.com"
      ) {
        console.log("Token is valid, calling getPeopleInfo");
        getPeopleInfo(token);
      } else {
        console.log("Token is invalid");
        logOut();
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingProfile]);

  const extractUserInfo = (data: PeopleInfo) => {
    const birthday = findMostCompleteBirthday(data.birthdays);
    const gender = findMostCompleteGender(data.genders);

    if (birthday) {
      const formattedBirthday = formatBirthday(birthday);
      setBirthday(formattedBirthday);
    }

    if (gender?.formattedValue) {
      setGender(gender.formattedValue);
    }
  };

  const handleUpload = async (fileJsonString: string) => {
    try {
      setIsUploading(true);
      const sectionNames = ["transportation", "lifestyle", "categories"];
      console.log("Uploading file:", fileJsonString);
      for (let i = 0; i < sectionNames.length; i++) {
        const section = sectionNames[i];

        setSectionStatus((prevStatus) => ({
          ...prevStatus,
          [section]: "processing",
        }));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        let success = 0;

        let systemInstructions = baseInstruction + taskInstructions;
        //Instead needs a switch statement to call seperate functions that call the API
        switch (section) {
          case "transportation":
            systemInstructions += createTransportationInstruction();
            console.log("Transportation section instructions:");
            break;
          case "lifestyle":
            systemInstructions += createLifestylePreferencesInstruction();
            console.log("Lifestyle section instructions:");
            break;
          case "categories":
            systemInstructions += createCategoriesInstruction();
            console.log("Categories section instructions:");
            break;
          default:
            console.error("Invalid section name");
        }

        // Step 1: Create a Blob from the JSON string
        const blob = new Blob([fileJsonString], { type: "application/json" });

        // Step 2: Convert the Blob to a File object (optional if you need a File instead of Blob)
        const file = new File([blob], "uploadedFile.json", {
          type: "application/json",
        });

        // Step 3: Create a FormData object
        const formData = new FormData();

        // Append the file to the formData
        formData.append("file", file);

        // Append the systemInstruction to the formData
        formData.append("systemInstruction", systemInstructions);

        await fetch("/api/generateContent", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              console.log("Generated content for ", section, data.result);
              success = 1;
            } else {
              success = 0;
              console.error("Error:", data.error);
            }
          })
          .catch((error) => {
            success = 0;
            console.error("Error:", error);
          });

        setSectionStatus((prevStatus) => ({
          ...prevStatus,
          [section]: success ? "success" : "failed",
        }));
      }
    } catch (error) {
      console.error("Upload Failed", error);
    } finally {
      setIsUploading(false);
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
