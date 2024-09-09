import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { Profile } from "@/atoms/onboardingProfileAtom";
import { Category, CategoryAtom, CategoryStatus } from "@/atoms/categoryAtom";
import { TransportationDTO } from "@/atoms/onboardingProfileAtom";
import { titleCaseToSnakeCase } from "./introFunctions";

export const fetchProfile = async (userId: string, userName: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();

      const profileData: Profile = {
        name: data?.name || "",
        birthday: data?.birthday || "",
        gender: data?.gender || "",
        home_address: data?.home_address || "",
        transportations: data?.transportations || {},
        lifestyle_traits: data?.lifestyle_traits || {},
        lifestyle_paragraph: data?.lifestyle_paragraph || "",
        additional_info: data?.additional_info || "",
      };

      return profileData;
    }
  } catch (error) {
    console.error("Error fetching user profile for userId:", userId, error);
  }
};

export const updateProfile = async (userId: string, profileData: Profile) => {
  try {
    const userDocRef = doc(firestore, "users", userId);

    const updateData: Partial<Profile> = {};

    if (profileData.name) updateData.name = profileData.name;
    if (profileData.birthday) {
      const birthdayDate = new Date(profileData.birthday);
      updateData.birthday = birthdayDate.toISOString();
    }
    if (profileData.gender) updateData.gender = profileData.gender;
    if (profileData.home_address)
      updateData.home_address = profileData.home_address;
    if (profileData.transportations)
      updateData.transportations = profileData.transportations;
    if (profileData.lifestyle_traits)
      updateData.lifestyle_traits = profileData.lifestyle_traits;
    if (profileData.lifestyle_paragraph)
      updateData.lifestyle_paragraph = profileData.lifestyle_paragraph;
    if (profileData.additional_info)
      updateData.additional_info = profileData.additional_info;

    if (Object.keys(updateData).length === 0) {
      console.log("Nothing to update for user:", userId);
      return;
    }

    await setDoc(userDocRef, updateData, { merge: true });

    console.log("Profile updated successfully for userId:", userId);
  } catch (error) {
    console.error("Error updating user profile for userId:", userId, error);
  }
};

export const fetchCategories = async (
  userId: string
): Promise<CategoryAtom[]> => {
  try {
    const categoriesRef = collection(firestore, `users/${userId}/categories`);
    const querySnapshot = await getDocs(categoriesRef);

    const fetchedCategories: CategoryAtom[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const category: CategoryAtom = {
        category: {
          id: doc.id,
          title: data.title || "",
          cost: data.cost || "",
          preference: data.preference || "",
          subcategories: data.subcategories || [],
          vibes: data.vibes || [],
          status: data.status || CategoryStatus.Active,
        },
        results: data.favorite_places
          ? Object.keys(data.favorite_places).map((placeId) => ({
              title: placeId,
              address: data.favorite_places[placeId].address,
              description: data.favorite_places[placeId].why_they_like_it,
              distance: "", // Populate as needed
              time: "", // Populate as needed
              imageSrc: data.favorite_places[placeId].photo_url,
              matchLevel: "", // Populate as needed
              googleMapsLink: "", // Populate as needed
              additionalInfo: "", // Populate as needed
            }))
          : [],
      };

      return category;
    });

    return fetchedCategories;
  } catch (error) {
    console.error("Error fetching user categories for userId:", userId, error);
    return [];
  }
};

interface UpdateTransportationResult {
  transportation: TransportationDTO;
  homeAddress: string;
}

export const updateTransportation = async (
  userId: string,
  result: UpdateTransportationResult
) => {
  console.log("Within DB function, updating transportation for user:", userId);
  console.log("Result:", {
    transportations: result.transportation,
    home_address: result.homeAddress,
  });

  try {
    // Create a reference to the user's document in Firestore
    const userDocRef = doc(firestore, "users", userId);

    // Update the user's transportation data and home address in Firestore
    await updateDoc(userDocRef, {
      transportations: result.transportation,
      home_address: result.homeAddress,
    });

    console.log("Transportation and home address updated successfully.");
  } catch (error) {
    console.error("Error updating transportation for userId:", userId, error);
  }
};

export interface UpdateLifestyleResult {
  lifestyle: string[];
  otherPreferences: string[];
  lifestyleParagraph: string;
}

export const updateLifestyle = async (
  userId: string,
  lifestyleData: UpdateLifestyleResult
) => {
  console.log("Within DB function, updating lifestyle for user:", userId);
  console.log("Lifestyle:", lifestyleData);

  try {
    // Combine the lifestyle and other preferences as a set of preferences
    // Make this into a dictionary with the key being the preference and the value being true if lifestyle, false if other preference
    const combinedPreferences: Record<string, boolean> = {};
    lifestyleData.otherPreferences.forEach((preference) => {
      preference = titleCaseToSnakeCase(preference);
      combinedPreferences[preference] = false;
    });
    lifestyleData.lifestyle.forEach((preference) => {
      preference = titleCaseToSnakeCase(preference);
      combinedPreferences[preference] = true;
    });

    // Create a reference to the user's document in Firestore
    const userDocRef = doc(firestore, "users", userId);

    // Update the user's lifestyle data in Firestore
    await updateDoc(userDocRef, {
      lifestyle_traits: combinedPreferences,
      lifestyle_paragraph: lifestyleData.lifestyleParagraph,
    });

    console.log("Lifestyle updated successfully.");
  } catch (error) {
    console.error("Error updating lifestyle for userId:", userId, error);
  }
};

export const updatePredictedCategories = async (
  userId: string,
  categories: Category[]
) => {
  if (!categories || categories.length === 0) {
    console.error("No categories provided for user:", userId);
    throw Error("No categories provided for user.");
  }

  console.log("__________________________________________________________");
  console.log("Starting updatePredictedCategories function for user:", userId);
  console.log("Full categories object:", categories);
  console.log(Array.isArray(categories));
  console.log("Categories to update:", categories[0]);
  console.log(Array.isArray(categories[0]));
  console.log("__________________________________________________________");

  const categoriesRef = collection(firestore, `users/${userId}/categories`);

  try {
    const batch = writeBatch(firestore);

    // Step 1: Check if the categories subcollection exists by querying documents in it
    const querySnapshot = await getDocs(categoriesRef);

    if (!querySnapshot.empty) {
      // Clear it by deleting all existing documents using a for loop
      for (const doc of querySnapshot.docs) {
        batch.delete(doc.ref);
      }

      console.log("Existing documents deleted for user:", userId);
    } else {
      console.log(
        "Categories subcollection does not exist or is empty for user:",
        userId
      );
    }

    for (const category of categories) {
      const newCategoryRef = doc(categoriesRef); // Automatically generates unique ID for each category
      const categoryData = {
        title: category.title || "",
        cost: category.cost || "",
        preference: category.preference || "",
        subcategories: category.subcategories || [],
        vibes: category.vibes || [],
        status: category.status || "Active", // Default status if not provided
        favorite_places: {}, // Handle favorite_places if provided, default to empty
      };

      batch.set(newCategoryRef, categoryData);
    }

    // Step 3: Commit the batch operations (deletes + sets)
    await batch.commit();
    console.log("Categories successfully replaced for user:", userId);
  } catch (error) {
    console.error("Error updating categories for user:", userId, error);
  }
};
