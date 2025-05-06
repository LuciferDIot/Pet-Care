import express from "express";
import { PetController } from "../controllers/pet.controller";
import { MoodUpdateService } from "../services/moodUpdate.service";

const router = express.Router();

// Pet routes
router.post("/", PetController.createPet);
router.get("/", PetController.getAllPets);
router.get("/:id", PetController.getPetById);
router.put("/:id", PetController.updatePet);
router.delete("/:id", PetController.deletePet);
router.patch("/:id/adopt", PetController.adoptPet);

// Filter pets by mood
router.get("/filter", PetController.filterPetsByMood);

// Test route for manual mood update trigger
router.post("/update-moods", (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    const moodUpdateService = MoodUpdateService.getInstance();
    moodUpdateService.triggerManualUpdate();
    res.json({ message: "Manual mood update triggered" });
  } else {
    res.status(403).json({ error: "Not allowed in production" });
  }
});

export default router;
