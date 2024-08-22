import { Profile } from "@/atoms/demoProfileAtom";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useColorMode,
  Box,
} from "@chakra-ui/react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, profile }) => {
  const { colorMode } = useColorMode();
  const bgColor =
    colorMode === "light" ? profile.lightBgColor : profile.darkBgColor;
  const textColor = colorMode === "light" ? "black" : "black";

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bg={bgColor} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex align="center">
              {/* <Avatar
                name={profile.name}
                src={profile.pfpSrc}
                size="lg"
                mr={4}
              /> */}
              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  {profile.name}
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Box mb={4}>
              <img
                src={profile.photoSrc}
                alt={`${profile.name} gif`}
                width="100%"
                height="auto"
                style={{ borderRadius: "8px" }}
              />
            </Box>
            <Box mb={4}>
              <Text
                fontSize="sm"
                color={textColor === "black" ? "gray.600" : "gray.300"}
              >
                Profile Summary
              </Text>
              {profile.summary.map((point, index) => (
                <Text key={index} mb={2} fontSize="md" lineHeight="tall">
                  {point}
                </Text>
              ))}
            </Box>
            <Button
              mt={4}
              colorScheme={profile.color}
              onClick={onClose}
              width="100%"
              size="lg"
            >
              Start Demo
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SidePanel;
