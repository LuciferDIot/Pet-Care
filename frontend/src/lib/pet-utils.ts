import { MoodEnum, Personality, Species, type Pet } from "@/types/pet";

const petNames = [
  "Luna",
  "Max",
  "Bella",
  "Charlie",
  "Lucy",
  "Cooper",
  "Daisy",
  "Milo",
  "Zoe",
  "Rocky",
  "Lily",
  "Oliver",
  "Lola",
  "Leo",
  "Stella",
  "Teddy",
];

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

const petDescriptions = [
  "Loves to play fetch and cuddle on the couch. Great with children and other pets.",
  "A bit shy at first, but warms up quickly. Enjoys quiet environments and gentle petting.",
  "Very active and playful. Needs lots of exercise and mental stimulation.",
  "Extremely affectionate and loves attention. Will follow you everywhere!",
  "Independent but loving. Enjoys both playtime and quiet time alone.",
  "Curious and intelligent. Loves to explore and learn new tricks.",
  "Sweet and gentle soul. Gets along well with everyone and loves to be held.",
  "Energetic and fun-loving. Always ready for an adventure!",
  "Calm and relaxed. Perfect companion for a peaceful home.",
  "Playful and mischievous. Will keep you entertained with their antics.",
];

// Calculate mood based on days in the system
export function calculateMood(createdAt: Date): MoodEnum {
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

export function generateRandomPet(): Pet {
  const isAdopted = Math.random() > 0.8; // 20% chance of being adopted
  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
  ); // Random date within the last 7 days

  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    name: petNames[Math.floor(Math.random() * petNames.length)],
    species: defaultSpecies[Math.floor(Math.random() * defaultSpecies.length)],
    age: Math.floor(Math.random() * 10) + 1,
    personality:
      defaultPersonalities[
        Math.floor(Math.random() * defaultPersonalities.length)
      ],
    mood: calculateMood(createdAt),
    adopted: isAdopted,
    created_at: createdAt,
    adoption_date: isAdopted
      ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      : undefined, // Random date within the last 30 days
    description:
      petDescriptions[Math.floor(Math.random() * petDescriptions.length)], // Random description
  };
}

export function generateRandomPets(count: number): Pet[] {
  return Array.from({ length: count }, () => generateRandomPet());
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
