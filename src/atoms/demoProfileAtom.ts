import { atom } from "recoil";

export interface Profile {
  name: string;
  lightGifSrc: string;
  darkGifSrc: string;
  photoSrc: string;
  pfpSrc: string;
  color: string;
  lightBgColor: string;
  darkBgColor: string;
  summary: string[];
}

export interface SelectedProfileAtom {
  profile: Profile | null;
}

const defaultProfileState: SelectedProfileAtom = {
  profile: null,
};

export const demoProfileAtom = atom<SelectedProfileAtom>({
  key: "demoProfileAtom",
  default: defaultProfileState,
});
