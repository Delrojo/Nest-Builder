import { atom } from "recoil";

export interface Profile {
  birthday: string;
  gender: string;
  home_address: string;
  transportations: {
    [key: string]: {
      selected: boolean;
      radius: number;
    };
  };
  lifestyle_traits: {
    [key: string]: boolean;
  };
  lifestyle_paragraph: string;
  additional_info: string;
  name: string;
}

export const onboardingProfileAtom = atom<Profile>({
  key: "onboardingProfileAtom",
  default: {} as Profile,
});
