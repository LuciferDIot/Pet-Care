import app from "./app";
import { connectToDatabase } from "./config/db";
import { MoodUpdateService } from "./services/moodUpdate.service";
import { seedDefaultReferences } from "./utils/seedDefaults";

connectToDatabase(process.env.MONGODB_URI as string).then(async () => {
  console.log("Connected to MongoDB database");

  // Initialize sample data if needed
  if (process.env.INITIALIZE_DATA === "true") {
    const { PetService } = await import("./services/pet.service");
    await PetService.initializeData();
    console.log("Sample data initialized");
  }

  // Seed default references
  await seedDefaultReferences();

  // Start mood update scheduler
  const moodUpdateService = MoodUpdateService.getInstance();
  moodUpdateService.start();

  // Start the server
  app.listen(process.env.HTTP_PORT, () => {
    console.log("Server is running on port " + process.env.HTTP_PORT);
  });
});
