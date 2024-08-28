import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Flex, Input, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { CategoryModel } from "./CategoryCard";

interface TagInputProps {
  category: CategoryModel;
  editMode: boolean;
  bgColor: string;
  textColor: string;
}

const TagInput: React.FC<TagInputProps> = ({
  category,
  editMode,
  bgColor,
  textColor,
}) => {
  const [tags, setTags] = useState<string[]>(category.relatedSubcategories);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setTags((prevTags: string[]) => [...prevTags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags: string[]) =>
      prevTags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  return (
    <Flex direction="column" gap={2} borderRadius="md" width={"100%"}>
      <Flex wrap="wrap" gap={2}>
        {tags.map((subcategory: string, index: number) => (
          <Tag key={index} bg={bgColor} color={textColor} borderRadius="full">
            <TagLabel p={1}>{subcategory}</TagLabel>
            {editMode && (
              <TagCloseButton onClick={() => handleRemoveTag(subcategory)} />
            )}
          </Tag>
        ))}
      </Flex>

      {editMode && (
        <Input
          placeholder="Type and press enter"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleAddTag}
          width="100%"
          minW="100px"
          flexGrow={1}
        />
      )}
    </Flex>
  );
};

export default TagInput;
