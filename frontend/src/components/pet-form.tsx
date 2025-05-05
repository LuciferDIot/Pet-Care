"use client";

import { usePetMutations } from "@/hooks/usePets";
import { getSpeciesImage } from "@/lib/pet-utils";
import { petFormSchema, PetFormValues } from "@/schema/pet-form.schema";
import { usePetStore } from "@/stores/pet-store";
import { MoodEnum, type Pet } from "@/types/pet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import SearchableDropdown from "./searchable-dropdown";

interface PetFormProps {
  onCancel: () => void;
}

export default function PetForm({ onCancel }: PetFormProps) {
  const { addPetMutation, updatePetMutation } = usePetMutations();
  const {
    editingPet,
    speciesList,
    personalityList,
    setIsAddingPet,
    setEditingPet,
  } = usePetStore();

  const defaultValues = editingPet
    ? {
        name: editingPet.name,
        species: editingPet.species.name,
        age: editingPet.age,
        personality: editingPet.personality.name,
        description: editingPet.description,
        image: editingPet.image,
      }
    : {
        name: "",
        species: "",
        age: 0,
        personality: "",
        description: "",
        image: "",
      };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const image = useWatch({ control, name: "image" });
  const species = useWatch({ control, name: "species" });

  const handleAddPet = (newPet: Omit<Pet, "id" | "mood" | "created_at">) => {
    addPetMutation.mutate(newPet);
    setIsAddingPet(false);
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    updatePetMutation.mutate(updatedPet);
    setEditingPet(null);
  };

  const onSubmit = (data: PetFormValues) => {
    const submittedPet: Pet = {
      ...data,
      mood: MoodEnum.Happy,
      id: editingPet?.id || "",
      adopted: editingPet?.adopted || false,
      personality:
        personalityList.find((p) => p.name === data.personality) ??
        (() => {
          throw new Error("Personality not found");
        })(),
      species:
        speciesList.find((s) => s.name === data.species) ??
        (() => {
          throw new Error("Species not found");
        })(),
      created_at: editingPet?.created_at || new Date(),
      ...(editingPet?.id
        ? {
            id: editingPet.id,
            adopted: editingPet.adopted,
            adoption_date: editingPet.adoption_date,
            created_at: editingPet.created_at,
          }
        : {}),
    };

    if (editingPet?.id) handleUpdatePet(submittedPet);
    else handleAddPet(submittedPet);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setValue("image", imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
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
            {editingPet ? "Edit Pet" : "Add New Pet"}
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
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 md:p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-32 h-32 mb-3">
              <img
                src={
                  image || getSpeciesImage(species, editingPet?.image, 200, 200)
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
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Pet name"
                />
              )}
            />
            {errors.name && (
              <p className=" text-left mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="species"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Species
            </label>
            <Controller
              name="species"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  id="species"
                  {...field}
                  options={speciesList.map((s) => s.name)}
                  value={field.value}
                  onChange={(value: string) =>
                    field.onChange(speciesList.find((s) => s.name === value))
                  }
                  placeholder="Dog, Cat, Rabbit, etc."
                  error={errors.species?.message}
                />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Age (years)
            </label>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="age"
                  min="0"
                  step="0.1"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Pet age"
                />
              )}
            />
            {errors.age && (
              <p className="text-left mt-1 text-sm text-red-600">
                {errors.age.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="personality"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Personality
            </label>
            <Controller
              name="personality"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  id="personality"
                  options={personalityList.map((p) => p.name)}
                  {...field}
                  value={field.value}
                  onChange={(value: string) =>
                    field.onChange(
                      personalityList.find((p) => p.name === value)
                    )
                  }
                  placeholder="Describe the pet's personality"
                  error={errors.personality?.message}
                />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us more about this pet..."
                />
              )}
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
              {editingPet ? "Update Pet" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
