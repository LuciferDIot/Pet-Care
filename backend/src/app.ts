import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import petRoutes from "./routes/pet.routes";

// Load environment variables

dotenv.config({
  path: "./.env",
});

// Create a new express application

const app = express();

// Routes

app.use("/api", petRoutes);

app.use(
  bodyParser.json({
    limit: "10kb",
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true,
  })
);

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

export default app;
