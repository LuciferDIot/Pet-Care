import { MoodEnum, Personality, Species } from "@/types/pet";

export const defaultSpecies: Species[] = [
  { id: "dog", name: "Dog" },
  { id: "cat", name: "Cat" },
  { id: "rabbit", name: "Rabbit" },
  { id: "bird", name: "Bird" },
  { id: "hamster", name: "Hamster" },
  { id: "guinea-pig", name: "Guinea Pig" },
  { id: "ferret", name: "Ferret" },
];

export const defaultPersonalities: Personality[] = [
  { id: "1", name: "Playful and energetic" },
  { id: "2", name: "Calm and affectionate" },
  { id: "3", name: "Curious and adventurous" },
  { id: "4", name: "Shy but loving" },
  { id: "5", name: "Independent and clever" },
  { id: "6", name: "Friendly and outgoing" },
  { id: "7", name: "Gentle and patient" },
  { id: "8", name: "Mischievous and fun" },
  { id: "9", name: "Loyal and protective" },
];

// Calculate mood based on days in the system
export function calculateMood(createdAt: Date, isAdopted: boolean): MoodEnum {
  if (isAdopted) {
    return MoodEnum.Happy;
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return MoodEnum.Happy;
  } else if (diffDays <= 3) {
    return MoodEnum.Excited;
  } else {
    return MoodEnum.Sad;
  }
}

export const getSpeciesImage = (
  species: string,
  customImage?: string,
  w: number = 400,
  h: number = 400
) => {
  if (customImage) return customImage;

  return `/placeholder.svg?height=${h}&width=${w}&text=${species}`;
};
