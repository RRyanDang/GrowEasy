import React, { useState } from 'react';
import { 
  X, Camera, Upload, Calendar, Droplets, Sun, Thermometer, 
  CheckCircle, Clock, AlertCircle, TrendingUp, FileText 
} from 'lucide-react';
import { aiService, AIAnalysisResult } from '../services/aiService';
import { generateProgressStages, ProgressStage } from '../utils/plantStages';

interface Plant {
  id: string;
  name: string;
  type: string;
  plantedDate: string;
  lastWatered: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  image?: string;
}

interface PlantDetailViewProps {
  plant: Plant;
  onClose: () => void;
  onUpdatePlant: (plantId: string, updates: Partial<Plant>) => void;
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

const PlantDetailView: React.FC<PlantDetailViewProps> = ({ plant, onClose, onUpdatePlant }) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'tasks' | 'photos' | 'care'>('progress');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analysisDate, setAnalysisDate] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Generate progress stages based on plant type and AI analysis
  const getProgressStages = (): ProgressStage[] => {
    if (aiAnalysis) {
      // Use actual data from AI analysis
      return generateProgressStages(
        plant.type,
        aiAnalysis.growthAssessment.currentStageIndex,
        aiAnalysis.growthAssessment.totalStages
      );
    } else {
      // Default to stage 0 (first stage) for newly planted seeds
      return generateProgressStages(plant.type, 0, 5); // Default to 5 stages
    }
  };

  const progressStages = getProgressStages();

  // Mock daily tasks
  const dailyTasks: DailyTask[] = [
    {
      id: '1',
      title: 'Water the plant',
      description: 'Check soil moisture and water if needed',
      completed: true,
      dueDate: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Check for pests',
      description: 'Inspect leaves and stems for any signs of pests',
      completed: false,
      dueDate: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Fertilize',
      description: 'Apply organic fertilizer to promote growth',
      completed: false,
      dueDate: new Date().toISOString()
    }
  ];

  // Check backend health on component mount
  React.useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await aiService.checkHealth();
      setBackendStatus('available');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('unavailable');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setAiAnalysis(null);
    
    try {
      // Use real AI service
      const result = await aiService.analyzePlantFromFile(file, plant.type, plant.plantedDate);
      setAiAnalysis(result);
      setAnalysisDate(new Date().toLocaleString());
      
      // Update plant health based on AI analysis
      onUpdatePlant(plant.id, { health: result.overallHealth });
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Show error message to user
      alert('AI analysis failed. Please check if the Python backend is running on port 5000.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const healthColors = {
    excellent: 'text-green-600 bg-green-100',
    good: 'text-blue-600 bg-blue-100',
    fair: 'text-yellow-600 bg-yellow-100',
    poor: 'text-red-600 bg-red-100'
  };

  const severityColors = {
    low: 'text-yellow-600 bg-yellow-100',
    medium: 'text-orange-600 bg-orange-100',
    high: 'text-red-600 bg-red-100'
  };

  const tabs = [
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'tasks', name: 'Daily Tasks', icon: CheckCircle },
    { id: 'photos', name: 'Photo Analysis', icon: Camera },
    { id: 'care', name: 'Care Guide', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{plant.name}</h2>
            <p className="text-gray-600">{plant.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-garden-green text-garden-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Growth Progress</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${healthColors[plant.health]}`}>
                  {plant.health} health
                </span>
              </div>

              {/* Progress Overview */}
              {aiAnalysis && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-900">Current Progress</h4>
                    <span className="text-lg font-bold text-green-700">
                      {aiAnalysis.growthAssessment.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${aiAnalysis.growthAssessment.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-green-700 text-sm">
                    Stage {aiAnalysis.growthAssessment.currentStageIndex + 1} of {aiAnalysis.growthAssessment.totalStages}: {aiAnalysis.growthAssessment.stage}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {progressStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.completed 
                        ? 'bg-green-500 text-white' 
                        : stage.current 
                        ? 'bg-garden-green text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stage.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{stage.name}</h4>
                        {stage.current && (
                          <span className="px-2 py-1 bg-garden-green text-white text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{stage.description}</p>
                      <p className="text-gray-500 text-xs mt-1">Duration: {stage.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Growth Timeline</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Planted on {new Date(plant.plantedDate).toLocaleDateString()}
                      {aiAnalysis && (
                        <>
                          <br />
                          Current stage: {aiAnalysis.growthAssessment.stage}
                          <br />
                          Next stage: {aiAnalysis.growthAssessment.nextStage} in ~{aiAnalysis.growthAssessment.estimatedDays} days
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Today's Tasks</h3>
              {dailyTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <button
                    onClick={() => {
                      // Toggle task completion
                    }}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-garden-green border-garden-green' 
                        : 'border-gray-300'
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Analysis</h3>
                <div className="flex items-center space-x-3">
                  {/* Backend Status Indicator */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      backendStatus === 'available' ? 'bg-green-500' : 
                      backendStatus === 'unavailable' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs text-gray-500">
                      {backendStatus === 'available' ? 'AI Ready' : 
                       backendStatus === 'unavailable' ? 'AI Offline' : 'Checking...'}
                    </span>
                  </div>
                  
                  <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center space-x-2 ${
                    backendStatus === 'available' 
                      ? 'bg-garden-green hover:bg-garden-dark text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}>
                    <Camera className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={backendStatus !== 'available'}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadingPhoto && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-garden-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing with EfficientNet AI...</p>
                  <p className="text-sm text-gray-500 mt-2">Extracting features and classifying plant health</p>
                </div>
              )}

              {analysisDate && (
                <div className="text-sm text-gray-500 mb-4">
                  Last analysis: {analysisDate}
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <>
                  {/* Growth Assessment */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-green-900">Growth Assessment</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${healthColors[aiAnalysis.growthAssessment.health]}`}>
                            {aiAnalysis.growthAssessment.health} health
                          </span>
                          <span className="text-xs text-green-600">
                            {Math.round(aiAnalysis.growthAssessment.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-green-700 text-sm">{aiAnalysis.growthAssessment.description}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-green-600 text-xs">
                            <strong>Progress:</strong> {aiAnalysis.growthAssessment.progressPercentage}% complete
                          </p>
                          <p className="text-green-600 text-xs">
                            <strong>Stage:</strong> {aiAnalysis.growthAssessment.currentStageIndex + 1} of {aiAnalysis.growthAssessment.totalStages} - {aiAnalysis.growthAssessment.stage}
                          </p>
                          <p className="text-green-600 text-xs">
                            <strong>Next:</strong> {aiAnalysis.growthAssessment.nextStage} in ~{aiAnalysis.growthAssessment.estimatedDays} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Anomaly Detection */}
                  {aiAnalysis.anomalies.detected && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">EfficientNet Detected Issues</h4>
                          <div className="mt-2 space-y-3">
                            {aiAnalysis.anomalies.issues.map((issue, index) => (
                              <div key={index} className="bg-white p-3 rounded border border-yellow-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[issue.severity]}`}>
                                    {issue.severity} severity
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {Math.round(issue.confidence * 100)}% confidence
                                  </span>
                                </div>
                                <p className="text-yellow-700 text-sm mb-2">{issue.description}</p>
                                <div>
                                  <p className="text-xs font-medium text-yellow-900 mb-1">Recommendations:</p>
                                  <ul className="text-yellow-700 text-xs space-y-1">
                                    {issue.recommendations.map((rec, recIndex) => (
                                      <li key={recIndex}>• {rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overall Recommendations */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">AI Recommendations</h4>
                        <ul className="text-blue-700 text-sm mt-1 space-y-1">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Analysis Tips */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Photos Analysis Tips</h4>
                    <ul className="text-gray-700 text-sm mt-1 space-y-1">
                      <li>• Take photos in natural daylight for optimal feature extraction</li>
                      <li>• Include entire plant and close-ups of any visible issues</li>
                      {/* <li>• EfficientNet analyzes 224x224 pixel features for classification</li> */}
                      <li>• AI confidence scores indicate analysis reliability</li>
                      <li>• Upload photos weekly for consistent health monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analysis History */}
              {analysisDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Analysis History</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{analysisDate}</span>
                      <span className="text-green-600">✓ EfficientNet Analysis Complete</span>
                    </div>
                    {aiAnalysis && (
                      <div className="text-xs text-gray-500">
                        {aiAnalysis.anomalies.detected 
                          ? `${aiAnalysis.anomalies.issues.length} issue(s) detected with ${Math.round(aiAnalysis.growthAssessment.confidence * 100)}% growth confidence`
                          : `No issues detected with ${Math.round(aiAnalysis.growthAssessment.confidence * 100)}% growth confidence`
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Care Instructions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Watering</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Water when the top inch of soil feels dry. {plant.type} plants typically need 
                    consistent moisture but avoid overwatering.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-medium">Sunlight</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Most {plant.type} plants prefer full sun (6-8 hours daily). 
                    Ensure they receive adequate light for optimal growth.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium">Temperature</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Ideal temperature range: 65-75°F (18-24°C). 
                    Protect from frost and extreme temperature fluctuations.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">Fertilizing</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Apply organic fertilizer every 2-3 weeks during growing season. 
                    Use balanced fertilizer for healthy growth.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetailView; 