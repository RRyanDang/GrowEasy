import React, { useState } from 'react';
import { MapPin, Grid, Sun as SunIcon, Plus, Camera, Upload } from 'lucide-react';
import { areaService, AreaAnalysisResult } from '../services/areaService';
import { storage } from '../utils/storage';

interface Zone {
  id: string;
  name: string;
  size: string;
  sunlight: 'full' | 'partial' | 'shade';
  soilType: string;
  plants: string[];
  image?: string;
  analysis?: AreaAnalysisResult;
}

interface PlantingAreaProps {
  onAreasUpdate: (areas: Zone[]) => void;
}

const PlantingArea: React.FC<PlantingAreaProps> = ({ onAreasUpdate }) => {
  const [zones, setZones] = useState<Zone[]>(() => storage.getAreas());
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  React.useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await areaService.checkHealth();
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
    
    try {
      const result = await areaService.analyzeAreaFromFile(file);
      
      const newZone: Zone = {
        id: Date.now().toString(),
        name: `Planting Area ${zones.length + 1}`,
        size: `${result.usableArea.toFixed(1)}% usable`,
        sunlight: 'full',
        soilType: 'Loamy',
        plants: [],
        analysis: result
      };
      
      const updatedZones = [...zones, newZone];
      setZones(updatedZones);
      storage.saveAreas(updatedZones);
      onAreasUpdate(updatedZones);
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Area analysis failed:', error);
      alert('Area analysis failed. Please check if the area analyzer backend is running on port 5001.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const sunlightColors = {
    full: 'text-yellow-600 bg-yellow-100',
    partial: 'text-orange-600 bg-orange-100',
    shade: 'text-blue-600 bg-blue-100'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Planting Areas</h2>
          <p className="text-gray-600 mt-1">Analyze and optimize your garden spaces</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-garden-green hover:bg-garden-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Area</span>
        </button>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative"
            onClick={() => setSelectedZone(zone)}
          >
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10"
              onClick={e => {
                e.stopPropagation();
                const updatedZones = zones.filter(a => a.id !== zone.id);
                storage.saveAreas(updatedZones);
                onAreasUpdate(updatedZones);
              }}
              title="Delete area"
            >
              ✕
            </button>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{zone.name}</h3>
                <p className="text-gray-600">{zone.size}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${sunlightColors[zone.sunlight]}`}>
                <SunIcon className="w-3 h-3" />
                <span>{zone.sunlight}</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Soil: {zone.soilType}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Grid className="w-4 h-4" />
                <span>{zone.plants.length} plants</span>
              </div>
            </div>

            {zone.analysis && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">{zone.analysis.recommendation}</p>
                <p className="text-xs text-green-600 mt-1">
                  {zone.analysis.estimatedPlants} plants estimated
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {zones.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No planting areas yet</h3>
          <p className="text-gray-600 mb-4">Upload a photo of your garden area to get AI-powered planting recommendations</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-garden-green hover:bg-garden-dark text-white px-6 py-2 rounded-lg"
          >
            Add Your First Area
          </button>
        </div>
      )}

      {/* Add Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Add New Planting Area</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus === 'available' ? 'bg-green-500' : 
                    backendStatus === 'unavailable' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {backendStatus === 'available' ? 'AI Ready' : 
                     backendStatus === 'unavailable' ? 'AI Offline' : 'Checking...'}
                  </span>
                </div>
                
                <label className={`block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  backendStatus === 'available' 
                    ? 'border-gray-300 hover:border-garden-green hover:bg-gray-50' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}>
                  <div className="flex flex-col items-center space-y-2">
                    {uploadingPhoto ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-garden-green"></div>
                        <span className="text-gray-600">Analyzing area...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-600">Upload garden photo</span>
                        <span className="text-xs text-gray-500">AI will analyze optimal planting layout</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={backendStatus !== 'available' || uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Area Detail Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedZone.name}</h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Size</span>
                  <p className="font-medium">{selectedZone.size}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Sunlight</span>
                  <p className="font-medium capitalize">{selectedZone.sunlight}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Soil Type</span>
                  <p className="font-medium">{selectedZone.soilType}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Plants</span>
                  <p className="font-medium">{selectedZone.plants.length}</p>
                </div>
              </div>

              {selectedZone.analysis && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">AI Recommendations</h4>
                  <p className="text-green-700 text-sm mb-2">{selectedZone.analysis.recommendation}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Total Area:</span>
                      <span className="ml-2 text-green-700">{selectedZone.analysis.totalArea}%</span>
                    </div>
                    <div>
                      <span className="text-green-600">Usable Area:</span>
                      <span className="ml-2 text-green-700">{selectedZone.analysis.usableArea}%</span>
                    </div>
                    <div>
                      <span className="text-green-600">Planting Method:</span>
                      <span className="ml-2 text-green-700 capitalize">{selectedZone.analysis.plantingMethod.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Est. Plants:</span>
                      <span className="ml-2 text-green-700">{selectedZone.analysis.estimatedPlants}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <span className="text-gray-600 text-sm">Current Plants</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedZone.plants.map((plant, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {plant}
                    </span>
                  ))}
                  {selectedZone.plants.length === 0 && (
                    <span className="text-gray-500 text-sm">No plants added yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantingArea; 