import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Icon,
  SimpleGrid,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaCheck, FaUserShield } from "react-icons/fa";
import {
  moveUserToWhitelist,
  getAllGraylistUsers,
} from "@/utils/functions/authFunctions";
import { NewUser } from "@/utils/functions/authFunctions";

const GraylistUsers: React.FC = () => {
  const [graylistUsers, setGraylistUsers] = useState<NewUser[]>([]);
  const cardBg = useColorModeValue("primary.100", "primary.800");

  const fetchGraylistUsers = async () => {
    const users = await getAllGraylistUsers();
    if (users) {
      setGraylistUsers(users);
    }
  };

  useEffect(() => {
    fetchGraylistUsers();
  }, []);

  const handleWhitelist = async (user: NewUser) => {
    await moveUserToWhitelist(user);
    fetchGraylistUsers();
  };

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
      {graylistUsers.map((user) => (
        <Card
          key={user.email}
          variant="outline"
          boxShadow="md"
          borderRadius="md"
          bg={cardBg}
        >
          <VStack spacing={4} align="center" p={4}>
            <Avatar name={user.name} icon={<Icon as={FaUserShield} />} />
            <Box flex="1">
              <CardHeader p={0} pb={2}>
                <Text fontSize="lg" fontWeight="bold">
                  {user.name}
                </Text>
                <Text fontSize="sm">{user.email}</Text>
              </CardHeader>
              {user.text && (
                <CardBody p={0}>
                  <Text fontSize="sm">{user.text}</Text>
                </CardBody>
              )}
            </Box>
            <Button
              leftIcon={<FaCheck />}
              variant={"ghost"}
              onClick={() => handleWhitelist(user)}
            >
              Whitelist
            </Button>
          </VStack>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default GraylistUsers;
