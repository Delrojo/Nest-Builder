import useDrivePicker from "react-google-drive-picker";
import { Button, useToast } from "@chakra-ui/react";
import { isAuthenticToken, userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import JSZip from "jszip";

type LocationInfo = {
  name: string;
  url: string;
  source: string;
};

type Activity = {
  header: string;
  title: string;
  titleUrl?: string;
  time: string;
  locationInfos?: LocationInfo[];
};

interface GoogleDriveButtonProps {
  handleUpload: (fileUri: string) => void;
}

const GoogleDriveButton = ({ handleUpload }: GoogleDriveButtonProps) => {
  const [openPicker] = useDrivePicker();
  const [userState] = useRecoilState(userAtom);
  const toast = useToast();

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  /**
   * Function to open the Google Drive Picker
   */
  const handleOpenPicker = () => {
    try {
      let token = isAuthenticToken(userState.user?.googleAuthToken)
        ? (userState.user?.googleAuthToken as string)
        : "";
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID ?? "";
      const developerKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY ?? "";

      console.log("Opening Google Drive Picker with token:", token);

      openPicker({
        clientId: token.length === 0 ? clientId : "",
        developerKey: token.length === 0 ? developerKey : "",
        viewId: "DOCS",
        token,
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: false,
        callbackFunction: (data) => {
          if (data.action === "cancel") {
            console.log("User clicked cancel/close button");
            return;
          }

          if (data.action === "picked") {
            console.log("Fetching Google Drive file with ID:", data.docs[0].id);
            fetchGoogleDriveFile(data.docs[0].id, token);
            return;
          }

          if (data.action === "authFailed") {
            console.error("Google Drive authentication failed.");
            toast({
              title: "Authentication failed",
              description: "Please authenticate with Google to continue.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }

          if (data.action === "error") {
            console.error("Google Drive Picker error:", data.action);
            toast({
              title: "Error",
              description:
                "An error occurred while opening the Google Drive Picker.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
      });
    } catch (error) {
      console.error("Error opening Google Drive Picker:", error);
      toast({
        title: "Error",
        description: "An error occurred while opening the Google Drive Picker.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /**
   * Function to fetch the Google Drive file using API call
   * Then it handles the data cleaning and uploads the results to GeminiFileManager
   * @param fileId - The ID of the Google Drive file
   * @param accessToken - The access token for Google Drive API
   */
  async function fetchGoogleDriveFile(fileId: string, accessToken: string) {
    console.log("Fetching Google Drive file with ID:", fileId);
    try {
      // Fetch the file as a blob (since it's a ZIP file)
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/zip", // Ensure you're expecting a ZIP file
          },
        }
      );

      console.log("Got a response in google drive file fetch", response);
      validateResponse(response)
        .then((jsonFileContent: string | undefined) => {
          if (jsonFileContent === undefined) {
            throw new Error("JSON content is null");
          }
          console.log("JSON content is valid:", jsonFileContent);
          const jsonData = JSON.parse(jsonFileContent);
          console.log("Cleaning and uploading the data...");
          handleCleanDataAndUploadResults(jsonData);
        })
        .catch((error: any) => {
          console.error("Error validating the response:", error);
          toast({
            title: "Error",
            description: "An error occurred while parsing the JSON content.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.error("Error fetching Google Drive file:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching the Google Drive file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  /**
   * Validate the response from Google Drive
   * @param response - The response object from Google Drive API call
   * @returns The JSON content of the file or undefined
   * @throws Error if the response is not OK or JSON file is not found
   */
  const validateResponse = async (response: Response) => {
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    const zipBlob = await response.blob();
    const zip = new JSZip();
    const unzippedContent = await zip.loadAsync(zipBlob);

    const jsonFilePath = Object.keys(unzippedContent.files).find((fileName) =>
      fileName.includes("MyActivity.json")
    );

    if (!jsonFilePath) {
      throw new Error(`JSON file ${jsonFilePath} not found in the ZIP folder.`);
    }

    for (const fileName in unzippedContent.files) {
      if (fileName.includes(`MyActivity.json`)) {
        console.log(`Found target JSON file: ${fileName}`);
        return unzippedContent.files[fileName].async("string");
      }
    }
  };

  /**
   * Cleans the data, creates a text file, uploads it to Gemini, and then calls the callback to
   * the intro page to run AI predictions
   * @param jsonData - The raw JSON data from Google Takeout
   */
  const handleCleanDataAndUploadResults = async (jsonData: any) => {
    console.log("In the handleCleanDataAndUploadResults function");
    try {
      const dataWithinLimit = cleanAndLimitData(jsonData);
      const file = createFileFromJson(dataWithinLimit);
      const fileUri = await uploadFileToGemini(file);

      if (!fileUri) {
        console.error("File URI is undefined after upload");
        throw new Error("File URI is undefined after upload");
      }

      handleUpload(fileUri);
    } catch (error) {
      console.error("Error in handleCleanDataAndUploadResults:", error);
    }
  };

  /**
   * Handler function to clean the data
   * @param jsonData
   * @returns
   */
  const cleanAndLimitData = (jsonData: any): Activity[] => {
    console.log("In the cleanAndLimitData function");
    // Check if jsonData is an array
    if (!Array.isArray(jsonData)) {
      console.error("Invalid data: jsonData is not an array");
      return [];
    }
    const cleanedData = cleanDataForAIPrediction(jsonData);
    return ensureDataWithinLimit(cleanedData);
  };

  /**
   * Clean the data into the Activity JSON format for consistency and to remove unnecessary data
   * @param data - The raw JSON data from Google Takeout
   * @returns The cleaned data in Activity JSON format
   */
  function cleanDataForAIPrediction(data: Activity[]): Activity[] {
    console.log("In the cleanDataForAIPrediction function");
    return data.map((activity) => {
      const {
        header, // Activity type (e.g., "Maps")
        title, // Specific user action (e.g., "Searched for X")
        titleUrl, // URL of the activity, if available
        time, // Timestamp of the activity
        locationInfos, // Location details if available
      } = activity;

      return {
        header,
        title,
        titleUrl,
        time,
        locationInfos,
      };
    });
  }

  /**
   * Cuts off the data to fit within the specified limit of tokens
   * (default is 1,000,000 tokens)
   * @param data - The cleaned data to be truncated
   * @param limit - The maximum token limit for the data
   * @returns
   */
  function ensureDataWithinLimit(
    data: Activity[],
    limit: number = 1_000_000
  ): Activity[] {
    console.log("In the ensureDataWithinLimit function");
    let jsonString = JSON.stringify(data);
    if (jsonString.length <= limit) {
      return data;
    }

    // Truncate data to fit within the limit
    let truncatedData = [];
    let currentSize = 0;

    for (let i = 0; i < data.length; i++) {
      const activity = data[i];
      const activityString = JSON.stringify(activity);
      if (currentSize + activityString.length > limit) {
        break;
      }
      truncatedData.push(activity);
      currentSize += activityString.length;
    }

    console.log("Successfully truncated data to fit within the limit.");
    return truncatedData;
  }

  /**
   * Creates a file from the JSON data
   * @param data
   * @returns
   */
  const createFileFromJson = (data: Activity[]): File => {
    console.log("In the createFileFromJson function");
    const jsonString = JSON.stringify(data);
    console.log("Uploading file:", jsonString);

    const blob = new Blob([jsonString], { type: "text/plain" });
    console.log("Blob created:", blob);

    const file = new File([blob], "takeoutData.txt", {
      type: "text/plain",
    });
    console.log("File object created:", file);
    return file;
  };

  /**
   * Uploads the file to GeminiFileManager
   * @param file  The file to be uploaded
   * @returns
   */
  const uploadFileToGemini = async (
    file: File
  ): Promise<string | undefined> => {
    console.log("In the uploadFileToGemini function");
    const formData = new FormData();
    formData.append("file", file); // Append the selected file

    try {
      const response = await fetch("/api/uploadTakeoutData", {
        method: "POST",
        body: formData, // Send the form data, including the file
      });

      if (response.ok) {
        console.log("File uploaded successfully.");
        const data = await response.json();
        console.log("File URI:", data.fileUri);
        return data.fileUri;
      } else {
        console.error("Failed to upload file. Status:", response.status);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    console.log("Failed to upload file.");
    return undefined;
  };

  return (
    <Button
      variant="solid"
      w="full"
      loadingText="Processing..."
      onClick={handleOpenPicker}
    >
      Upload Google Takeout Data
    </Button>
  );
};

export default GoogleDriveButton;
