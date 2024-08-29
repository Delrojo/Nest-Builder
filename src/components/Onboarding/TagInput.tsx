import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Flex, Input, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

interface TagInputProps {
  tagContent: string[];
  editMode: boolean;
  bgColor: string;
  textColor: string;
  editColor: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tagContent,
  editMode,
  bgColor,
  textColor,
  editColor,
}) => {
  const [tags, setTags] = useState<string[]>(tagContent);
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
    <Flex
      direction="column"
      gap={2}
      p={editMode ? 2 : 0}
      borderRadius="md"
      width={"100%"}
      border={editMode ? "1px" : "0px"}
      borderColor={editMode ? bgColor : "transparent"}
    >
      <Flex wrap="wrap" gap={2} width={"fit-content"}>
        {tags.map((subcategory: string, index: number) => (
          <Tag
            key={index}
            bg={editMode ? "transparent" : bgColor}
            borderWidth={editMode ? "2px" : "0px"}
            borderColor={bgColor}
            color={editMode ? editColor : textColor}
            borderRadius="full"
            variant={editMode ? "" : "solid"}
          >
            <TagLabel p={1}>{subcategory}</TagLabel>
            {editMode && (
              <TagCloseButton onClick={() => handleRemoveTag(subcategory)} />
            )}
          </Tag>
        ))}
        {editMode && (
          <Input
            variant="unstyled" // Removing default input styles
            placeholder="Type and press enter"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleAddTag}
            width={"fit-content"}
            minW={"10rem"}
            height={"2rem"}
            pl={0}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default TagInput;
