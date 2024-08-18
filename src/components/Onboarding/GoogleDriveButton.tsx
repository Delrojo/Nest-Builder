import useDrivePicker from "react-google-drive-picker";
import { Button } from "@chakra-ui/react";
import { userAtom } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { authModalState } from "@/atoms/authModalAtom";

const GoogleDriveButton = () => {
  const [openPicker] = useDrivePicker();
  const [userState] = useRecoilState(userAtom);
  const [, setAuthModalState] = useRecoilState(authModalState);

  useEffect(() => {
    if (!userState.user) {
      console.error("User is not signed in.");
      setAuthModalState({ isOpen: true, mode: "login" });
    }
    if (!userState.user?.googleAuthToken) {
      console.error("User has not authenticated with Google.");
      setAuthModalState({ isOpen: true, mode: "login" });
    }
  }, [setAuthModalState, userState.user]);

  const handleOpenPicker = () => {
    openPicker({
      clientId: "xxxxxxxxxxxxxxxxx",
      developerKey: "xxxxxxxxxxxx",
      viewId: "DOCS",
      token: userState.user?.googleAuthToken ?? "",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);
      },
    });
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
