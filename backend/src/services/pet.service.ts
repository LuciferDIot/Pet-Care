import PersonalityModel from "../models/personalityModel";
import PetModel from "../models/petModel";
import SpeciesModel from "../models/speciesModel";
import { Personality, Pet, PopulatedPet, Species } from "../types";
import { calculateMood } from "../utils/moodLogic";

export const PetService = {
  // Create a new pet
  async createPet(
    petData: Omit<
      Pet,
      "id" | "mood" | "created_at" | "adopted" | "adoption_date"
    >
  ): Promise<Pet> {
    try {
      const newPet = await PetModel.create({
        ...petData,
        species: petData.species.id,
        personality: petData.personality.id,
      });

      const populatedPet = await PetModel.findById(newPet._id)
        .populate("species")
        .populate("personality")
        .lean();

      if (!populatedPet) throw new Error("Failed to create pet");

      // Cast to unknown first, then to PopulatedPet
      return this.mapToPetDTO(populatedPet as unknown as PopulatedPet);
    } catch (error) {
      console.error("Error creating pet:", error);
      throw error;
    }
  },

  // Get all pets
  async getAllPets(): Promise<Pet[]> {
    try {
      const pets = await PetModel.find()
        .populate("species")
        .populate("personality")
        .lean();

      return pets.map((pet) =>
        this.mapToPetDTO(pet as unknown as PopulatedPet)
      );
    } catch (error) {
      console.error("Error fetching pets:", error);
      throw error;
    }
  },

  // Get pet by ID
  async getPetById(id: string): Promise<Pet | null> {
    try {
      const pet = await PetModel.findById(id)
        .populate("species")
        .populate("personality")
        .lean();

      return pet ? this.mapToPetDTO(pet as unknown as PopulatedPet) : null;
    } catch (error) {
      console.error("Error fetching pet:", error);
      throw error;
    }
  },

  // Update pet
  async updatePet(id: string, petData: Partial<Pet>): Promise<Pet> {
    try {
      const updateFields: any = { ...petData };

      if (petData.species) updateFields.species = petData.species.id;
      if (petData.personality)
        updateFields.personality = petData.personality.id;

      const updatedPet = await PetModel.findByIdAndUpdate(id, updateFields, {
        new: true,
      })
        .populate("species")
        .populate("personality")
        .lean();

      if (!updatedPet) throw new Error("Pet not found");

      return this.mapToPetDTO(updatedPet as unknown as PopulatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      throw error;
    }
  },

  // Delete pet
  async deletePet(id: string): Promise<void> {
    try {
      const result = await PetModel.findByIdAndDelete(id);
      if (!result) throw new Error("Pet not found");
    } catch (error) {
      console.error("Error deleting pet:", error);
      throw error;
    }
  },

  // Adopt pet
  async adoptPet(id: string): Promise<Pet> {
    try {
      const adoptedPet = await PetModel.findByIdAndUpdate(
        id,
        {
          adopted: true,
          adoption_date: new Date(),
        },
        { new: true }
      )
        .populate("species")
        .populate("personality")
        .lean();

      if (!adoptedPet) throw new Error("Pet not found");

      return this.mapToPetDTO(adoptedPet as unknown as PopulatedPet);
    } catch (error) {
      console.error("Error adopting pet:", error);
      throw error;
    }
  },

  // Filter pets by mood
  async filterPetsByMood(mood: string): Promise<Pet[]> {
    try {
      const allPets = await this.getAllPets();
      return allPets.filter(
        (pet) => pet.mood.toLowerCase() === mood.toLowerCase()
      );
    } catch (error) {
      console.error("Error filtering pets by mood:", error);
      throw error;
    }
  },

  // Initialize database with sample data
  async initializeData(): Promise<void> {
    try {
      const count = await PetModel.countDocuments();
      if (count > 0) return;

      // Create sample personalities
      const friendly = await PersonalityModel.create({ name: "Friendly" });
      const shy = await PersonalityModel.create({ name: "Shy" });
      const energetic = await PersonalityModel.create({ name: "Energetic" });
      const calm = await PersonalityModel.create({ name: "Calm" });

      // Create sample species
      const dog = await SpeciesModel.create({ name: "Dog" });
      const cat = await SpeciesModel.create({ name: "Cat" });
      const rabbit = await SpeciesModel.create({ name: "Rabbit" });
      const bird = await SpeciesModel.create({ name: "Bird" });

      // Create sample pets
      await PetModel.create([
        {
          name: "Max",
          species: dog._id,
          age: 2,
          personality: friendly._id,
          description: "A very friendly dog",
          image: "https://example.com/dog.jpg",
        },
        {
          name: "Whiskers",
          species: cat._id,
          age: 3,
          personality: shy._id,
          description: "A shy but loving cat",
          image: "https://example.com/cat.jpg",
        },
      ]);

      console.log("Database initialized with sample data");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  },

  // Helper method to map database documents to DTOs
  mapToPetDTO(pet: PopulatedPet): Pet {
    return {
      id: pet._id.toString(),
      name: pet.name,
      species: {
        id: pet.species._id.toString(),
        name: pet.species.name,
      },
      age: pet.age,
      personality: {
        id: pet.personality._id.toString(),
        name: pet.personality.name,
      },
      mood: calculateMood(pet.created_at),
      adopted: pet.adopted,
      adoption_date: pet.adoption_date,
      created_at: pet.created_at,
      description: pet.description,
      image: pet.image,
    };
  },
};
