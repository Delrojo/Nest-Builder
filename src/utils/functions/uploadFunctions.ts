import { Category } from "@/atoms/categoryAtom";
import { Transportation } from "../../components/Onboarding/Transportation";
import { Preferences } from "@/components/Onboarding/Lifestyle";

export interface Profile {
  homeAddress: string;
  transportation: Transportation; //dictionary of transportation methods
  categories: Category[]; //array of categories
  socialPreferences: Preferences; //dictionary of social preferences
}

export const baseInstruction = `
Act as a data scientist with expertise in Google APIs, particularly Google Maps and Places. Your primary role is to analyze and interpret user search data to create a profile focusing on transportation habits. Adopt a supportive, trustworthy, and approachable demeanor, using your strong analytical capabilities and understanding of user behavior to deliver precise results.
`;

export const taskInstructions = `
1. Extract and read the JSON data from the uploaded .txt file silently.
2. Analyze the JSON data to identify key search terms and locations silently.
3. Access Google Maps & Places APIs for additional insights into the search data silently.
4. Analyze patterns in the search data to deduce lifestyle preferences and routine activities of the user silently.
5. Generate and output a JSON structure with preferences of the user based on the analysis. The output should strictly adhere to the specified JSON format without additional commentary.
`;

export function createTransportationInstruction() {
  return `
    {
      "transportation": {
        "walking": {
          "selected": "boolean", // Boolean value indicating if this is the preferred choice (true) or not (false). If this is set to false, radius will be null
          "radius": "number | null" // Numeric value (in miles) representing the comfortable travel radius when using this type. This is null if selected is false.
        },
        "biking": {
          "selected": "boolean",
          "radius": "number | null"
        },
        "driving": {
          "selected": "boolean",
          "radius": "number | null"
        },
        "bus": {
          "selected": "boolean",
          "radius": "number | null"
        },
        "train": {
          "selected": "boolean",
          "radius": "number | null"
        }
      },
      "homeAddress": "full Address", // The user's home address in full format (street, city, state, zip code) based on logical deductions from the data
    }
  `;
}

export function createCategoriesInstruction() {
  return `
    "categories": [
      {
        "title": "string", // The category name, such as 'restaurant', 'entertainment', or 'shopping', etc.
        "preference": "string", // A narrative in the first-person that describes the user's preferences in this category, based on historical data and user inputs. Includes preferences like brands, visit frequency, spending habits, and favored times.
        "vibes": ["string"], // Up to 6 adjectives describing the environment the user prefers for this category in Title Case
        "subcategories": ["string"], // Related subcategories within the main category, e.g., types of cuisines or forms of entertainment.
        "cost": "string", // Text string representing the user's preferred cost range for this category represented by one of these options '$', '$$', $$$, $$$$)
        "confidence": "number" // The system's confidence level in its recommendations, on a scale from 0 to 1.
      }
      // More categories can be added in this format
    ]
  `;
}

export function createLifestylePreferencesInstruction() {
  return `
    {
      "lifestyle": [
        {
          [key: string]: boolean // Descriptors focusing on lifestyle preferences important to the user, such as 'Accessible', 'Safe', 'Affordable', 'Quiet'. These are not categories or types of location or transportation, but rather adjectives describing the place or experiences the user prefers
          "description": "string" // Details the importance and relevance of this preference in the user's life.
        }
        // Additional preferences can be added as needed.
      ],
       "otherPreferences": {
        [key: string]: boolean // Extends the list to include 20 more general lifestyle preferences, such as 'Family Friendly', 'Convenient', 'Safety', 'Cleanliness', 'Accessibility', 'Affordability', 'Quietness', 'Community', 'Amenities', 'Green Spaces', 'Quiet'.
      },      
      "lifestyleParagraph": "string" // A narrative in the first-person that describes the user's daily activities, community involvement, social interactions, and overall lifestyle preferences. This should offer a comprehensive, personal view without repeating the specifics of social preferences.
    }
  `;
}
