"use client"

import type React from "react"

import type { Pet } from "@/types/pet"
import { AlertTriangle } from "lucide-react"
import { useRef } from "react"

interface DeleteConfirmationProps {
  pet: Pet
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmation({ pet, onConfirm, onCancel }: DeleteConfirmationProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8 p-6 text-center" ref={modalRef}>
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Pet</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete {pet.name}? This action cannot be undone.</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
