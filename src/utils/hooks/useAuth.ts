// useAuth.ts
import { useRecoilState } from "recoil";
import { userAtom, loadingAtom, UserStatus } from "@/atoms/userAtom";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
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
    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      if (user) {
        window.close();
        const status = await checkUserStatus(user.email || "");
        setUser({
          user: {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            status: status || UserStatus.new,
            //TODO: Add googleAuthToken to user object
            googleAuthToken: "idToken",
          } as User,
        });
      } else {
        console.error("User not found.");
      }
    });

    // const unsubscribeIdToken = onIdTokenChanged(auth, async (user) => {
    //   if (user) {
    //     const idToken = await getIdToken(user);
    //     setUser((prevState) => {
    //       if (!prevState.user) {
    //         return prevState;
    //       }
    //       return {
    //         ...prevState,
    //         user: {
    //           ...prevState.user,
    //           googleAuthToken: idToken,
    //         },
    //       };
    //     });
    //   }
    // });

    return () => {
      unsubscribeAuthState();
      // unsubscribeIdToken();
    };
  }, [setUser]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    provider.addScope("https://www.googleapis.com/auth/user.gender.read");
    provider.addScope("https://www.googleapis.com/auth/drive");

    setLoading(true);
    try {
      console.log("Signing in with Google");
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
    setLoading(false);
  };
  const logOut = async () => {
    setLoading(true);
    try {
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
