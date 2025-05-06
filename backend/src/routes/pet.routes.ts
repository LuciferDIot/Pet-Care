import express from "express";
import { PetController } from "../controllers/pet.controller";
import { MoodUpdateService } from "../services/moodUpdate.service";

const router = express.Router();

// Pet routes
router.post("/pets", PetController.createPet);
router.get("/pets", PetController.getAllPets);
router.get("/pets/:id", PetController.getPetById);
router.put("/pets/:id", PetController.updatePet);
router.delete("/pets/:id", PetController.deletePet);
router.patch("/pets/:id/adopt", PetController.adoptPet);

// Filter pets by mood
router.get("/pets/filter", PetController.filterPetsByMood);

// Personality routes
router.get("/personalities", PetController.getAllPersonalities);

// Species routes
router.get("/species", PetController.getAllSpecies);

// Test route for manual mood update trigger
router.post("/pets/update-moods", (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    const moodUpdateService = MoodUpdateService.getInstance();
    moodUpdateService.triggerManualUpdate();
    res.json({ message: "Manual mood update triggered" });
  } else {
    res.status(403).json({ error: "Not allowed in production" });
  }
});

export default router;
