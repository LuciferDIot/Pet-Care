import { Request, Response } from "express";
import { personalityService } from "../services/personality.service";

export const PersonalityController = {
  // Get all personalities
  async getAllPersonalities(req: Request, res: Response) {
    try {
      const personalities = await personalityService.getAllPersonalities();
      res.json(personalities);
    } catch (error) {
      console.error("Error fetching personalities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get personality by ID
  async getPersonalityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const personality = await personalityService.getPersonalityById(id);
      if (!personality) {
        return res.status(404).json({ error: "Personality not found" });
      }
      res.json(personality);
    } catch (error) {
      console.error("Error fetching personality by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create personality
  async createPersonality(req: Request, res: Response) {
    try {
      const personality = await personalityService.createPersonality(req.body);
      res.status(201).json(personality);
    } catch (error) {
      console.error("Error creating personality:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update personality
  async updatePersonality(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPersonality = await personalityService.updatePersonality(
        id,
        req.body
      );
      if (!updatedPersonality) {
        return res.status(404).json({ error: "Personality not found" });
      }
      res.json(updatedPersonality);
    } catch (error) {
      console.error("Error updating personality:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete personality
  async deletePersonality(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await personalityService.deletePersonality(id);
      if (!deleted) {
        return res.status(404).json({ error: "Personality not found" });
      }
      res.json({ message: "Personality deleted successfully" });
    } catch (error) {
      console.error("Error deleting personality:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
