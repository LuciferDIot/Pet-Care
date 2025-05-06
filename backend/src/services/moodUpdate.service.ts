import cron from "node-cron";
import PetModel from "../models/petModel";
import { calculateMood } from "../utils/moodLogic";

export class MoodUpdateService {
  private static instance: MoodUpdateService;
  private job: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): MoodUpdateService {
    if (!MoodUpdateService.instance) {
      MoodUpdateService.instance = new MoodUpdateService();
    }
    return MoodUpdateService.instance;
  }

  public start(): void {
    // Schedule job to run every day at midnight
    this.job = cron.schedule("0 0 * * *", this.updateAllPetMoods.bind(this), {
      scheduled: true,
      timezone: "UTC", // or your preferred timezone
    });

    // Get the next run time (using the correct method)
    const nextRun = this.getNextRunTime();
    console.log("Mood update scheduler started. Next run at:", nextRun);
  }

  public stop(): void {
    if (this.job) {
      this.job.stop();
    }
  }

  private getNextRunTime(): string {
    if (!this.job) return "Not scheduled";

    // Access the underlying cron-parser instance
    const cronParser = (this.job as any).task;
    if (cronParser && typeof cronParser.next === "function") {
      return cronParser.next().toString();
    }
    return "Unknown";
  }

  private async updateAllPetMoods(): Promise<void> {
    try {
      console.log("Starting midnight mood update...");
      const pets = await PetModel.find().lean();

      for (const pet of pets) {
        const newMood = calculateMood(pet.created_at);
        if (newMood !== pet.mood) {
          await PetModel.updateOne(
            { _id: pet._id },
            { $set: { mood: newMood } }
          );
          console.log(
            `Updated mood for pet ${pet.name} (${pet._id}) to ${newMood}`
          );
        }
      }

      console.log("Midnight mood update completed successfully");
    } catch (error) {
      console.error("Error during midnight mood update:", error);
    }
  }

  public async triggerManualUpdate(): Promise<void> {
    await this.updateAllPetMoods();
  }
}
