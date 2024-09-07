import useDrivePicker from "react-google-drive-picker";
import { Button, useToast } from "@chakra-ui/react";
import { isAuthenticToken, userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { authModalState } from "@/atoms/authModalAtom";
import JSZip from "jszip";

const GoogleDriveButton = () => {
  const [openPicker] = useDrivePicker();
  const [userState] = useRecoilState(userAtom);
  const [, setAuthModalState] = useRecoilState(authModalState);
  const toast = useToast();

  useEffect(() => {
    if (!userState.user || !userState.user?.googleAuthToken) {
      console.error("User is not signed in.");
      setAuthModalState({ isOpen: true, mode: "login" });
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [setAuthModalState, userState.user, toast]);

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
      const response = await fetch(
        `/api/fetchGoogleDriveFile?fileId=${fileId}&accessToken=${accessToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Read the ZIP file as a blob
      console.log("Fetching ZIP file...");
      const zipBlob = await response.blob();
      console.log("ZIP file fetched:", zipBlob);

      // Initialize JSZip to handle unzipping
      const zip = new JSZip();
      console.log("Initializing JSZip...");
      const unzippedContent = await zip.loadAsync(zipBlob);
      console.log("Unzipped content:", unzippedContent);

      // Iterate through the unzipped files and find the JSON inside the folder
      const folderName = "Takeout/MyActivity/Maps"; // Change this to your folder inside the ZIP
      const jsonFileName = "MyActivity.json"; // Change this to the JSON file name

      let jsonFileContent = null;

      for (const fileName in unzippedContent.files) {
        console.log("Checking file:", fileName);
        // Check if the file is the target JSON in the specified folder
        if (fileName.includes(`${folderName}/${jsonFileName}`)) {
          console.log(`Found target JSON file: ${fileName}`);
          // Read the file as text (since it's a JSON file)
          jsonFileContent = await unzippedContent.files[fileName].async(
            "string"
          );
          break;
        }
      }

      if (jsonFileContent) {
        // Parse the JSON content
        console.log("Parsing JSON content...");
        const jsonData = JSON.parse(jsonFileContent);
        console.log("Extracted JSON data:", jsonData);
        return jsonData;
      } else {
        console.error(`JSON file ${jsonFileName} not found in the ZIP folder.`);
        throw new Error(
          `JSON file ${jsonFileName} not found in the ZIP folder.`
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
