import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { UserStatus } from "@/atoms/userAtom";
import { firestore } from "@/firebase/firebaseConfig";

export interface NewUser {
  email: string;
  uid: string;
  name: string;
  text: string;
}
export async function checkUserStatus(
  email: string
): Promise<UserStatus | null> {
  if (!email) {
    return null;
  }

  try {
    const whitelistRef = doc(firestore, "config", "whitelist");
    const graylistRef = doc(firestore, "config", "graylist");
    const adminRef = doc(firestore, "config", "admin");

    const [whitelistDoc, graylistDoc, adminDoc] = await Promise.all([
      getDoc(whitelistRef),
      getDoc(graylistRef),
      getDoc(adminRef),
    ]);

    const whitelistData = whitelistDoc.exists()
      ? whitelistDoc.data()?.user_emails
      : null;
    const graylistData = graylistDoc.exists()
      ? graylistDoc.data()?.user_emails
      : null;
    const adminData = adminDoc.exists() ? adminDoc.data()?.user_emails : null;

    const isWhitelisted = whitelistData && email in whitelistData;
    const isGraylisted = graylistData && email in graylistData;
    const isAdmin = adminData && email in adminData;

    if (isAdmin) {
      return UserStatus.admin;
    } else if (isWhitelisted) {
      return UserStatus.whitelist;
    } else if (isGraylisted) {
      return UserStatus.pending;
    } else {
      return UserStatus.new;
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error code:", error.code);
      console.error("Firebase error message:", error.message);
    }
    return null;
  }
}

export const addUserToGraylist = async (user: NewUser) => {
  const { email, uid, name, text } = user;

  if (!email || !uid || !name) {
    return;
  }

  try {
    const graylistRef = doc(firestore, "config", "graylist");

    await setDoc(
      graylistRef,
      { user_emails: { [email]: { uid, name, text } } },
      { merge: true }
    );
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error code:", error.code);
      console.error("Firebase error message:", error.message);
    }
  }
};

export const moveUserToWhitelist = async (user: NewUser) => {
  const { email, uid, name } = user;

  if (!email || !uid || !name) {
    return;
  }

  try {
    const graylistRef = doc(firestore, "config", "graylist");
    const whitelistRef = doc(firestore, "config", "whitelist");

    // Remove user from graylist
    await updateDoc(graylistRef, { [`user_emails.${email}`]: deleteField() });

    // Add user to whitelist
    await setDoc(
      whitelistRef,
      { user_emails: { [email]: { uid, name } } },
      { merge: true }
    );

    console.log(`User ${email} moved from graylist to whitelist successfully.`);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error code:", error.code);
      console.error("Firebase error message:", error.message);
    }
  }
};
export const getAllGraylistUsers = async (): Promise<NewUser[]> => {
  try {
    const graylistRef = doc(firestore, "config", "graylist");
    const graylistDoc = await getDoc(graylistRef);

    if (graylistDoc.exists()) {
      const userEmailsMap = graylistDoc.data()?.user_emails || {};
      const userArray: NewUser[] = Object.keys(userEmailsMap).map((email) => ({
        email,
        uid: userEmailsMap[email].uid,
        name: userEmailsMap[email].name,
        text: userEmailsMap[email].text,
      }));
      return userArray;
    } else {
      return [];
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error code:", error.code);
      console.error("Firebase error message:", error.message);
    }
    return [];
  }
};
