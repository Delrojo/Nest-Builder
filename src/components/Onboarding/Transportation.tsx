import {
  Box,
  Card,
  Checkbox,
  Flex,
  Heading,
  Text,
  Stack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  createCircles,
  goToAddress,
} from "@/utils/functions/transportationFunctions";
import { BiTargetLock } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { onboardingProfileAtom } from "@/atoms/onboardingProfileAtom";

export type TransportationMethod = {
  selected: boolean;
  radius: number;
};

export type Transportation = {
  walking?: TransportationMethod;
  biking?: TransportationMethod;
  driving?: TransportationMethod;
  bus?: TransportationMethod;
  train?: TransportationMethod;
};

const Transportation: React.FC = () => {
  const bgColor = useColorModeValue("primary.100", "primary.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const [onboardingProfile, setOnboardingProfile] = useRecoilState(
    onboardingProfileAtom
  );
  const [homeAddress, setHomeAddress] = useState<string>(
    onboardingProfile.home_address || "1 Microsoft Way, Redmond, WA 98052"
  );

  const [geocodeLocation, setGeocodeLocation] =
    useState<google.maps.LatLng | null>(null);

  const sliderSettings: Record<
    keyof Transportation,
    { min: number; max: number; step: number }
  > = {
    walking: { min: 0, max: 5, step: 0.1 },
    biking: { min: 0, max: 20, step: 0.5 },
    driving: { min: 0, max: 100, step: 1 },
    bus: { min: 0, max: 50, step: 1 },
    train: { min: 0, max: 200, step: 5 },
  };

  const [transportation, setTransportation] = useState<Transportation>(
    onboardingProfile.transportations || {}
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const method = event.target.name as keyof Transportation;
    setTransportation({
      ...transportation,
      [method]: {
        ...transportation[method],
        selected: event.target.checked,
      },
    });
  };

  const handleSliderChange = (method: keyof Transportation, value: number) => {
    setTransportation({
      ...transportation,
      [method]: {
        ...transportation[method],
        radius: value,
      },
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 37.422, lng: -122.084 },
        zoom: 13,
        mapId: "transportation",
      };

      mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);
      const gAutocomplete = new google.maps.places.Autocomplete(
        autocompleteRef.current as HTMLInputElement
      );
      if (autocompleteRef.current) {
        autocompleteRef.current.value = homeAddress;
      }
      setAutoComplete(gAutocomplete);
      goToAddress(homeAddress, setGeocodeLocation, mapInstance);
    }
  }, [homeAddress]);

  useEffect(() => {
    if (autoComplete && mapInstance.current) {
      autoComplete.setFields(["formatted_address", "geometry", "name"]);
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        setHomeAddress(place.formatted_address as string);
        if (!place.geometry) {
          return;
        }
        const location = place.geometry.location;
        if (location) {
          setGeocodeLocation(location as google.maps.LatLng);
          mapInstance.current?.setCenter(location as google.maps.LatLng);
        }
      });
    }
  }, [autoComplete, mapInstance]);

  useEffect(() => {
    createCircles(
      mapInstance,
      circlesRef,
      markersRef,
      geocodeLocation,
      transportation
    );
  }, [geocodeLocation, transportation]);

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        How do you like to get around?
      </Heading>
      <Text fontSize="md" mt={2} mb={4} textAlign="center">
        Select the transportation methods you most use and how far you&apos;re
        willing to travel with each method.
      </Text>
      <Flex
        direction={{ base: "column", lg: "row" }}
        wrap="wrap"
        gap={4}
        m={4}
        maxWidth="75rem"
        width="100%"
        h={"100%"}
      >
        <Flex direction={"column"} align="center" gap={4}>
          <HStack spacing={4} width={"full"}>
            <InputGroup w={"full"}>
              <InputLeftElement pointerEvents="none" h={"full"}>
                <Icon as={FaHome} color="gray.300" />
              </InputLeftElement>

              <Input
                size="lg"
                width={"full"}
                placeholder="Where to center your search"
                ref={autocompleteRef}
              />
            </InputGroup>
            <IconButton
              aria-label="Center on Location"
              icon={<BiTargetLock size={"1.5rem"} />}
              width={"fit-content"}
              p={"1rem"}
              onClick={() =>
                goToAddress(homeAddress, setGeocodeLocation, mapInstance)
              }
            />
          </HStack>
          <Card size="sm" flex="1" p={6} borderRadius="md" bg={bgColor}>
            <Heading as="h2" size="md" textAlign="start">
              Transportation Methods
            </Heading>
            <Text fontSize="sm" mt={1} textAlign="start">
              We&apos;ll use this information to help find you the best places
              to visit.
            </Text>
            <Stack spacing={4} mt={4}>
              {Object.entries(transportation).map(
                ([method, { selected, radius }]) => {
                  const transportationMethod =
                    method as keyof typeof transportation;
                  const { min, max, step } =
                    sliderSettings[transportationMethod];

                  return (
                    <Flex
                      key={method}
                      align="center"
                      width="100%"
                      gap={8}
                      display="grid"
                      gridTemplateColumns="5rem 1fr auto" // Adjust the width as needed
                    >
                      <Checkbox
                        isChecked={selected}
                        onChange={(e) => handleCheckboxChange(e)}
                        name={method}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Checkbox>

                      <Slider
                        aria-label={`slider-${method}`}
                        colorScheme="primary"
                        value={radius}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(val) =>
                          handleSliderChange(transportationMethod, val)
                        }
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Text whiteSpace="nowrap">{radius} miles</Text>
                    </Flex>
                  );
                }
              )}
            </Stack>
          </Card>
        </Flex>

        <Card
          flex="1"
          borderRadius="md"
          bg={bgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg={cardBg}
            borderRadius="md"
            width="100%"
            height={"100%"}
            ref={mapRef}
            shadow="md"
          />
        </Card>
      </Flex>
    </Flex>
  );
};

export default Transportation;
