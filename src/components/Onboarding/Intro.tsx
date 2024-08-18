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
import { FaCar, FaListAlt, FaAlignJustify, FaTags } from "react-icons/fa";
import StepNavigation from "./TakeoutStepNavigation";
import { userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import GoogleDriveButton from "./GoogleDriveButton";

const IntroPage = () => {
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [sectionStatus, setSectionStatus] = useState({
    transportation: "neutral",
    lifestyle: "neutral",
    review: "neutral",
    categories: "neutral",
  });
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userState, setUserState] = useRecoilState(userAtom);

  const cardBg = useColorModeValue("primary.100", "primary.800");

  const handleBirthdayChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setBirthday(e.target.value);
  };

  const handleGenderChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setGender(e.target.value);
  };

  const getPeopleInfo = useCallback(async () => {
    const token = userState.user?.googleAuthToken;
    const response = await fetch(`/api/fetchPeopleInfo?token=${token}`);

    if (response.ok) {
      const data = await response.json();
      console.log("People Info:", data);

      //TODO: set birthday and gender from data
    } else {
      console.error("Failed to fetch people info");
    }
  }, [userState.user?.googleAuthToken]);

  useEffect(() => {
    if (userState.user) {
      getPeopleInfo();
    }
  }, [getPeopleInfo, userState.user]);

  const handleUpload = async () => {
    try {
      setIsUploading(true); // Start processing
      const sectionNames = [
        "transportation",
        "lifestyle",
        "review",
        "categories",
      ];
      for (let i = 0; i < sectionNames.length; i++) {
        const section = sectionNames[i];

        setSectionStatus((prevStatus) => ({
          ...prevStatus,
          [section]: "processing",
        }));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const success = Math.random() > 0.5;

        setSectionStatus((prevStatus) => ({
          ...prevStatus,
          [section]: success ? "success" : "failed",
        }));
      }
    } catch (error) {
      console.error("Upload Failed", error);
    } finally {
      setIsUploading(false); // Reset to allow new uploads
    }
  };

  return (
    <Flex direction="column" height="100%" width="100%" p={6}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" mt={4} size="lg">
          Hey There, {userState.user?.name}!{userState.user?.googleAuthToken}
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
                placeholder="Enter your birthday"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Gender</FormLabel>
              <Input
                type="text"
                value={gender}
                onChange={handleGenderChange}
                placeholder="Enter your gender"
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
            {/* <Button
              variant="solid"
              onClick={handleUpload}
              w="full"
              isLoading={isUploading}
              loadingText="Processing..."
            >
              Upload Google Takeout Data
            </Button> */}
            <GoogleDriveButton />
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
            columns={{ base: 1, md: 2 }}
            spacing={4}
            mt={8}
            justifyContent="center"
            alignItems="center"
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
                label: "Review",
                status: sectionStatus.review,
                icon: FaAlignJustify,
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
        onAuthorize={handleUpload}
      />
    </Flex>
  );
};

export default IntroPage;
