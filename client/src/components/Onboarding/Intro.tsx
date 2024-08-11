import { SetStateAction, useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Progress,
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
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  InfoOutlineIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import StepNavigation from "./TakeoutStepNavigation";
import { userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";

const IntroPage = () => {
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sectionStatus, setSectionStatus] = useState({
    transportation: false,
    lifestyle: false,
    review: false,
    categories: false,
  });
  const toast = useToast();
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

  const handleUpload = async () => {
    try {
      setUploadProgress(0);
      for (let i = 1; i <= 100; i++) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      setSectionStatus({
        transportation: Math.random() > 0.5,
        lifestyle: Math.random() > 0.5,
        review: Math.random() > 0.5,
        categories: Math.random() > 0.5,
      });
      toast({
        title: "Upload Successful",
        description: "Your Google Maps data has been processed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" minHeight="100vh" width="100%" p={6}>
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
            Data Upload & Progress
          </Text>
          <Text fontSize="sm" mb={4}>
            Connect your Google Maps data to get started with Nested.
          </Text>
          <Flex alignItems="center" mb={4}>
            <Button variant="solid" onClick={handleUpload} w="full">
              Connect to Google Drive
            </Button>
            <Tooltip
              label="Don't know how to get your Google Maps data? No worries! We'll guide you through the process."
              placement="top"
              hasArrow
            >
              <Icon
                as={InfoOutlineIcon}
                w={5}
                h={5}
                ml={2}
                color={useColorModeValue("gray.500", "gray.200")}
                onClick={onOpen}
                cursor="pointer"
              />
            </Tooltip>
          </Flex>
          {uploadProgress > 0 && (
            <Box w="full" mt={4}>
              <Progress value={uploadProgress} size="sm" hasStripe isAnimated />
              <Text fontSize="sm" mt={2}>
                Upload Progress: {uploadProgress}%
              </Text>
            </Box>
          )}

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            mt={8}
            justifyContent="center"
            alignItems="center"
          >
            {[
              { label: "Transportation", status: sectionStatus.transportation },
              { label: "Lifestyle", status: sectionStatus.lifestyle },
              { label: "Review", status: sectionStatus.review },
              { label: "Categories", status: sectionStatus.categories },
            ].map(({ label, status }) => (
              <HStack key={label}>
                <Icon
                  as={status ? CheckCircleIcon : WarningIcon}
                  color={status ? "green.500" : "yellow.500"}
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
