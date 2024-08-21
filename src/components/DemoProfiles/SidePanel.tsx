import { Profile } from "@/atoms/demoProfileAtom";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useColorMode,
} from "@chakra-ui/react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, profile }) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "primary.100" : "primary.800";
  const textColor = colorMode === "light" ? "black" : "white";

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bg={bgColor} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader>{profile.name}</DrawerHeader>
          <DrawerBody>
            {profile.summary.map((point, index) => (
              <Text key={index} mb={2}>
                {point}
              </Text>
            ))}
            <Button mt={4} colorScheme={profile.color} onClick={onClose}>
              Start Demo
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SidePanel;
