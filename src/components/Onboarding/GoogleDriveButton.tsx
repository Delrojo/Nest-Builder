import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { Button } from "@chakra-ui/react";

function GoogleDriveButton() {
  const user = useRecoilValue(userAtom);

  const fetchDriveFiles = async () => {
    if (user.user && user.user?.googleAuthToken) {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          headers: {
            Authorization: `Bearer ${user.user.googleAuthToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } else {
      console.error("No Google Auth Token found");
    }
  };

  return (
    <Button
      variant="solid"
      w="full"
      loadingText="Processing..."
      onClick={fetchDriveFiles}
    >
      Upload Google Takeout Data
    </Button>
  );
}

export default GoogleDriveButton;
