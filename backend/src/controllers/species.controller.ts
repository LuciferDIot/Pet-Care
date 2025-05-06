import { Request, Response } from "express";
import { SpeciesService } from "../services/species.service";

export const SpeciesController = {
  // Get all species
  async getAllSpecies(req: Request, res: Response) {
    try {
      const species = await SpeciesService.getAllSpecies();
      res.json(species);
    } catch (error) {
      console.error("Error fetching species:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get species by ID
  async getSpeciesById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const species = await SpeciesService.getSpeciesById(id);
      if (!species) {
        return res.status(404).json({ error: "Species not found" });
      }
      res.json(species);
    } catch (error) {
      console.error("Error fetching species by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create new species
  async createSpecies(req: Request, res: Response) {
    try {
      const species = await SpeciesService.createSpecies(req.body);
      res.status(201).json(species);
    } catch (error) {
      console.error("Error creating species:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update species
  async updateSpecies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedSpecies = await SpeciesService.updateSpecies(id, req.body);
      if (!updatedSpecies) {
        return res.status(404).json({ error: "Species not found" });
      }
      res.json(updatedSpecies);
    } catch (error) {
      console.error("Error updating species:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete species
  async deleteSpecies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SpeciesService.deleteSpecies(id);
      if (!deleted) {
        return res.status(404).json({ error: "Species not found" });
      }
      res.json({ message: "Species deleted successfully" });
    } catch (error) {
      console.error("Error deleting species:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
