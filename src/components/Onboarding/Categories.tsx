import {
  Flex,
  Grid,
  Text,
  useToast,
  Heading,
  IconButton,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CategoryCard from "./CategoryCard";
import { useRecoilState } from "recoil";
import { Category, categoryAtom, CategoryStatus } from "@/atoms/categoryAtom";

const OnboardCategories = () => {
  const [category, setCategoryAtom] = useRecoilState(categoryAtom);
  const toast = useToast();

  const handleAddNewCategory = () => {
    //TODO: API call to add a category and get the id once it succeeds

    const newCategory: Category = {
      id: "2", //TODO: Replace this with the actual id from the API
      title: "",
      status: CategoryStatus.Edit,
      cost: "",
      preference: "",
      subcategories: [],
      vibes: [],
    };
    setCategoryAtom([
      ...category,
      {
        category: newCategory,
        results: [],
      },
    ]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    //TODO: Add a call to delete the category from the database given an id if it succeeds

    setCategoryAtom(category.filter((cat) => cat.category.id !== categoryId));
    toast({
      title: "Category deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex direction="column" align="center" height="100%" width="100%">
      <Heading as="h1" mt={4} textAlign="center" size="lg">
        Categories
      </Heading>
      <Flex justifyContent="space-between" alignItems="center" w="full" mb={4}>
        <Spacer />
        <Text fontSize="md" textAlign="center">
          These are the categories we believe you would be interested in, feel
          free to edit or add more.
        </Text>
        <Spacer />
        <IconButton
          onClick={handleAddNewCategory}
          variant={"ghost"}
          aria-label={"add-category"}
          w={"fit-content"}
        >
          <AddIcon />
        </IconButton>
      </Flex>

      <Box width="100%" height="31rem" overflowY="auto">
        <Grid
          templateColumns={{
            sm: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
          }}
          gap={4}
          width="100%"
        >
          {category.map((categoryObj) => (
            <CategoryCard
              key={categoryObj.category.id}
              category={categoryObj.category}
              deleteCategoryCallback={() =>
                handleDeleteCategory(categoryObj.category.id)
              }
            />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default OnboardCategories;
