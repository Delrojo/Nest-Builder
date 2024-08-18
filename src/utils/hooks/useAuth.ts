// useAuth.ts
import { useRecoilState } from "recoil";
import { userAtom, loadingAtom, User } from "@/atoms/userAtom";
import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { checkUserStatus } from "../functions/authFunctions";

export function useAuth() {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const router = useRouter();
  const toast = useToast();

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

        const status = await checkUserStatus(user.email || "");

        setUser({
          user: {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            status: status,
            googleAuthToken: token || "idToken",
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
