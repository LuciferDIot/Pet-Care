import type React from "react";

import type { Pet } from "@/types/pet";
import confetti from "canvas-confetti";
import { Download, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AdoptionModalProps {
  pet: Pet;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdoptionModal({
  pet,
  onConfirm,
  onCancel,
}: AdoptionModalProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !showCertificate) {
      onCancel();
    }
  };

  useEffect(() => {
    if (showCertificate) {
      // Trigger confetti effect
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showCertificate]);

  const handleConfirm = () => {
    setShowCertificate(true);
    onConfirm();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        {!showCertificate ? (
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Heart className="h-8 w-8 text-pink-600 fill-current" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Adopt {pet.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to adopt {pet.name}? This will mark the pet
              as adopted in our system.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-1"
              >
                <Heart size={16} className="fill-current" />
                Adopt Now
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="border-4 border-double border-purple-200 p-6 mb-4 bg-purple-50 text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-1">
                Certificate of Adoption
              </h2>
              <p className="text-sm text-purple-600 mb-4">
                Virtual Pet Adoption Center
              </p>

              <p className="mb-2">This certifies that</p>
              <p className="text-xl font-bold text-purple-900 mb-2">YOU</p>
              <p className="mb-2">have officially adopted</p>
              <p className="text-xl font-bold text-purple-900 mb-2">
                {pet.name} the {pet.species.name}
              </p>
              <p className="mb-4">on {formatDate(new Date())}</p>

              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-pink-600 fill-current" />
                </div>
              </div>

              <p className="text-sm text-purple-600 italic">
                Thank you for giving {pet.name} a loving virtual home!
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <Download size={16} />
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
