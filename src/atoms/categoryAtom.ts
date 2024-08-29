import { PlacesModel } from "@/components/Explore/ExploreCard";
import { atom } from "recoil";

export enum CategoryStatus {
  Active = "Active",
  Inactive = "Inactive",
  Edit = "Edit",
}

export interface Category {
  title: string;
  cost: string;
  preference: string;
  subcategories: string[];
  vibes: string[];
  status: CategoryStatus;
}

export interface CategoryAtom {
  category: Category;
  results: PlacesModel[];
}

const defaultCategoryAtom: CategoryAtom[] = [
  {
    category: {
      title: "Food",
      cost: "$",
      preference: "Casual",
      subcategories: ["Fast Food", "Fine Dining", "Cafes"],
      vibes: ["Romantic", "Family Friendly", "Hipster"],
      status: CategoryStatus.Active,
    },
    results: [],
  },
];

export const categoryAtom = atom<CategoryAtom[]>({
  key: "categoryAtom",
  default: defaultCategoryAtom,
});
