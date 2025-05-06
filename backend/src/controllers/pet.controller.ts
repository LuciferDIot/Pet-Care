import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { PetService } from "../services/pet.service";

export const PetController = {
  // Create a new pet
  async createPet(req: Request, res: Response) {
    try {
      const { name, species, age, personality, description, image } = req.body;

      if (!name || !species || !age || !personality) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newPet = await PetService.createPet({
        name,
        species,
        age,
        personality,
        description: description || "",
        image: image || undefined,
      });

      res.status(201).json(newPet);
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all pets
  async getAllPets(req: Request, res: Response) {
    try {
      const pets = await PetService.getAllPets();
      res.json(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get pet by ID
  async getPetById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid Pet ID" });
      }
      const pet = await PetService.getPetById(id);

      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update pet
  async updatePet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const petData = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid Pet ID" });
      }

      const updatedPet = await PetService.updatePet(id, petData);
      res.json(updatedPet);
    } catch (error: any) {
      if (error.message === "Pet not found") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete pet
  async deletePet(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid Pet ID" });
      }

      await PetService.deletePet(id);
      res.json({ message: "Pet deleted successfully" });
    } catch (error: any) {
      if (error.message === "Pet not found") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error deleting pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Adopt pet
  async adoptPet(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid Pet ID" });
      }

      const adoptedPet = await PetService.adoptPet(id);
      res.json(adoptedPet);
    } catch (error: any) {
      if (error.message === "Pet not found") {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error adopting pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Unadopt pet
  async unadoptAllPets(req: Request, res: Response) {
    try {
      const pets = await PetService.unadoptAllPets();
      res.status(200).json(pets);
    } catch (error) {
      console.error("Error in unadopt-all route:", error);
      res.status(500).json({ error: "Failed to unadopt all pets" });
    }
  },

  // Filter pets by mood
  async filterPetsByMood(req: Request, res: Response) {
    try {
      const { mood } = req.query;

      if (!mood || typeof mood !== "string") {
        return res
          .status(400)
          .json({ error: "Mood query parameter is required" });
      }

      const pets = await PetService.filterPetsByMood(mood);
      res.json(pets);
    } catch (error) {
      console.error("Error filtering pets by mood:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
