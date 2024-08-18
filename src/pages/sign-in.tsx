import { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { Box, Spinner, Text, Alert, AlertIcon, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function GoogleSignIn() {
  const [status, setStatus] = useState("pending");
  const { user, loading, googleSignIn, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("GoogleSignIn useEffect triggered");
    const handleGoogleSignIn = async () => {
      try {
        await googleSignIn().then(() => {
          console.log("Google sign-in successful");
          window.close();
          router.push("/");
          setStatus("success");
        });
      } catch (error) {
        console.error("Error during Google sign-in: ", error);
        setStatus("error");
      }
    };
    handleGoogleSignIn();
  }, []);

  return (
    <Box textAlign="center" p={5}>
      {status === "pending" && (
        <>
          <Spinner size="xl" color="primary.500" />
          <Text fontSize="lg" mt={3}>
            Redirecting to Google Sign-In...
          </Text>
        </>
      )}
      {status === "error" && (
        <Alert status="error">
          <AlertIcon />
          <Text>There was an error signing you in. Please try again.</Text>
          <Button onClick={() => setStatus("pending")} colorScheme="red" ml={3}>
            Retry
          </Button>
        </Alert>
      )}
    </Box>
  );
}
