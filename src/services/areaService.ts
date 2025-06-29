const AREA_API_BASE_URL = 'http://localhost:5001';

export interface AreaAnalysisResult {
  totalArea: number;
  usableArea: number;
  recommendation: string;
  plantingMethod: 'rows' | 'square_foot';
  estimatedPlants: number;
}

class AreaService {
  private baseUrl: string;

  constructor(baseUrl: string = AREA_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Area service health check error:', error);
      throw new Error('Area analyzer backend is not available');
    }
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  }

  async analyzeAreaFromFile(file: File): Promise<AreaAnalysisResult> {
    try {
      const base64Image = await this.fileToBase64(file);
      
      const response = await fetch(`${this.baseUrl}/analyze-area`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Area analysis failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Area analysis error:', error);
      throw error;
    }
  }
}

export const areaService = new AreaService(); 