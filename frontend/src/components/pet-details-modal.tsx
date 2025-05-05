"use client";

import type React from "react";

import { usePetById } from "@/hooks/usePetById";
import { getSpeciesImage } from "@/lib/pet-utils";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Heart, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import MoodBadge from "./mood-badge";

interface PetDetailsModalProps {
  petId: string;
  onClose: () => void;
  onAdopt?: () => void; // Add onAdopt prop
}

export default function PetDetailsModal({
  petId,
  onClose,
  onAdopt,
}: PetDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: pet, isLoading, isError, error } = usePetById(petId);

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const handleAdoptClick = () => {
    onAdopt?.();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-600 font-medium">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Failed to load pet details
            </h2>
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timeInSystem = formatDistanceToNow(pet.created_at, {
    addSuffix: false,
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 overflow-hidden"
        ref={modalRef}
      >
        <div className="flex justify-between items-center p-5 bg-purple-600 text-white">
          <h2 className="text-xl font-bold">Pet Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-purple-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={
                  getSpeciesImage(pet.species.name, pet.image) ||
                  "/placeholder.svg"
                }
                alt={`${pet.name} the ${pet.species}`}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <MoodBadge mood={pet.mood} />
              </div>
            </div>
          </div>

          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <span className="text-sm font-medium text-gray-500">
                {pet.age} years
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-medium text-purple-700">
                {pet.species.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{pet.personality.name}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                In system for {timeInSystem}
              </div>

              {pet.adopted && pet.adoption_date && (
                <div className="flex items-center text-sm text-pink-600">
                  <Heart size={16} className="mr-2 fill-current" />
                  Adopted on {format(pet.adoption_date, "MMMM d, yyyy")}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                Added on {format(pet.created_at, "MMMM d, yyyy")}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About {pet.name}</h3>
              <p className="text-gray-700">
                {pet.description || `No description available for ${pet.name}.`}
              </p>
            </div>

            {pet.adopted ? (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
                <p className="text-pink-800 font-medium">
                  {pet.name} has found a loving home and is no longer available
                  for adoption.
                </p>
              </div>
            ) : (
              <button
                onClick={handleAdoptClick}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                Interested in adopting {pet.name}?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
