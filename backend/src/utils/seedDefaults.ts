// seedDefaults.ts
import PersonalityModel from "../models/personalityModel";
import SpeciesModel from "../models/speciesModel";

export const seedDefaultReferences = async () => {
  let unknownSpecies = await SpeciesModel.findOne({ name: "Unknown" });
  if (!unknownSpecies) {
    unknownSpecies = await SpeciesModel.create({ name: "Unknown" });
  }
  let unknownPersonality = await PersonalityModel.findOne({ name: "Unknown" });
  if (!unknownPersonality) {
    unknownPersonality = await PersonalityModel.create({ name: "Unknown" });
  }
  return {
    unknownSpeciesId: unknownSpecies._id,
    unknownPersonalityId: unknownPersonality._id,
  };
};
