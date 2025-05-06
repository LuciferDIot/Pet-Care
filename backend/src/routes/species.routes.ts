import express from "express";
import { SpeciesController } from "../controllers/species.controller";

const router = express.Router();

router.get("/", SpeciesController.getAllSpecies);
router.get("/:id", SpeciesController.getSpeciesById);
router.post("/", SpeciesController.createSpecies);
router.put("/:id", SpeciesController.updateSpecies);
router.delete("/:id", SpeciesController.deleteSpecies);

export default router;
