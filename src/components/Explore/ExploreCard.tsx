import {
  Box,
  Image,
  Text,
  Link,
  Icon,
  useColorModeValue,
  HStack,
  VStack,
  Heading,
  Spacer,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { FaClock, FaRuler, FaMapMarkerAlt, FaEgg } from "react-icons/fa";

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
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const highlightColor = useColorModeValue("primary.500", "primary.400");
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      backgroundColor={cardBg}
      shadow="md"
      maxW={"sm"}
    >
      <Heading fontSize="lg" mb={2} color={textColor}>
        {place.title}
      </Heading>

      <HStack spacing={1} align="center" mb={4}>
        <Icon as={FaMapMarkerAlt} color={highlightColor} />
        <Text fontSize="sm" color={textColor} flex="1">
          {place.address}
        </Text>
        <Spacer />
        <Link
          href={place.googleMapsLink}
          color={highlightColor}
          fontSize="xs"
          fontWeight="bold"
          isExternal
        >
          Open in Google Maps
        </Link>
      </HStack>

      <Image
        src={place.imageSrc}
        alt={place.title}
        borderRadius="md"
        mb={4}
        width="100%"
        height="auto"
      />

      <HStack justifyContent="space-between" mb={4}>
        <HStack spacing={2}>
          <Icon as={FaRuler} color={iconColor} />
          <Text fontSize="sm" color={textColor}>
            {place.distance}
          </Text>
        </HStack>
        <HStack spacing={2}>
          <Icon as={FaClock} color={iconColor} />
          <Text fontSize="sm" color={textColor}>
            {place.time}
          </Text>
        </HStack>
      </HStack>

      <VStack align="start" spacing={2}>
        <Box>
          <Text fontSize="sm" color={textColor} display="inline">
            {isExpanded
              ? place.description
              : `${place.description.substring(0, 80)}...`}
          </Text>
          <Link
            onClick={toggleDescription}
            variant="link"
            color={highlightColor}
            display="inline"
            ml={1}
          >
            <Text fontSize={"xs"} display="inline">
              {isExpanded ? "See Less" : "See More"}
            </Text>
          </Link>
        </Box>
        <Flex direction="row" justifyContent="space-between" w="100%">
          <HStack spacing={1}>
            <Text fontSize="LG" color={highlightColor}>
              {place.matchLevel} Match Level
            </Text>
            <Icon as={InfoOutlineIcon} color={iconColor} ml={1} boxSize={3} />
          </HStack>

          <IconButton
            variant="ghost"
            icon={<Icon as={FaEgg} />}
            color={highlightColor}
            boxSize={4}
            aria-label="Save place"
            height={"2.5rem"}
          />
        </Flex>
      </VStack>
    </Box>
  );
};

export default ExploreCard;
