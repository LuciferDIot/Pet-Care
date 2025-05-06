// apiEndpoints.ts

export const apiEndpoints = {
  // Health Check
  healthCheck: "/health",

  // Pet Routes
  createPet: "/pets",
  getAllPets: "/pets",
  getPetById: (id: string) => `/pets/${id}`,
  updatePet: (id: string) => `/pets/${id}`,
  deletePet: (id: string) => `/pets/${id}`,
  adoptPet: (id: string) => `/pets/${id}/adopt`,

  // Filter Pets by Mood
  filterPetsByMood: "/pets/filter",

  // Mood Utility Route
  manualMoodUpdate: "/pets/update-moods",

  // Personality Routes
  createPersonality: "/personalities",
  getAllPersonalities: "/personalities",
  getPersonalityById: (id: string) => `/personalities/${id}`,
  updatePersonality: (id: string) => `/personalities/${id}`,
  deletePersonality: (id: string) => `/personalities/${id}`,

  // Species Routes
  createSpecies: "/species",
  getAllSpecies: "/species",
  getSpeciesById: (id: string) => `/species/${id}`,
  updateSpecies: (id: string) => `/species/${id}`,
  deleteSpecies: (id: string) => `/species/${id}`,
};
