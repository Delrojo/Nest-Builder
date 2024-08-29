import ExploreCard from "@/components/Explore/ExploreCard";
import withAuth from "@/components/Modal/Auth/withAuth";
import { Flex, Heading, Text } from "@chakra-ui/react";
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

      <ExploreCard
        place={{
          title: "New York City",
          address: "New York, NY",
          description:
            "New York City is the most populous city in the United States. With an estimated 2019 population of 8,336,817 distributed over about 302.6 square miles, New York is also the most densely populated major city in the United States.",
          distance: "0.5 miles",
          time: "5 minutes",
          imageSrc: "https://source.unsplash.com/featured/?newyork",
          matchLevel: "0.8",
          googleMapsLink: "https://www.google.com/maps/place/New+York+City",
        }}
      />
    </Flex>
  );
};
export default withAuth(ExplorePage);
