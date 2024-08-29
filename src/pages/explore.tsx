import ExploreCard from "@/components/Explore/ExploreCard";
import withAuth from "@/components/Modal/Auth/withAuth";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React from "react";

type ExploreProps = {};

const ExplorePage: React.FC<ExploreProps> = () => {
  return (
    <Flex direction="column" w={"100%"} h={"100%"}>
      <Flex direction="column" align="center">
        <Heading as="h1" textAlign="center" size="xl">
          Explore
        </Heading>
        <Text fontSize="md" mt={2} mb={4} textAlign="center">
          Nested believes these places are a good for your lifestyle, read the
          explaination to see why.
        </Text>
      </Flex>
      <Box maxH="80vh" overflowY="auto">
        <Accordion defaultIndex={[0, 1]} allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Heading as="h1" size="lg">
                    Shopping
                  </Heading>
                </Box>
                <IconButton
                  icon={<SettingsIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("HELLO");
                  }}
                  aria-label="Settings"
                  variant={"ghost"}
                  w={"fit-content"}
                  h={"2.5rem"}
                />
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <ExploreCard
                  place={{
                    title: "New York City",
                    address: "New York, NY",
                    description:
                      "New York City is the most populous city in the United States. With an estimated 2019 population of 8,336,817 distributed over about 302.6 square miles, New York is also the most densely populated major city in the United States.",
                    distance: "0.5 miles",
                    time: "5 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.8",
                    googleMapsLink:
                      "https://www.google.com/maps/place/New+York+City",
                  }}
                />
                <ExploreCard
                  place={{
                    title: "Los Angeles",
                    address: "Los Angeles, CA",
                    description:
                      "Los Angeles is a sprawling Southern California city and the center of the nation’s film and television industry. Near its iconic Hollywood sign, studios such as Paramount Pictures, Universal and Warner Brothers offer behind-the-scenes tours.",
                    distance: "0.5 miles",
                    time: "5 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.8",
                    googleMapsLink:
                      "https://www.google.com/maps/place/Los+Angeles",
                  }}
                />
                <ExploreCard
                  place={{
                    title: "Chicago",
                    address: "Chicago, IL",
                    description:
                      "Chicago, on Lake Michigan in Illinois, is among the largest cities in the U.S. Famed for its bold architecture, it has a skyline punctuated by skyscrapers such as the iconic John Hancock Center and the Willis Tower.",
                    distance: "1.2 miles",
                    time: "10 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.75",
                    googleMapsLink:
                      "https://www.google.com/maps/place/Chicago,+IL",
                  }}
                />
              </Grid>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem mt={2}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Heading as="h1" size="lg">
                  Entertainment
                </Heading>
              </Box>
              <IconButton
                icon={<SettingsIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  alert("HELLO");
                }}
                aria-label="Settings"
                variant={"ghost"}
                w={"fit-content"}
                h={"2.5rem"}
              />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <ExploreCard
                  place={{
                    title: "San Francisco",
                    address: "San Francisco, CA",
                    description:
                      "San Francisco, in northern California, is known for its year-round fog, iconic Golden Gate Bridge, cable cars, and colorful Victorian houses. The Financial District's Transamerica Pyramid is its most distinctive skyscraper.",
                    distance: "2 miles",
                    time: "15 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.82",
                    googleMapsLink:
                      "https://www.google.com/maps/place/San+Francisco",
                  }}
                />

                <ExploreCard
                  place={{
                    title: "Miami",
                    address: "Miami, FL",
                    description:
                      "Miami, officially the City of Miami, is a coastal metropolis located in Miami-Dade County in southeastern Florida. The city is known for its colorful art deco buildings, white sand, surfside hotels and trendsetting nightclubs.",
                    distance: "0.3 miles",
                    time: "4 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.78",
                    googleMapsLink:
                      "https://www.google.com/maps/place/Miami,+FL",
                  }}
                />

                <ExploreCard
                  place={{
                    title: "Seattle",
                    address: "Seattle, WA",
                    description:
                      "Seattle, a city on Puget Sound in the Pacific Northwest, is surrounded by water, mountains and evergreen forests, and contains thousands of acres of parkland. It is home to a large tech industry, with Microsoft and Amazon headquartered in its metropolitan area.",
                    distance: "3 miles",
                    time: "20 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.7",
                    googleMapsLink:
                      "https://www.google.com/maps/place/Seattle,+WA",
                  }}
                />

                <ExploreCard
                  place={{
                    title: "Boston",
                    address: "Boston, MA",
                    description:
                      "Boston, the capital of Massachusetts, is among the oldest cities in the U.S., founded in 1630. Boston is known for its famous baked beans, Fenway Park, The Boston Marathon, and of course Cheers, the famous TV bar in the 1980s.",
                    distance: "4 miles",
                    time: "25 minutes",
                    imageSrc: "https://via.placeholder.com/300x150",
                    matchLevel: "0.85",
                    googleMapsLink:
                      "https://www.google.com/maps/place/Boston,+MA",
                  }}
                />
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Flex>
  );
};
export default withAuth(ExplorePage);
