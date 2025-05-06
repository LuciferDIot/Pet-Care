import express from "express";
import { PetController } from "../controllers/pet.controller";

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

export default router;
