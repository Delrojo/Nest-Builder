import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEgg } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { useAuth } from "@/utils/hooks/useAuth";
import { FaCircleArrowLeft, FaGear } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const UserMenu = () => {
  const [userState, setUserState] = useRecoilState(userAtom);
  const { logOut } = useAuth();

  // Define color modes
  const menuBg = useColorModeValue("background.light", "background.dark");
  const menuItemBg = useColorModeValue("primary.100", "primary.800");
  const iconColor = useColorModeValue("primary.500", "primary.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const router = useRouter();
  // Hotkeys for navigation
  const navigateToMyNest = useCallback(() => {
    router.push("/mynest");
  }, [router]);

  const navigateToSettings = useCallback(() => {
    router.push("/onboarding");
  }, [router]);

  // Bind hotkeys
  useHotkeys("ctrl+m", navigateToMyNest, [navigateToMyNest]);
  useHotkeys("ctrl+s", navigateToSettings, [navigateToSettings]);
  useHotkeys("ctrl+l", logOut, [logOut]);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <Avatar
          size="sm"
          src={userState.user?.photoURL}
          name={userState.user?.name}
          bg="primary.500"
        />
      </MenuButton>
      <MenuList backgroundColor={menuBg} borderColor={borderColor}>
        <Box px={4} py={3}>
          <Text fontWeight="bold" mb={1}>
            {" "}
            {userState.user?.name}
          </Text>
          <Text fontSize="sm">{userState.user?.email}</Text>
        </Box>
        <MenuDivider />
        <MenuItem
          icon={<Icon as={FaEgg} color={iconColor} />}
          command="⌘M"
          bg={menuBg}
          _hover={{ bg: menuItemBg }}
          onClick={navigateToMyNest}
        >
          My Nest
        </MenuItem>
        <MenuItem
          icon={<Icon as={FaGear} color={iconColor} />}
          command="⌘S"
          bg={menuBg}
          _hover={{ bg: menuItemBg }}
          onClick={navigateToSettings}
        >
          My Profile
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<Icon as={FaCircleArrowLeft} color={iconColor} />}
          command="⌘L"
          bg={menuBg}
          _hover={{ bg: menuItemBg }}
          onClick={logOut}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
