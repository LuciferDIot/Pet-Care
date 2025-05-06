import { MoodEnum } from "../types";

export function calculateMood(createdAt: Date): MoodEnum {
  const now = new Date();
  const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return MoodEnum.Happy;
  } else if (diffInHours >= 24 && diffInHours <= 72) {
    return MoodEnum.Excited;
  } else {
    return MoodEnum.Sad;
  }
}
