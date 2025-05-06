import { getSpeciesImage } from "@/lib/pet-utils";
import { useEffect, useState } from "react";

// Props interface for the component
interface PetImageProps {
  name: string;
  species: string;
  image?: string;
  w?: number;
  h?: number;
  className?: string;
}

// PetImage component
// Export a functional component called PetImage that takes in a prop called pet
export const PetImage: React.FC<PetImageProps> = ({
  species,
  name,
  image,
  className,
  w = 400,
  h = 400,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    getSpeciesImage(species, image, w, h)
  );

  useEffect(() => {
    // Update the image source when the species or image prop changes
    setImgSrc(getSpeciesImage(species, image, w, h));
  }, [species, image, w, h]);

  // Handle image load error
  const handleImageError = () => {
    setImgSrc("/placeholder.svg");
  };

  return (
    <img
      src={imgSrc}
      alt={`${name} the ${species}`}
      className={`${className}`}
      onError={handleImageError}
    />
  );
};
