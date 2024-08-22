import { Button, Image } from "@chakra-ui/react";
import { useState } from "react";

interface AnimatedButtonProps {
  gifSrc: string;
  photoSrc: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  bgColor?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  gifSrc,
  photoSrc,
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  bgColor = "transparent",
}: AnimatedButtonProps) => {
  const [imageSrc, setImageSrc] = useState(photoSrc);

  const handleMouseEnter = () => {
    setImageSrc(gifSrc);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setImageSrc(photoSrc);
    onMouseLeave();
  };

  return (
    <Button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      p={0}
      bg={bgColor}
      _hover={{ bg: bgColor }}
      _focus={{ boxShadow: "none" }}
      w={"100%"}
      h={"100%"}
      maxH={"14rem"}
      maxW={"14rem"}
      borderRadius={"1.5rem"}
    >
      <Image borderRadius={"1.5rem"} src={imageSrc} alt="Animated Button" />
    </Button>
  );
};

export default AnimatedButton;
