import { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Grid,
  Text,
  useToast,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CategoryCard from "./CategoryCard";

interface CategoryModel {
  title: string;
  description: string;
  isActive: boolean;
  costPreference: string;
  userPreferences: string;
  relatedSubcategories: string[];
  vibes: string[];
}

const OnboardCategories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const toast = useToast();

  // Simulate fetching data
  const fetchCategories = useCallback(async () => {
    const fetchedCategories: CategoryModel[] = [
      {
        title: "Restaurant",
        description:
          "Interest in Mediterranean cuisine and healthy dining options",
        isActive: true,
        costPreference: "$$",
        userPreferences: "Healthy",
        relatedSubcategories: ["Mediterranean", "Healthy Dining"],
        vibes: ["Casual", "Family-Friendly"],
      },
      {
        title: "Activities & Entertainment",
        description: "Interest in museums, parks, and fitness activities",
        isActive: true,
        costPreference: "$",
        userPreferences: "Active",
        relatedSubcategories: ["Museums", "Parks", "Fitness"],
        vibes: ["Family-Friendly", "Outdoor"],
      },
      {
        title: "Shopping",
        description:
          "Frequent searches for grocery stores and athletic apparel",
        isActive: false,
        costPreference: "$$$",
        userPreferences: "Fashion",
        relatedSubcategories: ["Grocery Stores", "Athletic Apparel"],
        vibes: ["Convenient", "Affordable"],
      },
    ];
    setCategories(fetchedCategories);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddNewCategory = () => {
    const newCategory: CategoryModel = {
      title: "",
      description: "",
      isActive: false,
      costPreference: "",
      userPreferences: "",
      relatedSubcategories: [],
      vibes: [],
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added.",
      description: "You have added a new category.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Categories
      </Heading>
      <Text fontSize="md" mt={2} mb={4} textAlign="center">
        These are the categories we believe you would be interested in, feel
        free to edit or add more.
      </Text>
      <Flex justifyContent="end" w="full" mb={4}>
        <IconButton
          onClick={handleAddNewCategory}
          variant={"ghost"}
          aria-label={"add-category"}
          w={"fit-content"}
        >
          <AddIcon />
        </IconButton>
      </Flex>
      <Grid
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {categories.map((category, index) => (
          <CategoryCard key={index} categoryProp={category} />
        ))}
      </Grid>
    </Flex>
  );
};

export default OnboardCategories;
