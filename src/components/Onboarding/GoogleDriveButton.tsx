import useDrivePicker from "react-google-drive-picker";
import { Button, useToast } from "@chakra-ui/react";
import { isAuthenticToken, userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
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
  handleUpload: (jsonString: string) => void;
}

const GoogleDriveButton = ({ handleUpload }: GoogleDriveButtonProps) => {
  const [openPicker] = useDrivePicker();
  const [userState] = useRecoilState(userAtom);
  const [, setAuthModalState] = useRecoilState(authModalState);
  const toast = useToast();

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

  async function fetchGoogleDriveFile(fileId: string, accessToken: string) {
    try {
      console.log("Fetching Google Drive file with ID:", fileId);

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

      if (!response.ok) {
        throw new Error(`Error fetching file: ${response.statusText}`);
      }
      const zipBlob = await response.blob();
      const zip = new JSZip();
      const unzippedContent = await zip.loadAsync(zipBlob);

      const jsonFilePath = Object.keys(unzippedContent.files).find((fileName) =>
        fileName.includes("MyActivity.json")
      );
      let jsonFileContent = null;
      for (const fileName in unzippedContent.files) {
        if (fileName.includes(`MyActivity.json`)) {
          console.log(`Found target JSON file: ${fileName}`);
          jsonFileContent = await unzippedContent.files[fileName].async(
            "string"
          );
          break;
        }
      }

      if (jsonFileContent) {
        console.log("Parsing JSON content...");
        const jsonData = JSON.parse(jsonFileContent);
        handleCleanDataAndUploadResults(jsonData);
        return jsonData;
      } else {
        console.error(`JSON file ${jsonFilePath} not found in the ZIP folder.`);
        throw new Error(
          `JSON file ${jsonFilePath} not found in the ZIP folder.`
        );
      }
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

  const handleCleanDataAndUploadResults = async (jsonData: any) => {
    function cleanDataForAIPrediction(data: Activity[]): Activity[] {
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

    function ensureDataWithinLimit(
      data: Activity[],
      limit: number = 1_000_000
    ): Activity[] {
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

      return truncatedData;
    }

    const cleanedData = cleanDataForAIPrediction(jsonData);
    const dataWithinLimit = ensureDataWithinLimit(cleanedData);

    const jsonString = JSON.stringify(dataWithinLimit);
    handleUpload(jsonString);
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
