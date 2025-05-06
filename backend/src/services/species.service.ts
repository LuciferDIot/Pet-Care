import PetModel from "../models/petModel";
import SpeciesModel from "../models/speciesModel";
import { Species } from "../types";

export const SpeciesService = {
  // Get all species
  async getAllSpecies(): Promise<Species[]> {
    const species = await SpeciesModel.find().lean();
    return species.map((s) => ({
      id: s._id.toString(),
      name: s.name,
    }));
  },

  // Get species by ID
  async getSpeciesById(id: string): Promise<Species | null> {
    const s = await SpeciesModel.findById(id).lean();
    if (!s) return null;
    return {
      id: s._id.toString(),
      name: s.name,
    };
  },

  // Create new species
  async createSpecies(data: Partial<Species>): Promise<Species> {
    const newSpecies = new SpeciesModel({ name: data.name });
    const saved = (await newSpecies.save()) as Species & { _id: any };
    return {
      id: saved._id.toString(),
      name: saved.name,
    };
  },

  // Update species
  async updateSpecies(
    id: string,
    data: Partial<Species>
  ): Promise<Species | null> {
    const updated = await SpeciesModel.findByIdAndUpdate(
      id,
      { $set: { name: data.name } },
      { new: true }
    ).lean();
    if (!updated) return null;
    return {
      id: updated._id.toString(),
      name: updated.name,
    };
  },

  // Delete species
  async deleteSpecies(id: string): Promise<boolean> {
    const species = await SpeciesModel.findById(id);
    if (!species) return false;

    if (species.name === "Unknown") {
      throw new Error("Cannot delete default 'Unknown' species.");
    }

    // Find or create the "Unknown" species
    let unknownSpecies = await SpeciesModel.findOne({ name: "Unknown" });
    if (!unknownSpecies) {
      unknownSpecies = await SpeciesModel.create({ name: "Unknown" });
    }

    // Reassign pets to "Unknown"
    await PetModel.updateMany(
      { species: id },
      { $set: { species: unknownSpecies._id } }
    );

    // Delete the species
    await SpeciesModel.findByIdAndDelete(id);
    return true;
  },
};
