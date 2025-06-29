const API_BASE_URL = 'http://localhost:5000';

export interface PlantInfo {
  id: number;
  common_name: string;
  scientific_name: string;
  family: string;
  genus: string;
  year: number;
  image_url: string;
  description: string;
  care_tips: string[];
  sunlight: 'full' | 'partial' | 'shade';
  water_needs: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  growing_season: string;
}

export interface PlantSearchResponse {
  query: string;
  results: PlantInfo[];
  total: number;
}

class PlantDictionaryService {
  async searchPlants(query: string): Promise<PlantSearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/plant-search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching plants:', error);
      throw error;
    }
  }
}

export const plantDictionaryService = new PlantDictionaryService(); 