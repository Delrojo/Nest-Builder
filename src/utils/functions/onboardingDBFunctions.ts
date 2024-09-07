import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { LifestyleDTO, Profile } from "@/atoms/onboardingProfileAtom";
import { Category, CategoryAtom, CategoryStatus } from "@/atoms/categoryAtom";
import { TransportationDTO } from "@/atoms/onboardingProfileAtom";

export const fetchProfile = async (userId: string, userName: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();

      const profileData: Profile = {
        name: data?.name || "",
        birthday: data?.birthday
          ? data.birthday.toDate().toISOString().split("T")[0]
          : "",
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
    // // Create a reference to the user's document in Firestore
    // const userDocRef = doc(firestore, "users", userId);

    // // Update the user's transportation data and home address in Firestore
    // await updateDoc(userDocRef, {
    //   transportations: result.transportation,
    //   home_address: result.homeAddress,
    // });

    console.log("MOCKING updateTransportation DB function until it works.");

    console.log("Transportation and home address updated successfully.");
  } catch (error) {
    console.error("Error updating transportation for userId:", userId, error);
  }
};

export interface UpdateLifestyleResult {
  lifestyle: LifestyleDTO;
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
    // Extract keys from lifestyle object
    const lifestyleKeys = Object.keys(lifestyleData.lifestyle);

    // Combine with otherPreferences and remove duplicates
    const combinedKeys = Array.from(
      new Set([...lifestyleKeys, ...lifestyleData.otherPreferences])
    );

    // Set otherPreferences values to false
    const combinedPreferences = combinedKeys.reduce((acc, key) => {
      acc[key] = lifestyleData.lifestyle[key] ?? false;
      return acc;
    }, {} as LifestyleDTO);

    console.log("Combined Preferences:", combinedPreferences);
    console.log("Lifestyle Paragraph:", lifestyleData.lifestyleParagraph);

    // // Create a reference to the user's document in Firestore
    // const userDocRef = doc(firestore, "users", userId);

    // // Update the user's lifestyle data in Firestore
    // await updateDoc(userDocRef, {
    //   lifestyle_traits: combinedPreferences,
    //   lifestyle_paragraph: lifestyleData.lifestyleParagraph,
    // });

    console.log("MOCKING updateLifestyle DB function until it works.");

    console.log("Lifestyle updated successfully.");
  } catch (error) {
    console.error("Error updating lifestyle for userId:", userId, error);
  }
};

export const updateCategories = async (
  userId: string,
  categories: Category[]
) => {
  console.log("Within DB function, updating categories for user:", userId);
  console.log("Categories:", categories);

  try {
    // // Create a reference to the user's document in Firestore
    // const userDocRef = doc(firestore, "users", userId);

    // // Update the user's categories data in Firestore
    // await updateDoc(userDocRef, {
    //   categories: categories,
    // });

    console.log("MOCKING updateCategories DB function until it works.");

    console.log("Categories updated successfully.");
  } catch (error) {
    console.error("Error updating categories for userId:", userId, error);
  }
};
