import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Custom404 = () => {
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/");
  };
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading display="inline-block" as="h1" size="2xl">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you&apos;re looking for does not seem to exist.
      </Text>

      <Button variant="outline" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Custom404;
