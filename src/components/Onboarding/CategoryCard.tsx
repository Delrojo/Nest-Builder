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
  Input,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { MdModeEdit } from "react-icons/md";
import TagInput from "./TagInput";
import { Category } from "@/atoms/categoryAtom";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { updateCategory } from "@/utils/functions/onboardingDBFunctions";

interface CategoryCardProps {
  category: Category;
  deleteCategoryCallback?: (category: Category) => void;
  editModeProp?: boolean;
}

const CategoryCard = ({
  category: categoryProp,
  deleteCategoryCallback,
  editModeProp = false,
}: CategoryCardProps) => {
  const [editMode, setEditMode] = useState(editModeProp);
  const [category, setCategory] = useState(categoryProp);
  const [user, setUser] = useRecoilState(userAtom);
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

  const handleChange = (field: keyof Category, value: any) => {
    setCategory({ ...category, [field]: value });
  };
  const saveChanges = () => {
    const isCategoryFilledOut =
      category.title && category.cost && category.preference;

    if (isCategoryFilledOut) {
      if (user.user?.uid && category.id && category) {
        updateCategory(user.user.uid, category.id, category)
          .then(() => {
            setEditMode(false);
          })
          .catch((error) => {
            toast({
              title: "An error occurred. Please try again later.",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          });
      }
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
      width="100%"
    >
      <Flex
        justifyContent="space-between"
        gap={2}
        alignItems="center"
        width="100%"
        mb={2}
      >
        {editMode ? (
          <>
            <Input
              value={category.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Select
              value={category.cost}
              onChange={(e) => handleChange("cost", e.target.value)}
            >
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </Select>
          </>
        ) : (
          <Text fontSize="xl">
            {category.title} | {category.cost}
          </Text>
        )}
        <Flex gap={2}>
          {editMode && (
            <IconButton
              aria-label="Delete category"
              icon={<DeleteIcon />}
              onClick={handleDelete}
              color="red"
              w="fit-content"
              h={"2.5rem"}
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
            h={"2.5rem"}
            variant={"ghost"}
          />
        </Flex>
      </Flex>
      {editMode ? (
        <Textarea
          placeholder="Enter your preferences here"
          value={category.preference}
          onChange={(e) => handleChange("preference", e.target.value)}
        />
      ) : (
        <Text mt={2} mb={4}>
          {category.preference}
        </Text>
      )}
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        <Text fontSize={"sm"} w="full">
          Related Subcategories:
        </Text>
        <TagInput
          tagContent={category.subcategories}
          editMode={editMode}
          bgColor={vibeBg}
          textColor={colorMode === "light" ? "text.light" : "text.dark"}
          editColor={colorMode === "light" ? "gray.500" : "text.dark"}
        />
      </Stack>
      <Stack direction="row" mt={2} spacing={2} wrap="wrap">
        <Text fontSize={"sm"} w="full">
          Vibes:
        </Text>
        <TagInput
          tagContent={category.vibes}
          editMode={editMode}
          bgColor={tagBg}
          textColor="white"
          editColor={colorMode === "light" ? "primary.700" : "primary.400"}
        />
      </Stack>
    </Box>
  );
};

export default CategoryCard;
