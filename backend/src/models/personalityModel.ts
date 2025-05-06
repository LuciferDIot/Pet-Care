import mongoose, { Document, Schema } from "mongoose";

/**
 * @interface IPersonality
 * @property {string} name - The personality trait name
 */
interface IPersonality extends Document {
  name: string;
}

const PersonalitySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const PersonalityModel = mongoose.model<IPersonality>(
  "Personality",
  PersonalitySchema
);

export default PersonalityModel;
