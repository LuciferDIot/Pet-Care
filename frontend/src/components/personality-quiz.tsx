import type React from "react";

import { MoodEnum, type Pet } from "@/types/pet";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useRef, useState } from "react";

interface PersonalityQuizProps {
  pets: Pet[];
  onClose: () => void;
}

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    traits: string[];
  }[];
}

export default function PersonalityQuiz({
  pets,
  onClose,
}: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      text: "How would you describe your ideal weekend?",
      options: [
        {
          text: "Relaxing at home with a good book",
          traits: ["calm", "independent"],
        },
        {
          text: "Going on an adventure or hiking",
          traits: ["energetic", "adventurous"],
        },
        {
          text: "Spending time with friends and family",
          traits: ["social", "friendly"],
        },
        {
          text: "A mix of relaxation and social activities",
          traits: ["balanced", "adaptable"],
        },
      ],
    },
    {
      id: 2,
      text: "How do you handle stress?",
      options: [
        {
          text: "I need quiet time alone to recharge",
          traits: ["independent", "calm"],
        },
        {
          text: "I talk it out with friends",
          traits: ["social", "expressive"],
        },
        {
          text: "I get active - exercise helps me destress",
          traits: ["energetic", "active"],
        },
        {
          text: "I like to solve problems methodically",
          traits: ["patient", "clever"],
        },
      ],
    },
    {
      id: 3,
      text: "What's your approach to trying new things?",
      options: [
        {
          text: "I'm always the first to try something new",
          traits: ["adventurous", "curious"],
        },
        {
          text: "I prefer sticking to what I know and like",
          traits: ["loyal", "consistent"],
        },
        {
          text: "I'll try new things if friends recommend them",
          traits: ["social", "trusting"],
        },
        {
          text: "I research thoroughly before trying anything new",
          traits: ["cautious", "clever"],
        },
      ],
    },
  ];

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only allow closing by overlay click if we're showing the result
    if (e.target === e.currentTarget && matchedPet) {
      onClose();
    }
  };

  const handleAnswer = (traits: string[]) => {
    const newAnswers = [...answers, ...traits];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Find matching pet
      findMatchingPet(newAnswers);
    }
  };

  const findMatchingPet = (traits: string[]) => {
    // Count occurrences of each trait
    const traitCounts: Record<string, number> = {};
    traits.forEach((trait) => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });

    // Find dominant traits (top 2)
    const dominantTraits = Object.entries(traitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([trait]) => trait);

    // Match pet based on personality and mood
    const availablePets = pets.filter((pet) => !pet.adopted);

    // Simple matching algorithm - can be improved
    let bestMatch: Pet | null = null;
    let highestScore = -1;

    for (const pet of availablePets) {
      let score = 0;

      // Match based on personality keywords
      dominantTraits.forEach((trait) => {
        if (pet.personality.toLowerCase().includes(trait.toLowerCase())) {
          score += 2;
        }
      });

      // Match based on mood
      if (
        (dominantTraits.includes("energetic") &&
          pet.mood === MoodEnum.Excited) ||
        (dominantTraits.includes("calm") && pet.mood === MoodEnum.Happy) ||
        (dominantTraits.includes("social") && pet.mood === MoodEnum.Happy) ||
        (dominantTraits.includes("independent") && pet.mood === MoodEnum.Sad)
      ) {
        score += 1;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = pet;
      }
    }

    // If no good match, just pick a random available pet
    if (!bestMatch && availablePets.length > 0) {
      bestMatch =
        availablePets[Math.floor(Math.random() * availablePets.length)];
    }

    setMatchedPet(bestMatch);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        ref={modalRef}
      >
        <div className="bg-purple-600 text-white p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Find Your Perfect Pet Match</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-purple-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!matchedPet ? (
            <>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / questions.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-purple-600">
                    {currentQuestion + 1}/{questions.length}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {questions[currentQuestion].text}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.traits)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 inline-block bg-green-100 p-3 rounded-full">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                We found your perfect match!
              </h3>

              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-purple-800">
                  {matchedPet.name} the {matchedPet.species}
                </p>
                <p className="text-gray-600">{matchedPet.personality}</p>
                <p className="text-sm mt-2">
                  Current mood:{" "}
                  <span className="font-medium">{matchedPet.mood}</span>
                </p>
              </div>

              <p className="text-gray-600 mb-6">
                Based on your answers, we think you and {matchedPet.name} would
                be a great match!
              </p>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1 mx-auto"
              >
                Meet {matchedPet.name} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
