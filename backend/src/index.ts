import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

async function start() {
  // Load environment variables

  dotenv.config({
    path: "./.env",
  });

  // Create a new express application

  const app = express();

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

  app.listen(process.env.HTTP_PORT, () => {
    console.log("Server is running on port " + process.env.HTTP_PORT);
  });
}

start();
