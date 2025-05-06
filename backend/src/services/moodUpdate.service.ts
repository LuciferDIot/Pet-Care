import moment from "moment-timezone";
import cron from "node-cron";
import PetModel from "../models/petModel";
import { calculateMood } from "../utils/moodLogic";

export class MoodUpdateService {
  private static instance: MoodUpdateService;
  private job: cron.ScheduledTask | null = null;
  private readonly timezone: string = "Asia/Colombo"; // Sri Lanka timezone

  private constructor() {}

  public static getInstance(): MoodUpdateService {
    if (!MoodUpdateService.instance) {
      MoodUpdateService.instance = new MoodUpdateService();
    }
    return MoodUpdateService.instance;
  }

  public start(): void {
    // Schedule job to run every day at midnight Sri Lanka time
    this.job = cron.schedule("0 0 * * *", this.updateAllPetMoods.bind(this), {
      scheduled: true,
      timezone: this.timezone,
    });

    console.log(
      "Mood update scheduler started for Sri Lanka timezone (Asia/Colombo)"
    );
    console.log("Next run at:", this.getNextRunTime());
  }

  private getNextRunTime(): string {
    return moment()
      .tz(this.timezone)
      .add(1, "day")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  private async updateAllPetMoods(): Promise<void> {
    try {
      const now = moment().tz(this.timezone);
      console.log(
        `Starting midnight mood update at ${now.format(
          "YYYY-MM-DD HH:mm:ss"
        )} Sri Lanka time`
      );

      const pets = await PetModel.find().lean();

      for (const pet of pets) {
        const newMood = calculateMood(pet.created_at, pet.adopted);
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

  public stop(): void {
    if (this.job) {
      this.job.stop();
      console.log("Mood update scheduler stopped");
    }
  }

  public async triggerManualUpdate(): Promise<void> {
    await this.updateAllPetMoods();
  }
}
