export enum MoodEnum {
  Happy = "Happy",
  Sad = "Sad",
  Excited = "Excited",
}

// These interfaces will be augmented by generated types
export interface Pet {
  id: string;
  name: string;
  species: Species;
  description: string;
  age: number;
  personality: Personality;
  mood: MoodEnum;
  adopted: boolean;
  adoption_date?: Date;
  created_at: Date;
  image?: string;
}

export interface Personality {
  id: string;
  name: string;
}

export interface Species {
  id: string;
  name: string;
}

// Define a type for the populated pet document
export interface PopulatedPet {
  _id: string;
  name: string;
  species: { _id: string; name: string };
  age: number;
  personality: { _id: string; name: string };
  description: string;
  image?: string;
  mood: string;
  adopted: boolean;
  adoption_date?: Date;
  created_at: Date;
  __v?: number; // Include __v as optional since lean() includes it
}
