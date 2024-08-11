import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";

type IntroProps = {};

const Intro: React.FC<IntroProps> = () => {
  const [userState, setUserState] = useRecoilState(userAtom);

  const bgColor = useColorModeValue("primary.100", "primary.800");

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Let&apos;s Make Your New City Feel Like Home
      </Heading>
      <Text fontSize="md" mt={2} textAlign="center">
        Leverages Gemini 1.5 (Google&apos;s LLM) to help find places in your
        city that can facilitate your lifestyle.
      </Text>
      <Text fontSize="md" mb={4} textAlign="center">
        First, please answer some questions so Nested can provide better
        suggestions.
      </Text>
      <Flex
        direction={{ base: "column", lg: "row" }}
        wrap="wrap"
        gap={4}
        mt={8}
        maxWidth="75rem"
        width="100%"
        alignContent={"center"}
        justify="center"
      >
        <Card
          size="sm"
          flex="1"
          minWidth={{ base: "100%", md: "48%" }}
          maxWidth="500px"
          p={6}
          borderRadius="md"
          bg={bgColor}
        >
          <Heading as="h2" size="md" textAlign="start">
            Basic Info
          </Heading>
          <Text fontSize="sm" mt={1} textAlign="start">
            We are pulling this information from your Google Account. If it is
            incorrect, please update it here
          </Text>
          <Flex direction="column" ml={4} width="100%">
            <Avatar size="md" src={userState.user?.photoURL} mt={4} />
            <Input
              placeholder="Name"
              value={userState.user?.name}
              mt={4}
              onChange={() => {}}
            />
            <Input
              placeholder="Email"
              value={userState.user?.email}
              mt={4}
              onChange={() => {}}
            />
            <Input placeholder="Birthday" mt={4} onChange={() => {}} />
            <Input placeholder="Gender" mt={4} onChange={() => {}} />
          </Flex>
        </Card>

        <Card
          mt={{ base: 4, md: 0 }}
          flex="1"
          minWidth={{ base: "100%", md: "48%" }}
          maxWidth="500px"
          p={6}
          borderRadius="md"
          bg={bgColor}
        >
          <Heading as="h2" size="md" textAlign="start">
            AI Onboarding [Optional]
          </Heading>
          <Text fontSize="sm" mt={2} textAlign="start">
            Adding your Google Takeout data helps Nested autofill onboarding
            questions to save you time and is not stored. You also have the
            option to answer questions manually, up to you!
          </Text>
          <Button mt={4} width="100%">
            Upload Google Takeout
          </Button>
        </Card>
      </Flex>
    </Flex>
  );
};

export default Intro;
