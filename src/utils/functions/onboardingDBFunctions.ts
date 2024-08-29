import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { Profile } from "@/atoms/onboardingProfileAtom";
import { CategoryAtom, CategoryStatus } from "@/atoms/categoryAtom";

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
