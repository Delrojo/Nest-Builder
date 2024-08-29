import {
  Box,
  Image,
  Text,
  Link,
  Icon,
  useColorModeValue,
  HStack,
  Heading,
  IconButton,
  Flex,
  VStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
  additionalInfo: string;
}

type ExploreCardProps = {
  place: PlacesModel;
};

const ExploreCard: React.FC<ExploreCardProps> = ({ place }) => {
  const cardBg = useColorModeValue("primary.100", "primary.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const iconColor = useColorModeValue("gray.500", "gray.300");
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
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={2} align="stretch" flex="1">
        {/* Title */}
        <Heading fontSize="xl" color={textColor}>
          {place.title}
        </Heading>

        {/* Address and Google Maps Link */}
        <HStack spacing={1} align="center" justifyContent={"space-between"}>
          <HStack spacing={1}>
            <Icon as={FaMapMarkerAlt} color={highlightColor} />
            <Text fontSize="xs" color={textColor} mr={2}>
              {place.address}
            </Text>
          </HStack>
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

        {/* Image */}
        <Image
          src={place.imageSrc}
          alt={place.title}
          borderRadius="md"
          width="100%"
          height="auto"
        />

        {/* Distance and Time */}
        <HStack justifyContent="space-between">
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

        <Box mt={1} whiteSpace="wrap">
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

        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={1}>
            <Text fontSize="lg" color={highlightColor}>
              {place.matchLevel} Match Level
            </Text>
            <Popover>
              <PopoverTrigger>
                <Box height={"100%"}>
                  <Icon
                    as={InfoOutlineIcon}
                    color={iconColor}
                    ml={1}
                    boxSize={3}
                    cursor="pointer"
                  />
                </Box>
              </PopoverTrigger>
              <PopoverContent backgroundColor={cardBg}>
                <PopoverArrow bg={cardBg} />
                <PopoverBody>
                  <Text fontSize="sm">{place.additionalInfo}</Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>

          <IconButton
            variant="ghost"
            icon={<Icon as={FaEgg} />}
            color={highlightColor}
            borderRadius={"full"}
            aria-label="Save place"
            height={"2rem"}
            width={"2rem"}
            minW={0}
          />
        </Flex>
      </VStack>
    </Box>
  );
};

export default ExploreCard;
