import mongoose from "mongoose";

export async function connectToDatabase(uri: string) {
  const db = (await mongoose.connect(uri as string, {})).connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  db.once("open", () => {
    console.log("Connected to MongoDB database");
  });

  return db;
}
