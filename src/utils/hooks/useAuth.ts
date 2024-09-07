import { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userAtom, loadingAtom, User } from "@/atoms/userAtom";
import {
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { checkUserStatus } from "../functions/authFunctions";
import { onboardingStepAtom } from "@/atoms/onboardingStepAtom";

export function useAuth() {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const resetOnboardingState = useResetRecoilState(onboardingStepAtom);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const status = await checkUserStatus(firebaseUser.email || "");
        const token = localStorage.getItem("accessToken");
        setUser({
          user: {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            status: status,
            googleAuthToken: token || "nullIdToken",
          } as User,
        });
      } else {
        setUser({
          user: null,
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  // New function to validate and refresh the Google OAuth token
  const validateAndRefreshToken = async () => {
    const googleAuthToken = localStorage.getItem("accessToken");

    // Check if the user exists and accessToken is present
    const currentUser = auth.currentUser;
    console.log("HEY IM IN THE VALIDATE AND REFRESH TOKEN FUNCTION");
    console.log("currentUser", currentUser);
    if (!currentUser || !googleAuthToken) {
      console.warn("User not authenticated or access token is missing.");
      return false;
    }

    // Function to validate token
    const isValidToken = async (token: string): Promise<boolean> => {
      console.log("Validating token:", token);
      if (token === "FirebaseAuthEmulatorFakeAccessToken_google.com") {
        console.warn("Detected emulator token, valid.");
        return true;
      }

      try {
        console.log("Checking token validity with Google API...");
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );
        console.log("Response:", response);
        if (response.status === 401) {
          console.warn("Token is invalid or expired.");
          return false;
        }
        return response.ok;
      } catch (error) {
        console.error("Error validating token:", error);
        return false;
      }
    };

    // Check if the token is valid
    const valid = await isValidToken(googleAuthToken);
    if (valid) {
      console.log("Token is valid.");
      return true;
    }

    console.log(
      "Token is invalid or expired, attempting silent re-authentication."
    );

    // Perform silent refresh using Google Sign-In
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const newGoogleAuthToken = credential?.accessToken;

      if (newGoogleAuthToken) {
        // Store the new token in localStorage and update Recoil state
        const status = await checkUserStatus(currentUser.email || "");
        localStorage.setItem("accessToken", newGoogleAuthToken);
        setUser((prevUser) => ({
          ...prevUser,
          user: {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            status: status,
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
            googleAuthToken: newGoogleAuthToken, // Set the new Google Auth Token
          },
        }));
        console.log("Successfully refreshed token.");
        return true; // Token refreshed successfully
      }
    } catch (error) {
      console.error("Failed to refresh token via Google Sign-In: ", error);
      return false;
    }
    return false;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    provider.addScope("https://www.googleapis.com/auth/user.gender.read");
    provider.addScope("https://www.googleapis.com/auth/drive");

    setLoading(true);
    try {
      await signInWithPopup(auth, provider).then(async (result) => {
        const user = result.user;

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        if (token) {
          localStorage.setItem("accessToken", token);
        } else {
          console.error("Failed to get Google access token.");
          logOut();
        }

        const status = await checkUserStatus(user.email || "");

        setUser({
          user: {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            status: status,
            googleAuthToken: token || "nullIdToken",
          } as User,
        });
        console.log("User state updated:", user);
      });
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("accessToken");
      setUser({
        user: null,
      });
      resetOnboardingState();
      router.push("/");
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Failed to log out.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    validateAndRefreshToken,
    googleSignIn,
    logOut,
  };
}
