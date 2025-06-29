// AI Service for communicating with Python EfficientNet backend

const API_BASE_URL = 'http://localhost:5000';

export interface AIAnalysisResult {
  growthAssessment: {
    stage: string;
    health: 'excellent' | 'good' | 'fair' | 'poor';
    confidence: number;
    description: string;
    nextStage: string;
    estimatedDays: number;
    currentStageIndex: number;
    totalStages: number;
    progressPercentage: number;
  };
  anomalies: {
    detected: boolean;
    issues: Array<{
      type: 'disease' | 'pest' | 'nutrient' | 'water' | 'light';
      severity: 'low' | 'medium' | 'high';
      description: string;
      confidence: number;
      recommendations: string[];
    }>;
  };
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  analysisDate: string;
  modelUsed: string;
  confidence: number;
}

export interface AnalysisRequest {
  image: string; // base64 encoded image
  plantType: string;
  plantedDate: string;
}

class AIService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the AI backend is healthy and ready
   */
  async checkHealth(): Promise<{ status: string; model_loaded: boolean; device: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error('AI backend is not available');
    }
  }

  /**
   * Analyze plant image using EfficientNet
   */
  async analyzePlant(request: AnalysisRequest): Promise<AIAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  /**
   * Convert file to base64 for API transmission
   */
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

  /**
   * Analyze plant image from file
   */
  async analyzePlantFromFile(
    file: File, 
    plantType: string, 
    plantedDate: string
  ): Promise<AIAnalysisResult> {
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(file);
      
      // Send to AI backend
      return await this.analyzePlant({
        image: base64Image,
        plantType,
        plantedDate,
      });
    } catch (error) {
      console.error('Error analyzing plant from file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService(); 