import express from "express";
import { PersonalityController } from "../controllers/personality.controller";

const router = express.Router();

router.get("/", PersonalityController.getAllPersonalities);
router.get("/:id", PersonalityController.getPersonalityById);
router.post("/", PersonalityController.createPersonality);
router.put("/:id", PersonalityController.updatePersonality);
router.delete("/:id", PersonalityController.deletePersonality);

export default router;
