"use client";

import type { Pet } from "@/types/pet";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Edit, Eye, Heart, Trash2 } from "lucide-react";
import MoodBadge from "./mood-badge";
import { PetImage } from "./pet-image";

interface PetCardProps {
  pet: Pet;
  onEdit: () => void;
  onDelete: () => void;
  onAdopt: () => void;
  onView: () => void;
}

export default function PetCard({
  pet,
  onEdit,
  onDelete,
  onAdopt,
  onView,
}: PetCardProps) {
  const timeInSystem = formatDistanceToNow(pet.created_at, {
    addSuffix: false,
  });

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
        pet.adopted ? "opacity-75 grayscale" : ""
      }`}
      variants={item}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <PetImage
          image={pet.image}
          name={pet.name}
          species={pet.species.name}
          className="w-full h-48 object-cover"
        />
        <MoodBadge mood={pet.mood} className="absolute top-3 right-3" />
        {pet.adopted && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-pink-600 text-white px-4 py-2 rounded-full font-bold transform -rotate-12">
              Adopted!
            </div>
          </div>
        )}

        {/* View button overlay */}
        <button
          onClick={onView}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group"
          aria-label="View pet details"
        >
          <span className="bg-white/90 text-purple-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
            <Eye size={18} />
            View Details
          </span>
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
          <span className="text-sm font-medium text-gray-500">
            {pet.age} years
          </span>
        </div>

        <p className="text-gray-600 mb-2">
          {pet.species.name} • {pet.personality.name}
        </p>

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Clock size={12} className="mr-1" />
          In system for {timeInSystem}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-100"
              aria-label="Edit pet"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-100"
              aria-label="Delete pet"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {!pet.adopted && (
            <button
              onClick={onAdopt}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Heart size={16} className="fill-current" />
              Adopt Me!
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
