// useAuth.ts
import { useRecoilState } from "recoil";
import { userAtom, loadingAtom, UserStatus } from "@/atoms/userAtom";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { checkUserStatus } from "../functions/authFunctions";
import { User } from "@/atoms/userAtom";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

export function useAuth() {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    console.log("useEffect triggered");

    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);
        window.close();
        const status = await checkUserStatus(user.email || "");
        console.log("User status:", status);
        setUser({
          user: {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            status: status || UserStatus.new,
            googleAuthToken: "idToken",
          } as User,
        });
      } else {
        console.error("User not found.");
      }
    });

    return () => {
      console.log("Cleaning up useEffect");
      unsubscribeAuthState();
    };
  }, [setUser]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    provider.addScope("https://www.googleapis.com/auth/user.gender.read");
    provider.addScope("https://www.googleapis.com/auth/drive");

    setLoading(true);
    try {
      console.log("Signing in with Google using redirect");
      await signInWithRedirect(auth, provider);
      console.log("Sign in with Google using redirect successful");
    } catch (error) {
      console.error("Error signing in with Google using redirect: ", error);
      console.log("Attempting to sign in with Google using popup");
      try {
        await signInWithPopup(auth, provider);
        console.log("Sign in with Google using popup successful");
      } catch (popupError) {
        console.error("Error signing in with Google using popup: ", popupError);
      }
    }
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);
    try {
      console.log("Logging out");
      localStorage.removeItem("accessToken");
      setUser({
        user: null,
      });
      router.push("/");
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      await signOut(auth);
      console.log("Logout successful");
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
