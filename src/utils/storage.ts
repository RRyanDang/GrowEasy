// Simple localStorage utility
const STORAGE_KEYS = {
  PLANTS: 'growEasy_plants',
  AREAS: 'growEasy_areas'
};

export const storage = {
  getPlants: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePlants: (plants: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
    } catch (error) {
      console.error('Failed to save plants:', error);
    }
  },

  getAreas: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AREAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAreas: (areas: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
    } catch (error) {
      console.error('Failed to save areas:', error);
    }
  }
}; 