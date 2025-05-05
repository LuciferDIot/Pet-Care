import { MoodEnum } from "@/types/pet";
import { Frown, Smile, Zap } from "lucide-react";

interface MoodBadgeProps {
  mood: MoodEnum;
  className?: string;
}

export default function MoodBadge({ mood, className = "" }: MoodBadgeProps) {
  const getMoodConfig = (mood: MoodEnum) => {
    switch (mood) {
      case MoodEnum.Happy:
        return {
          icon: <Smile className="w-4 h-4" />,
          color: "bg-green-100 text-green-800",
        };
      case MoodEnum.Sad:
        return {
          icon: <Frown className="w-4 h-4" />,
          color: "bg-blue-100 text-blue-800",
        };
      case MoodEnum.Excited:
        return {
          icon: <Zap className="w-4 h-4" />,
          color: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          icon: <Smile className="w-4 h-4" />,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const { icon, color } = getMoodConfig(mood);

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}
    >
      {icon}
      {mood}
    </div>
  );
}
