import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  Textarea,
  useToast,
  useColorModeValue,
  HStack,
  Input,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { MdModeEdit } from "react-icons/md";
import TagInput from "./TagInput";

export enum CategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EDIT = "edit",
}

export interface CategoryModel {
  title: string;
  costPreference: string;
  userPreferences: string;
  relatedSubcategories: string[];
  vibes: string[];
  status: CategoryStatus;
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
  const vibeBg = useColorModeValue("gray.300", "gray.500");
  const deleteBg = useColorModeValue(
    "rgba(255, 0, 0, 0.2)",
    "rgba(139, 0, 0, 0.2)"
  );
  const { colorMode } = useColorMode();

  const toast = useToast();

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (field: keyof CategoryModel, value: any) => {
    setCategory({ ...category, [field]: value });
  };
  const saveChanges = () => {
    const isCategoryFilledOut =
      category.title && category.costPreference && category.userPreferences;

    if (isCategoryFilledOut) {
      setEditMode(false);
    } else {
      toast({
        title: "Please fill out all fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleDelete = () => {
    deleteCategoryCallback && deleteCategoryCallback(category);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      backgroundColor={cardBg}
      shadow="md"
    >
      <Flex justifyContent="space-between" gap={2} alignItems="center">
        {editMode ? (
          <>
            <Input
              value={category.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Select
              value={category.costPreference}
              onChange={(e) => handleChange("costPreference", e.target.value)}
            >
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </Select>
          </>
        ) : (
          <Text fontSize="xl">
            {category.title} | {category.costPreference}
          </Text>
        )}
        <HStack>
          {editMode && (
            <IconButton
              aria-label="Delete category"
              icon={<DeleteIcon />}
              onClick={handleDelete}
              color="red"
              w="fit-content"
              variant={"ghost"}
              sx={{
                _hover: {
                  color: "red",
                  bg: deleteBg,
                },
              }}
            />
          )}
          <IconButton
            aria-label="Edit category"
            icon={editMode ? <CheckIcon /> : <MdModeEdit />}
            onClick={editMode ? saveChanges : handleEditToggle}
            w="fit-content"
            variant={"ghost"}
          />
        </HStack>
      </Flex>
      {editMode ? (
        <Textarea
          placeholder="Enter your preferences here"
          value={category.userPreferences}
          onChange={(e) => handleChange("userPreferences", e.target.value)}
        />
      ) : (
        <Text mt={2}>{category.userPreferences}</Text>
      )}
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        <Text fontSize={"sm"} w="full">
          Related Subcategories:
        </Text>
        <TagInput
          category={category}
          editMode={editMode}
          bgColor={vibeBg}
          textColor={colorMode === "light" ? "text.light" : "text.dark"}
        />
      </Stack>
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        <Text fontSize={"sm"} w="full">
          Vibes:
        </Text>
        <TagInput
          category={category}
          editMode={editMode}
          bgColor={tagBg}
          textColor="white"
        />
      </Stack>
    </Box>
  );
};

export default CategoryCard;
