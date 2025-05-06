import { usePetMutations } from "@/hooks/usePets";
import { usePetStore } from "@/stores/pet-store";
import type { Pet } from "@/types/pet";
import { motion } from "framer-motion";
import { useState } from "react";
import AdoptionModal from "./adoption-modal";
import DeleteConfirmation from "./delete-confirmation";
import PetCard from "./pet-card";
import PetDetailsModal from "./pet-details-modal";

interface PetGridProps {
  onEdit: (pet: Pet) => void;
}

export default function PetGrid({ onEdit }: PetGridProps) {
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [petToAdopt, setPetToAdopt] = useState<Pet | null>(null);
  const [petIdToView, setPetId] = useState<string | null>(null);

  const pets = usePetStore((state) => state.filteredPets);
  const { deletePetMutation, adoptPetMutation } = usePetMutations();

  const onDelete = (id: string) => {
    deletePetMutation.mutate(id);
  };

  const onAdopt = (id: string) => {
    adoptPetMutation.mutate(id);
  };

  const handleDeleteClick = (pet: Pet) => {
    setPetToDelete(pet);
  };

  const handleAdoptClick = (pet: Pet) => {
    setPetToAdopt(pet);
  };

  const confirmDelete = () => {
    if (petToDelete && petToDelete.id) {
      onDelete(petToDelete.id);
      setPetToDelete(null);
    }
  };

  const confirmAdopt = () => {
    if (petToAdopt && petToAdopt.id) {
      onAdopt(petToAdopt.id);
    }
  };

  const handleAdoptFromDetails = () => {
    if (petIdToView) {
      onAdopt(petIdToView);
      setPetId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {pets.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-600">No pets found</h3>
          <p className="text-gray-500 mt-2">
            Try changing your filter or add a new pet!
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={() => onEdit(pet)}
              onDelete={() => handleDeleteClick(pet)}
              onAdopt={() => handleAdoptClick(pet)}
              onView={() => setPetId(pet.id ?? null)}
            />
          ))}
        </motion.div>
      )}

      {petToDelete && (
        <DeleteConfirmation
          pet={petToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setPetToDelete(null)}
        />
      )}

      {petToAdopt && (
        <AdoptionModal
          pet={petToAdopt}
          onConfirm={confirmAdopt}
          onCancel={() => setPetToAdopt(null)}
        />
      )}

      {petIdToView && (
        <PetDetailsModal
          petId={petIdToView}
          onClose={() => setPetId(null)}
          onAdopt={handleAdoptFromDetails}
        />
      )}
    </>
  );
}
