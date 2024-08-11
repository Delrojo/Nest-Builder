import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Textarea,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";

interface CategoryModel {
  title: string;
  description: string;
  isActive: boolean;
  costPreference: string;
  userPreferences: string;
  relatedSubcategories: string[];
  vibes: string[];
}

interface CategoryCardProps {
  categoryProp: CategoryModel;
  deleteCategoryCallback?: (category: CategoryModel) => void;
  editModeProp?: boolean;
}

const CategoryCard = ({
  categoryProp,
  deleteCategoryCallback,
  editModeProp = false,
}: CategoryCardProps) => {
  const [editMode, setEditMode] = useState(editModeProp);
  const [category, setCategory] = useState(categoryProp);
  const cardBg = useColorModeValue("primary.100", "primary.800");
  const tagBg = useColorModeValue("primary.700", "primary.500");

  const toast = useToast();

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (field: keyof CategoryModel, value: any) => {
    setCategory({ ...category, [field]: value });
  };

  const saveChanges = () => {
    setEditMode(false);
    toast({
      title: "Changes saved.",
      description: "Your changes have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    deleteCategoryCallback && deleteCategoryCallback(category);
    toast({
      title: "Category deleted.",
      description: "The category has been removed.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      backgroundColor={cardBg}
      shadow="md"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" fontSize="xl">
          {category.title} - {category.costPreference}
        </Text>
        <IconButton
          aria-label="Edit category"
          icon={editMode ? <CheckIcon /> : <EditIcon />}
          onClick={editMode ? saveChanges : handleEditToggle}
          colorScheme="blue"
          w="fit-content"
          variant={"ghost"}
        />
        {editMode && (
          <IconButton
            aria-label="Delete category"
            icon={<DeleteIcon />}
            onClick={handleDelete}
            colorScheme="red"
            variant={"ghost"}
          />
        )}
      </Flex>
      <Text mt={2}>{category.description}</Text>
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        {category.relatedSubcategories.map((subcategory, index) => (
          <Tag key={index} bg={tagBg} borderRadius="full">
            <TagLabel>{subcategory}</TagLabel>
            {editMode && (
              <TagCloseButton
                onClick={() => {
                  /* handle remove subcategory logic */
                }}
              />
            )}
          </Tag>
        ))}
      </Stack>
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        {category.vibes.map((vibe, index) => (
          <Tag key={index} bg={tagBg} borderRadius="full">
            <TagLabel>{vibe}</TagLabel>
            {editMode && (
              <TagCloseButton
                onClick={() => {
                  /* handle remove vibe logic */
                }}
              />
            )}
          </Tag>
        ))}
      </Stack>
      {editMode && (
        <Textarea
          placeholder="Enter your preferences here"
          value={category.userPreferences}
          onChange={(e) => handleChange("userPreferences", e.target.value)}
          mt={2}
        />
      )}
    </Box>
  );
};

export default CategoryCard;
