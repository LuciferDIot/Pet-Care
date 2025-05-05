export enum MoodEnum {
  Happy = "Happy",
  Sad = "Sad",
  Excited = "Excited",
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  description: string;
  age: number;
  personality: string;
  mood: MoodEnum;
  adopted: boolean;
  adoption_date?: Date;
  created_at: Date; // Added to track time in system
  image?: string;
}
