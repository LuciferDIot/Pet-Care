import mongoose, { Document, Schema } from "mongoose";

/**
 * @interface ISpecies
 * @property {string} name - The species name
 */
export interface ISpecies extends Document {
  name: string;
}

const SpeciesSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const SpeciesModel = mongoose.model<ISpecies>("Species", SpeciesSchema);

export default SpeciesModel;
