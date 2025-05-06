import mongoose, { ObjectId, Schema } from "mongoose";
import { MoodEnum } from "../types";

/**
 * @interface IPet
 * @property {string} name - The pet's name
 * @property {mongoose.Types.ObjectId} species - Reference to Species
 * @property {string} description - Description of the pet
 * @property {number} age - Age of the pet in years
 * @property {mongoose.Types.ObjectId} personality - Reference to Personality
 * @property {MoodEnum} mood - Current mood of the pet
 * @property {boolean} adopted - Whether the pet is adopted
 * @property {Date} [adoption_date] - Date of adoption if adopted
 * @property {Date} created_at - When the pet was added to the system
 * @property {string} [image] - URL to pet's image
 */
interface IPet extends mongoose.Document {
  name: string;
  species: ObjectId;
  description: string;
  age: number;
  personality: ObjectId;
  mood: MoodEnum;
  adopted: boolean;
  adoption_date?: Date;
  created_at: Date;
  image?: string;
}

const PetSchema = new Schema({
  name: { type: String, required: true },
  species: {
    type: Schema.Types.ObjectId,
    ref: "Species",
    required: true,
  },
  description: { type: String, default: "" },
  age: { type: Number, required: true, min: 0 },
  personality: {
    type: Schema.Types.ObjectId,
    ref: "Personality",
    required: true,
  },
  mood: {
    type: String,
    enum: Object.values(MoodEnum),
    default: MoodEnum.Happy,
  },
  adopted: { type: Boolean, default: false },
  adoption_date: { type: Date },
  created_at: { type: Date, default: Date.now },
  image: { type: String },
});

const PetModel = mongoose.model<IPet>("Pet", PetSchema);

export default PetModel;
