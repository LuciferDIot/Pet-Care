import PersonalityModel from "../models/personalityModel";
import PetModel from "../models/petModel";
import { Personality } from "../types";

export const personalityService = {
  // Get all personalities
  async getAllPersonalities(): Promise<Personality[]> {
    const personalities = await PersonalityModel.find().lean();
    return personalities.map((p) => ({
      id: p._id.toString(),
      name: p.name,
    }));
  },

  // Get personality by ID
  async getPersonalityById(id: string): Promise<Personality | null> {
    const p = await PersonalityModel.findById(id).lean();
    if (!p) return null;
    return {
      id: p._id.toString(),
      name: p.name,
    };
  },

  // Create personality
  async createPersonality(data: Partial<Personality>): Promise<Personality> {
    const newPersonality = new PersonalityModel({ name: data.name });
    const saved = (await newPersonality.save()) as Personality & { _id: any };
    return {
      id: saved._id.toString(),
      name: saved.name,
    };
  },

  // Update personality
  async updatePersonality(
    id: string,
    data: Partial<Personality>
  ): Promise<Personality | null> {
    const updated = await PersonalityModel.findByIdAndUpdate(
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

  // Delete personality
  async deletePersonality(id: string): Promise<boolean> {
    const personality = await PersonalityModel.findById(id);
    if (!personality) return false;

    if (personality.name === "Unknown") {
      throw new Error("Cannot delete default 'Unknown' personality.");
    }

    let unknownPersonality = await PersonalityModel.findOne({
      name: "Unknown",
    });
    if (!unknownPersonality) {
      unknownPersonality = await PersonalityModel.create({ name: "Unknown" });
    }

    await PetModel.updateMany(
      { personality: id },
      { $set: { personality: unknownPersonality._id } }
    );

    await PersonalityModel.findByIdAndDelete(id);
    return true;
  },
};
