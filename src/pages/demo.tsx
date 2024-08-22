import React, { useState } from "react";
import {
  Box,
  Highlight,
  SimpleGrid,
  Heading,
  Text,
  useBreakpointValue,
  Link,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import SidePanel from "@/components/DemoProfiles/SidePanel";
import AnimatedButton from "@/components/DemoProfiles/AnimatedButton";
import { Profile } from "@/atoms/demoProfileAtom";
import profilesData from "@/data/profilesData";
import lightenColor from "@/utils/functions/demoFunctions";
import { useRecoilState } from "recoil";
import { demoProfileAtom } from "@/atoms/demoProfileAtom";

const DemoPage: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [demoProfile, setDemoProfile] = useRecoilState(demoProfileAtom);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { colorMode } = useColorMode();

  const handleButtonClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setDemoProfile({
      profile: selectedProfile,
    });
  };

  if (isMobile) {
    return (
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <Heading as="h1" size="2xl">
          Switch to Desktop
        </Heading>
        <Text fontSize="xl" textAlign="center">
          For a better experience, please switch to a desktop device.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Heading as="h1" size="xl" mb={2}>
        Welcome to the Demo
      </Heading>
      <Text fontSize="lg" mb={4} textAlign="center">
        Click on a profile to read about them and start the demo.
      </Text>
      <Box display="flex" mt={4} width="fit-content" maxWidth={"80%"}>
        <Box flex="1">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
            {profilesData.map((profile, index) => (
              <VStack key={index} spacing={4}>
                <AnimatedButton
                  gifSrc={
                    colorMode === "light"
                      ? profile.lightGifSrc
                      : profile.darkGifSrc
                  }
                  photoSrc={profile.photoSrc}
                  onClick={() => handleButtonClick(profile)}
                  bgColor={
                    colorMode === "light"
                      ? profile.lightBgColor
                      : profile.darkBgColor
                  }
                />
                <Text fontSize="lg" textAlign="center">
                  {selectedProfile?.name === profile.name ? (
                    <Highlight
                      query={profile.name}
                      styles={{
                        px: "2",
                        py: "1",
                        rounded: "md",
                        bg:
                          colorMode === "light"
                            ? lightenColor(profile.lightBgColor, 0.5)
                            : lightenColor(profile.color, 0.5),
                      }}
                    >
                      {profile.name}
                    </Highlight>
                  ) : (
                    profile.name
                  )}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
        {selectedProfile && (
          <SidePanel
            isOpen={isPanelOpen}
            onClose={handlePanelClose}
            profile={selectedProfile}
          />
        )}
      </Box>
      <Link href="https://storyset.com/people" isExternal>
        <Text fontSize="sm" textAlign="center" mt={4} color="green.500">
          People illustrations by Storyset
        </Text>
      </Link>
    </Box>
  );
};

export default DemoPage;
