import { userAtom } from "@/atoms/userAtom";
import { NewUser } from "@/utils/functions/authFunctions";
import {
  VStack,
  Text,
  Button,
  Icon,
  Input,
  InputGroup,
  FormControl,
  FormLabel,
  Box,
  FormHelperText,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaBolt } from "react-icons/fa";
import { useRecoilState } from "recoil";

type AuthRegisterFormProps = {
  handleSubmit: (user: NewUser) => void;
};

const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  handleSubmit,
}: AuthRegisterFormProps) => {
  const [userState] = useRecoilState(userAtom);
  const [newUser, setNewUser] = useState<NewUser>();

  useEffect(() => {
    if (userState?.user) {
      setNewUser({
        uid: userState.user.uid,
        name: userState.user.name,
        email: userState.user.email,
        text: "",
      });
    }
  }, [userState?.user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (newUser) {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (newUser) {
      handleSubmit(newUser);
    }
  };

  return (
    <Box as="form" onSubmit={handleOnSubmit} width="100%" maxW="400px">
      <VStack spacing={4}>
        <Text fontSize="xl">Join the Nested Community</Text>
        <Text mb={4}>
          We're excited to have you on board. Join our community to unlock a
          world of personalized insights and supercharge your next big move.
        </Text>

        <FormControl id="name" isRequired>
          <FormLabel>
            <Icon as={FaUser} mr={2} />
            Full Name
          </FormLabel>
          <InputGroup>
            <Input
              placeholder="Full Name"
              name="name"
              value={newUser?.name || ""}
              onChange={handleChange}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email">
          <FormLabel>
            <Icon as={FaEnvelope} marginRight="2" />
            Email Address
          </FormLabel>
          <InputGroup>
            <Input
              placeholder="Email Address"
              name="email"
              value={newUser?.email || ""}
              isDisabled
            />
          </InputGroup>
          <FormHelperText>Already got this!</FormHelperText>
        </FormControl>

        <FormControl id="goal">
          <FormLabel>
            <Icon as={FaBolt} marginRight="2" />
            How can Nested help you achieve your next goal?
          </FormLabel>
          <InputGroup>
            <Input
              placeholder="Share your thoughts with us"
              name="text"
              value={newUser?.text || ""}
              onChange={handleChange}
            />
          </InputGroup>
        </FormControl>

        <Button type="submit" size="lg" width="full">
          Join Now
        </Button>
      </VStack>
    </Box>
  );
};

export default AuthRegisterForm;
