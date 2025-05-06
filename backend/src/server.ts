import app from "./app";
import { connectToDatabase } from "./config/db";

connectToDatabase(process.env.MONGODB_URI as string).then(async () => {
  console.log("Connected to MongoDB database");

  // Initialize sample data if needed
  if (process.env.INITIALIZE_DATA === "true") {
    const { PetService } = await import("./services/pet.service");
    await PetService.initializeData();
    console.log("Sample data initialized");
  }

  // Start the server
  app.listen(process.env.HTTP_PORT, () => {
    console.log("Server is running on port " + process.env.HTTP_PORT);
  });
});
