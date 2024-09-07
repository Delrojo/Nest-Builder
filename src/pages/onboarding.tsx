import React, { useEffect } from "react";
import {
  Box,
  Button,
  Step,
  StepIndicator,
  Stepper,
  StepStatus,
  StepTitle,
  StepSeparator,
  Flex,
  Icon,
  Text,
  useSteps,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { onboardingStepAtom } from "@/atoms/onboardingStepAtom";
import withAuth from "@/components/Modal/Auth/withAuth";
import {
  fetchProfile,
  fetchCategories,
} from "@/utils/functions/onboardingDBFunctions";
import { onboardingProfileAtom } from "@/atoms/onboardingProfileAtom";
import { userAtom } from "@/atoms/userAtom";
import { categoryAtom } from "@/atoms/categoryAtom";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { authModalState } from "@/atoms/authModalAtom";

type OnboardingFlowProps = {};

/**
 * The onboarding flow component that guides users through the onboarding process.
 * @returns
 */
const OnboardingFlow: React.FC<OnboardingFlowProps> = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [onboardingState, setOnboardingState] =
    useRecoilState(onboardingStepAtom);
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
  const [category, setCategoryAtom] = useRecoilState(categoryAtom);
  const { steps, currentStep } = onboardingState;
  const [authModal, setAuthModalState] = useRecoilState(authModalState);
  const { activeStep, setActiveStep } = useSteps({
    index: currentStep,
    count: steps.length,
  });

  const router = useRouter();

  useEffect(() => {
    setAuthModalState({ isOpen: false, mode: "login" });
    if (!user) {
      router.push("/");
      return;
    } else {
      const userId = user.user?.uid;
      const userName = user.user?.name;
      if (userId && userName) {
        fetchProfile(userId, userName)
          .then((profile) => {
            if (profile) {
              setOnboardingProfile(profile);
              fetchCategories(userId).then((categories) => {
                // console.log("Categories fetched:", categories);
                setCategoryAtom(categories);
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching profile:", error);
          });
      } else {
        console.error("User ID is undefined");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // Check URL for hash and set current step accordingly
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const stepIndex = steps.findIndex(
      (step) => step.title.toLowerCase() === hash
    );
    if (stepIndex !== -1) {
      setOnboardingState((prev) => ({
        ...prev,
        currentStep: stepIndex,
      }));
      setActiveStep(stepIndex);
    }
  }, [setOnboardingState, setActiveStep, steps]);

  useEffect(() => {
    // Update URL hash whenever the step changes
    if (steps[activeStep]) {
      window.history.replaceState(
        null,
        "",
        `#${steps[activeStep].title.toLowerCase()}`
      );
    }
  }, [activeStep, steps]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    setOnboardingState((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  const handlePrev = () => {
    setActiveStep((prev) => prev - 1);
    setOnboardingState((prev) => ({
      ...prev,
      currentStep: prev.currentStep - 1,
    }));
  };

  const iconColor = useColorModeValue("gray.300", "gray.500");

  const handleNextAndSubmit = () => {
    if (activeStep >= steps.length - 1) {
      router.push("/explore");
    } else {
      handleNext();
    }
  };

  return (
    <Flex
      direction="column"
      p={4}
      w={"100%"}
      h={"100%"}
      justifyContent={"space-between"}
    >
      <Stepper index={activeStep} orientation="horizontal" colorScheme="green">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<Icon as={FaCheckCircle} />}
                incomplete={<Icon as={step.stepIcon} color={iconColor} />}
                active={<Icon as={step.stepIcon} />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>{" "}
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Flex flexGrow={1} w={"100%"} h={"100%"}>
        {React.createElement(steps[activeStep].stepContent)}
      </Flex>

      <Flex
        w={"100%"}
        alignItems={"center"}
        gap={4}
        justifyContent={"space-between"}
        mb={4}
      >
        <Button
          colorScheme="green.600"
          onClick={handlePrev}
          isDisabled={activeStep <= 0}
          width={"fit-content"}
        >
          Previous
        </Button>
        <Text fontSize="md">{`${steps[activeStep].nextStep}`}</Text>
        <Button
          colorScheme="green.600"
          onClick={handleNextAndSubmit}
          isDisabled={activeStep >= steps.length - 1 && false}
          width={"fit-content"}
        >
          {activeStep >= steps.length - 1 ? "Explore" : "Next"}
        </Button>
      </Flex>
      <AuthModal />
    </Flex>
  );
};

export default withAuth(OnboardingFlow);
