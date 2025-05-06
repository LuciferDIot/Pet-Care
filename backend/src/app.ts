import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import personalityRoutes from "./routes/personality.routes";
import petRoutes from "./routes/pet.routes";
import speciesRoutes from "./routes/species.routes";

// Load environment variables

dotenv.config({
  path: "./.env",
});

// Create a new express application

const app = express();

// CORS middleware: Allow all origins
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: false, // No need for credentials (cookies, sessions)
  })
);

// Handling preflight requests
app.options("*", cors()); // Allow CORS preflight requests

app.use(
  bodyParser.json({
    limit: "10kb",
  })
);

// Routes
app.use("/api/pets", petRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/personalities", personalityRoutes);

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

export default app;
