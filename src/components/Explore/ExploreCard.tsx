import {
  Box,
  Image,
  Text,
  Link,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import React from "react";

export interface PlacesModel {
  title: string;
  address: string;
  distance: string;
  time: string;
  imageSrc: string;
  matchLevel: string;
  googleMapsLink: string;
  description: string;
}

type ExploreCardProps = {
  place: PlacesModel;
};

const ExploreCard: React.FC<ExploreCardProps> = ({ place }) => {
  const cardBg = useColorModeValue("primary.100", "primary.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      backgroundColor={cardBg}
      shadow="md"
      maxW={"sm"}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {place.title}
      </Text>
      <Text fontSize="sm" color={textColor}>
        {place.address} &bull; {place.distance} &bull; {place.time}
      </Text>

      <Image
        src={place.imageSrc}
        alt={place.title}
        borderRadius="md"
        mt={4}
        mb={4}
        width="100%"
        height="auto"
      />

      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          {place.matchLevel} Match Level
        </Text>
        <Link
          href={place.googleMapsLink}
          color="teal.500"
          fontSize="sm"
          fontWeight="bold"
          isExternal
        >
          Open in Google Maps
        </Link>
      </Flex>

      <Text fontSize="sm" color={textColor} mb={4}>
        {place.description}
      </Text>

      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text fontSize="xs" color={textColor} mr={1}>
            Generated with
          </Text>
          <Link href="#" color="teal.500" fontSize="xs" fontWeight="bold">
            Gemini
          </Link>
          <Icon as={InfoOutlineIcon} color="gray.400" ml={1} boxSize={3} />
        </Flex>
        <Icon as={InfoOutlineIcon} color="green.500" boxSize={4} />
      </Flex>
    </Box>
  );
};

export default ExploreCard;
