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
import CategoryCard, { CategoryStatus } from "./CategoryCard";
import { CategoryModel } from "./CategoryCard";

const OnboardCategories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const toast = useToast();

  // Simulate fetching data
  const fetchCategories = useCallback(async () => {
    const fetchedCategories: CategoryModel[] = [
      {
        title: "Restaurant",
        status: CategoryStatus.ACTIVE,
        costPreference: "$$",
        userPreferences:
          "Interest in Mediterranean cuisine and healthy dining options",
        relatedSubcategories: ["Mediterranean", "Healthy Dining"],
        vibes: ["Casual", "Family-Friendly"],
      },
      {
        title: "Activities & Entertainment",
        status: CategoryStatus.ACTIVE,
        costPreference: "$",
        userPreferences: "Interest in museums, parks, and fitness activities",
        relatedSubcategories: ["Museums", "Parks", "Fitness"],
        vibes: ["Family-Friendly", "Outdoor"],
      },
      {
        title: "Shopping",
        status: CategoryStatus.ACTIVE,
        costPreference: "$$$",
        userPreferences:
          "Frequent searches for grocery stores and athletic apparel",
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
      status: CategoryStatus.EDIT,
      costPreference: "",
      userPreferences: "",
      relatedSubcategories: [],
      vibes: [],
    };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (category: CategoryModel) => {
    const updatedCategories = categories.filter(
      (existingCategory) => existingCategory !== category
    );
    setCategories(updatedCategories);
  };

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Categories
      </Heading>
      <Text fontSize="md" mt={2} textAlign="center">
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
          lg: "repeat(2, 1fr)",
        }}
        gap={4}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            categoryProp={category}
            deleteCategoryCallback={handleDeleteCategory}
            editModeProp={category.status === CategoryStatus.EDIT}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default OnboardCategories;
