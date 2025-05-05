export enum MoodEnum {
  Happy = "Happy",
  Sad = "Sad",
  Excited = "Excited",
}

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
  id?: string;
  name: string;
}

export interface Species {
  id?: string;
  name: string;
}
