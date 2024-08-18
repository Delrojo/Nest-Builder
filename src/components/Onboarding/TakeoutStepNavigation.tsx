import { useState } from "react";
import {
  Box,
  Text,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const StepNavigation = ({
  isOpen,
  onClose,
  onAuthorize,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: () => void;
}) => {
  const [activeStep, setActiveStep] = useState<number>(0); // Open the first step by default
  const arrowColor = useColorModeValue("primary.500", "primary.400");
  const bgColor = useColorModeValue("background.light", "background.dark");
  const cardColor = useColorModeValue("primary.100", "primary.800");

  const steps = [
    {
      title: "Access Google Takeout",
      detail:
        "Visit the Google Takeout page to start exporting your data. This is the first step in retrieving your Google Maps history.",
    },
    {
      title: "Select Google Maps Data",
      detail:
        "From the list of available services, choose Google Maps to export only your location data.",
    },
    {
      title: "Set Format to JSON",
      detail:
        "Ensure the export format is set to JSON. This format is required for compatibility with our system.",
    },
    {
      title: "Export to Google Drive",
      detail:
        "Save the exported data to your Google Drive for easy access and seamless integration.",
    },
  ];

  const toggleStep = (stepIndex: number) => {
    setActiveStep(stepIndex === activeStep ? -1 : stepIndex);
  };

  const handleNextStep = () => {
    const nextStep = Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(nextStep);
  };

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent bg={bgColor}>
        <DrawerCloseButton />
        <DrawerHeader mt={4}>Google Takeout Export Guide</DrawerHeader>

        <DrawerBody>
          <Accordion index={activeStep} allowToggle={false}>
            {steps.map((step, index) => (
              <AccordionItem key={index}>
                <AccordionButton onClick={() => toggleStep(index)}>
                  <Box
                    flex="1"
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                  >
                    {step.title}
                  </Box>
                  <AccordionIcon color={arrowColor} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text mb={2}>{step.detail}</Text>
                  <Box bg={cardColor} p={4} borderRadius="md">
                    <Text fontSize="sm">
                      Here are the detailed instructions for{" "}
                      {step.title.toLowerCase()}.
                    </Text>
                    {/* Placeholder for instructional content, e.g., images or videos */}
                    <Box h="150px" bg="gray.200" mt={2} borderRadius="md" />
                  </Box>
                  <Flex w="100%" mt={4} justify="center">
                    {index === steps.length - 1 ? (
                      <Text
                        textAlign={"center"}
                        fontSize="md"
                        color={arrowColor}
                      >
                        Congratulations! You&apos;ve completed all steps. 🎉
                      </Text>
                    ) : (
                      <Button
                        onClick={handleNextStep}
                        rightIcon={<FaArrowRight />}
                      >
                        Next Step
                      </Button>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </DrawerBody>

        <DrawerFooter mb={4}>
          <Flex direction={"column"} align={"center"} w={"full"}>
            <Text textAlign={"center"} fontSize="sm" color={arrowColor} mb={2}>
              After completing the steps, verify your data in Google Drive.
            </Text>
            <Button
              variant={"outline"}
              onClick={onAuthorize}
              rightIcon={<FaCheckCircle />}
            >
              Verify Data in Google Drive
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default StepNavigation;
