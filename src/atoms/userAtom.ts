import { atom } from "recoil";

export enum UserStatus {
  admin = "admin",
  whitelist = "whitelist",
  new = "new",
  pending = "pending",
  banned = "banned",
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  status: UserStatus | null;
  googleAuthToken: string | null;
}

export interface UserAtom {
  user: User | null;
}

const defaultUserState: UserAtom = {
  user: null,
};

export const userAtom = atom<UserAtom>({
  key: "userAtom",
  default: defaultUserState,
});

export const loadingAtom = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const isAuthenticToken = (token: string | undefined | null): boolean => {
  return token !== null && token !== undefined && token !== "nullIdToken";
};
