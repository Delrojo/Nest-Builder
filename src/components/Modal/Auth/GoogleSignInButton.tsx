import { useAuth } from "@/utils/hooks/useAuth";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

type GoogleSignInButtonProps = {};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = () => {
  const [status, setStatus] = useState("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, loading, googleSignIn, logOut } = useAuth();

  const router = useRouter();
  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In button clicked");
    try {
      console.log("Attempting Google sign-in.");
      await googleSignIn().then(() => {
        console.log("Google sign-in successful");
        setStatus("success");
      });
    } catch (error: any) {
      if (error.code === "auth/popup-blocked") {
        const errorMessage =
          "Popup blocked. Please allow popups and try again.";
        console.error(errorMessage);
        setErrorMessage(errorMessage);
        setStatus("error");
      } else {
        console.error("Error during Google sign-in: ", error);
        setErrorMessage("Error during Google sign-in" + error.message);
        setStatus("error");
      }
    }
  };

  return (
    <>
      <Button
        leftIcon={<FaGoogle />}
        size="sm"
        onClick={handleGoogleSignIn}
        colorScheme="blue"
      >
        Sign in with Google
      </Button>
      {errorMessage && (
        <Text color="red.500" mt={2}>
          {errorMessage}
        </Text>
      )}
    </>
  );
};

export default GoogleSignInButton;
