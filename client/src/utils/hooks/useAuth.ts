// useAuth.ts
import { useRecoilState } from "recoil";
import { userAtom, loadingAtom, UserStatus } from "@/atoms/userAtom";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
          } as User,
        });
      } else {
        console.error("User not found.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUser]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    // provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    // provider.addScope("https://www.googleapis.com/auth/user.gender.read");
    // provider.addScope("https://www.googleapis.com/auth/drive");

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

  // useEffect(() => {
  //   const handleRedirectResult = async () => {
  //     try {
  //       console.log("Checking redirect result");
  //       const result = await getRedirectResult(auth);
  //       console.log("getRedirectResult result:", result);
  //       if (result) {
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         console.log("GoogleAuthProvider credential:", credential);
  //         const token = credential?.accessToken;
  //         console.log("Google Access Token:", token);
  //         if (token) {
  //           localStorage.setItem("accessToken", token);
  //           setUser((prevState) => {
  //             console.log("Updating user state with token");
  //             if (!prevState.user) {
  //               console.log("No previous user state found");
  //               return prevState;
  //             }
  //             return {
  //               ...prevState,
  //               user: {
  //                 ...prevState.user,
  //                 googleAuthToken: token,
  //               },
  //             };
  //           });
  //         } else {
  //           console.log("No access token found in credential");
  //         }
  //       } else {
  //         console.log("No redirect result found.");
  //       }
  //     } catch (error) {
  //       console.error("Error getting Google access token:", error);
  //     }
  //   };

  //   handleRedirectResult();
  // }, [setUser]);

  async function googleSignInWithGapi() {
    try {
      // Dynamically import gapi-script
      const { gapi, loadGapiInsideDOM } = await import("gapi-script");

      // Load the Google API client inside the DOM
      await loadGapiInsideDOM();

      // Initialize the Google Auth API client
      gapi.load("auth2", async () => {
        const auth2 = gapi.auth2.init({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          scope:
            "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        });

        const provider = new GoogleAuthProvider();

        //SignIn With Redirect Method
        await signInWithRedirect(auth, provider);

        // Get the current user
        const googleUser = auth2.currentUser.get();
        const result = await getRedirectResult(auth);

        console.log("Google User:", googleUser);
        console.log("Redirect result:", result);

        // Obtain the Google ID token and access token
        const idToken = googleUser.getAuthResponse().id_token;
        const accessToken = googleUser.getAuthResponse().access_token;

        // Create a Firebase credential with the Google ID token
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        // Sign in the user with Firebase
        const userCredential = await signInWithCredential(auth, credential);

        // Get the Firebase ID token
        const firebaseUser = userCredential.user;
        const tokenResult = await firebaseUser.getIdTokenResult();

        console.log("Firebase ID token:", tokenResult.token);

        // Now you have the Firebase ID token and can use it as needed
        setUser({
          user: {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            status: UserStatus.new,
            googleAuthToken: tokenResult.token,
          },
        });
      });
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  }

  return {
    user,
    loading,
    googleSignIn,
    googleSignInWithGapi,
    logOut,
  };
}
