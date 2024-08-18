import {
  Box,
  Text,
  Tag,
  VStack,
  Divider,
  Input,
  useColorModeValue,
  Flex,
  Textarea,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const ReviewInformation = () => {
  const cardBg = useColorModeValue("primary.100", "primary.800");
  const tagBg = useColorModeValue("primary.700", "primary.500");

  const userInfo = {
    name: "Shaan",
    age: 23,
    gender: "Male",
    location: "San Jose 95117",
    address: "3173 Payne Ave",
    travelModes: [
      { mode: "Walking", distance: "1.1 miles" },
      { mode: "Driving", distance: "4.7 miles" },
    ],
    routines: `I lead a busy life that balances work, health, and leisure. I value convenience and often seek out places to eat, exercise, and relax that are close to my home or work. Maintaining a healthy lifestyle is important to me, as evidenced by my interest in healthy dining options and activities. I also enjoy spending time in nature and exploring peaceful environments like parks and gardens.`,
  };

  const preferences = [
    "Active Lifestyle",
    "Affordability",
    "Convenient",
    "Family Friendly",
    "Green Spaces",
    "Healthy",
    "Quiet",
  ];

  const handleOnRoutineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Review Information
      </Heading>
      <Text fontSize="md" mt={2} mb={4} textAlign="start">
        Hey, {userInfo.name}! This is what Nested has learned from your answers
        and Google takeout data. Is this correct?
      </Text>
      <Box
        background={cardBg}
        p={5}
        borderRadius="lg"
        boxShadow="md"
        maxWidth="800px"
        mx="auto"
        mt={5}
      >
        <VStack spacing={4} align="stretch">
          <Text>
            I am {userInfo.age} year old {userInfo.gender}, and I moved/am
            moving to {userInfo.location}. My address is {userInfo.address}, and
            I prefer to travel by{" "}
            {userInfo.travelModes
              .map((t) => `${t.mode} (${t.distance})`)
              .join(" and ")}
            .
          </Text>

          <Divider my={1} />

          <Text fontSize="md" mt={1} textAlign="start">
            I have the following routines and preferences in my locations:
          </Text>
          <Textarea
            fontSize={"sm"}
            value={userInfo.routines}
            onChange={handleOnRoutineChange}
          />
          <Divider my={1} />

          <Text>
            When deciding on the places I go frequently, I care about the
            following priorities:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {preferences.map((pref) => (
              <Tag size="md" variant="solid" bg={tagBg} key={pref}>
                {pref}
              </Tag>
            ))}
          </Flex>

          <Divider my={1} />

          <FormControl>
            <FormLabel>Additional Comments</FormLabel>
            <Input
              variant="ghost"
              placeholder="e.g., Any specific requirements or notes"
              size="md"
            />
          </FormControl>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ReviewInformation;
