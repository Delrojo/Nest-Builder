import CategorySection from "@/components/Explore/CategorySection";
import withAuth from "@/components/Modal/Auth/withAuth";
import { Accordion, Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

type ExploreProps = {};

const resultData = [
  {
    categoryTitle: "Shopping",
    results: [
      {
        title: "Walmart",
        address: "123 Main St, San Francisco, CA",
        description:
          "Walmart is a large retail store that sells a variety of products, including groceries, electronics, clothing, and home goods. It is known for its low prices and wide selection of items.",
        distance: "0.5 miles",
        time: "10 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.9",
        googleMapsLink: "https://www.google.com/maps/place/Walmart",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "Target",
        address: "456 Elm St, San Francisco, CA",
        description:
          "Target is a popular retail store that sells a variety of products, including clothing, electronics, home goods, and groceries. It is known for its stylish and affordable products.",
        distance: "1 mile",
        time: "15 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.85",
        googleMapsLink: "https://www.google.com/maps/place/Target",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "Best Buy",
        address: "789 Oak St, San Francisco, CA",
        description:
          "Best Buy is a large electronics retailer that sells a variety of products, including computers, TVs, cameras, and appliances. It is known for its knowledgeable staff and wide selection of products.",
        distance: "2 miles",
        time: "20 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.8",
        googleMapsLink: "https://www.google.com/maps/place/Best+Buy",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "Apple Store",
        address: "101 Pine St, San Francisco, CA",
        description:
          "The Apple Store is a retail store that sells Apple products, including iPhones, iPads, MacBooks, and Apple Watches. It is known for its sleek and modern design and helpful staff.",
        distance: "0.2 miles",
        time: "5 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.75",
        googleMapsLink: "https://www.google.com/maps/place/Apple+Store",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "McDonald's",
        address: "123 Main St, San Francisco, CA",
        description:
          "McDonald's is a fast food restaurant that is known for its burgers, fries, and shakes. It is popular with families and people looking for a quick and affordable meal.",
        distance: "0.5 miles",
        time: "10 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.9",
        googleMapsLink: "https://www.google.com/maps/place/McDonald's",
        additionalInfo: "Open 24 hours",
      },
    ],
  },
  {
    categoryTitle: "Restaurants",
    results: [
      {
        title: "McDonald's",
        address: "123 Main St, San Francisco, CA",
        description:
          "McDonald's is a fast food restaurant that is known for its burgers, fries, and shakes. It is popular with families and people looking for a quick and affordable meal.",
        distance: "0.5 miles",
        time: "10 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.9",
        googleMapsLink: "https://www.google.com/maps/place/McDonald's",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "Starbucks",
        address: "456 Elm St, San Francisco, CA",
        description:
          "Starbucks is a coffee shop that is known for its wide variety of coffee drinks, teas, and pastries. It is popular with students, professionals, and people looking for a place to relax.",
        distance: "1 mile",
        time: "15 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.85",
        googleMapsLink: "https://www.google.com/maps/place/Starbucks",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "Chipotle",
        address: "789 Oak St, San Francisco, CA",
        description:
          "Chipotle is a fast casual restaurant that serves Mexican-inspired food, including burritos, tacos, and bowls. It is known for its fresh ingredients and customizable menu.",
        distance: "2 miles",
        time: "20 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.8",
        googleMapsLink: "https://www.google.com/maps/place/Chipotle",
        additionalInfo: "Open 24 hours",
      },
      {
        title: "In-N-Out Burger",
        address: "101 Pine St, San Francisco, CA",
        description:
          "In-N-Out Burger is a popular fast food restaurant that is known for its burgers, fries, and shakes. It is a favorite among locals and tourists alike.",
        distance: "0.2 miles",
        time: "5 minutes",
        imageSrc: "https://via.placeholder.com/300x150",
        matchLevel: "0.75",
        googleMapsLink: "https://www.google.com/maps/place/In-N-Out+Burger",
        additionalInfo: "Open 24 hours",
      },
    ],
  },
];
const ExplorePage: React.FC<ExploreProps> = () => {
  return (
    <Flex direction="column" w={"100%"} h={"100%"}>
      <Box maxH="90vh" overflowY="auto">
        <Flex direction="column" align="center">
          <Heading as="h2" textAlign="center" size="lg">
            Explore
          </Heading>
          <Text fontSize="md" mt={2} mb={4} textAlign="center">
            Nested believes these places are a good for your lifestyle, read the
            explaination to see why.
          </Text>
        </Flex>
        <Accordion defaultIndex={[0, 1]} allowMultiple>
          {resultData.map((category, index) => (
            <CategorySection
              key={index}
              title={category.categoryTitle}
              results={category.results}
            />
          ))}
        </Accordion>
      </Box>
    </Flex>
  );
};
export default withAuth(ExplorePage);
