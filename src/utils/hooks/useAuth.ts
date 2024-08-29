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
    googleSignIn,
    logOut,
  };
}
