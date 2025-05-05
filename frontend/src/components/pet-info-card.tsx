import type { Pet } from "@/types/pet"
import { formatDistanceToNow } from "date-fns"

interface PetInfoCardProps {
  pet: Pet
}

export default function PetInfoCard({ pet }: PetInfoCardProps) {
  const timeInSystem = formatDistanceToNow(pet.created_at, { addSuffix: true })

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-gray-800">Pet Information</h3>
      <div className="mt-2 space-y-1 text-sm">
        <p>Added to system: {timeInSystem}</p>
        <p>
          Mood changes based on time in system:
          <ul className="ml-5 list-disc mt-1">
            <li>Less than 1 day: Happy</li>
            <li>1-3 days: Excited</li>
            <li>More than 3 days: Sad</li>
          </ul>
        </p>
      </div>
    </div>
  )
}
