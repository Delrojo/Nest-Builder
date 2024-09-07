import { atom } from "recoil";

export interface TransportationDTO {
  [key: string]: {
    selected: boolean;
    radius: number | 0;
  };
}

export interface LifestyleDTO {
  [key: string]: boolean;
}

export interface Profile {
  birthday: string;
  gender: string;
  home_address: string;
  transportations: TransportationDTO;
  lifestyle_traits: LifestyleDTO;
  lifestyle_paragraph: string;
  additional_info: string;
  name: string;
}

export const onboardingProfileAtom = atom<Profile>({
  key: "onboardingProfileAtom",
  default: {} as Profile,
});
