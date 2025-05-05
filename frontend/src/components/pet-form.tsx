"use client";

import type React from "react";

import { MoodEnum, type Pet } from "@/types/pet";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import SearchableDropdown from "./searchable-dropdown";
import { getSpeciesImage } from "@/lib/pet-utils";

interface PetFormProps {
  pet?: Pet;
  onSubmit: (pet: Pet) => void;
  onCancel: () => void;
  speciesList: string[];
  personalityList: string[];
  onAddSpecies: (species: string) => void;
  onAddPersonality: (personality: string) => void;
}

export default function PetForm({
  pet,
  onSubmit,
  onCancel,
  speciesList,
  personalityList,
  onAddSpecies,
  onAddPersonality,
}: PetFormProps) {
  const [formData, setFormData] = useState({
    name: pet?.name || "",
    species: pet?.species || "",
    age: pet?.age || "",
    personality: pet?.personality || "",
    image: pet?.image || "",
    description: pet?.description || "", // Added description field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(
    pet?.image || null
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSpeciesChange = (value: string) => {
    setFormData((prev) => ({ ...prev, species: value }));

    if (errors.species) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.species;
        return newErrors;
      });
    }
  };

  const handlePersonalityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, personality: value }));

    if (errors.personality) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.personality;
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For a real app, you would upload this to a server or cloud storage
    // Here we'll just use a data URL for demonstration
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.species.trim()) {
      newErrors.species = "Species is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      newErrors.age = "Age must be a positive number";
    }

    if (!formData.personality.trim()) {
      newErrors.personality = "Personality is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submittedPet: Pet = {
      ...formData,
      age: Number(formData.age),
      mood: MoodEnum.Happy,
      id: pet?.id || "",
      adopted: pet?.adopted || false, // Default to false if not provided
      created_at: pet?.created_at || new Date(), // Default to current timestamp
      ...(pet?.id
        ? {
            id: pet.id,
            adopted: pet.adopted,
            adoption_date: pet.adoption_date,
            created_at: pet.created_at,
          }
        : {}),
    };

    onSubmit(submittedPet);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not the modal content
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md my-8 overflow-hidden"
        ref={modalRef}
      >
        <div className="flex justify-between items-center p-5 bg-purple-600 text-white">
          <h2 className="text-xl font-bold">
            {pet ? "Edit Pet" : "Add New Pet"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-purple-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-32 h-32 mb-3">
              <img
                src={
                  previewImage ||
                  getSpeciesImage(formData.species, pet?.image, 200, 200)
                }
                alt="Pet preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer"
              >
                <Upload size={16} />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">
              Click the icon to upload a pet image
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Pet name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="species"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Species
            </label>
            <SearchableDropdown
              id="species"
              name="species"
              value={formData.species}
              options={speciesList}
              onChange={handleSpeciesChange}
              placeholder="Dog, Cat, Rabbit, etc."
              error={errors.species}
              onAddOption={onAddSpecies}
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age (years)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              step="0.1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Pet age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="personality"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Personality
            </label>
            <SearchableDropdown
              id="personality"
              name="personality"
              value={formData.personality}
              options={personalityList}
              onChange={handlePersonalityChange}
              placeholder="Describe the pet's personality"
              error={errors.personality}
              onAddOption={onAddPersonality}
            />
          </div>

          {/* Added description field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tell us more about this pet..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {pet ? "Update Pet" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
