import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import AuthInitialSignIn from "./AuthInitialSignIn";
import AuthWelcomeBack from "./AuthWelcomeBack";
import AuthNextSteps from "./AuthNextSteps";
import AuthRegisterForm from "./AuthRegisterForm";
import { useAuth } from "@/utils/hooks/useAuth";
import { userAtom } from "@/atoms/userAtom";
import { UserStatus } from "@/atoms/userAtom";
import { addUserToGraylist, NewUser } from "@/utils/functions/authFunctions";
import AuthAdminWelcome from "./AuthAdminWelcome";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [userState, setUserState] = useRecoilState(userAtom);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { user, loading, googleSignIn, logOut } = useAuth();

  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleClose = () => {
    if (userState.user === null) {
      handleConfirmClose();
    } else {
      setConfirmOpen(true);
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    onClose();
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    setUserState((prevState) => {
      return {
        user: null,
      };
    });
    logOut();
  };

  const handleNewUserSubmit = useCallback(
    (user: NewUser) => {
      addUserToGraylist(user);
      setFormSubmitted(true);
      if (userState.user) {
        setUserState((prevState) => {
          if (prevState.user) {
            return {
              user: {
                ...prevState.user,
                status: UserStatus.pending,
                uid: prevState.user.uid || "", // Ensure uid is always defined
                name: prevState.user.name || "",
                email: prevState.user.email || "",
                photoURL: prevState.user.photoURL || "",
                googleAuthToken: prevState.user.googleAuthToken || null,
              },
            };
          }
          return prevState;
        });
      }
    },
    [userState.user, setUserState]
  );

  const onClose = () => {
    setModalState({ ...modalState, isOpen: false });
    setFormSubmitted(false);
  };

  const renderContent = useMemo(() => {
    if (userState.user === null) {
      return <AuthInitialSignIn />;
    } else if (userState.user?.status === UserStatus.whitelist) {
      return <AuthWelcomeBack />;
    } else if (userState.user?.status === UserStatus.admin) {
      return <AuthAdminWelcome />;
    } else if (userState.user?.status === UserStatus.new) {
      return <AuthRegisterForm handleSubmit={handleNewUserSubmit} />;
    } else if (userState.user?.status === UserStatus.pending) {
      return <AuthNextSteps />;
    } else {
      return <Text>Error loading content, please reload!</Text>;
    }
  }, [userState, handleNewUserSubmit]);

  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton onClick={handleClose} />
          <ModalBody>
            <VStack spacing={4} pb={"1rem"}>
              {renderContent}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton onClick={() => setConfirmOpen(false)} />
          <ModalBody>
            Are you sure you want to log out or do you just want to close the
            modal?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleConfirmClose} size="sm" mr={3}>
              Close Modal
            </Button>
            <Button onClick={handleConfirmLogout} size="sm" variant={"outline"}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
