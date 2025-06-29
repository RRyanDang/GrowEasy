import React, { useState } from 'react';
import { Plus, Camera, Upload } from 'lucide-react';
import PlantDetailView from './PlantDetailView';
import AddPlantModal from './AddPlantModal';
import { storage } from '../utils/storage';

interface Plant {
  id: string;
  name: string;
  type: string;
  plantedDate: string;
  lastWatered: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  plantingArea?: string;
}

interface Zone {
  id: string;
  name: string;
  size: string;
  sunlight: 'full' | 'partial' | 'shade';
  soilType: string;
  plants: string[];
  image?: string;
  analysis?: any;
}

interface YourPlantProps {
  availableAreas: Zone[];
  onAreasUpdate: (areas: Zone[]) => void;
}

const YourPlant: React.FC<YourPlantProps> = ({ availableAreas, onAreasUpdate }) => {
  const [plants, setPlants] = useState<Plant[]>(() => storage.getPlants());
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const addPlant = (plantData: { name: string; type: string; plantingArea?: string }) => {
    const newPlant: Plant = {
      id: Date.now().toString(),
      name: plantData.name,
      type: plantData.type,
      plantedDate: new Date().toISOString().split('T')[0],
      lastWatered: new Date().toISOString().split('T')[0],
      health: 'good',
      plantingArea: plantData.plantingArea
    };
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    storage.savePlants(updatedPlants);
    setShowAddModal(false);
  };

  const updatePlant = (plantId: string, updates: Partial<Plant>) => {
    const updatedPlants = plants.map((p: Plant) => p.id === plantId ? { ...p, ...updates } : p);
    setPlants(updatedPlants);
    storage.savePlants(updatedPlants);
  };

  const deletePlant = (plantId: string) => {
    const updatedPlants = plants.filter((p: Plant) => p.id !== plantId);
    setPlants(updatedPlants);
    storage.savePlants(updatedPlants);
    setSelectedPlant(null);
  };

  const healthColors = {
    excellent: 'text-green-600 bg-green-100',
    good: 'text-blue-600 bg-blue-100',
    fair: 'text-yellow-600 bg-yellow-100',
    poor: 'text-red-600 bg-red-100'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Plants</h2>
          <p className="text-gray-600 mt-1">Track and care for your garden</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-garden-green hover:bg-garden-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plant</span>
        </button>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant: Plant) => (
          <div
            key={plant.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative"
            onClick={() => setSelectedPlant(plant)}
          >
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10"
              onClick={e => {
                e.stopPropagation();
                // Remove plant from area if assigned
                if (plant.plantingArea) {
                  const updatedAreas = availableAreas.map(area =>
                    area.id === plant.plantingArea
                      ? { ...area, plants: area.plants.filter(pid => pid !== plant.id) }
                      : area
                  );
                  onAreasUpdate(updatedAreas);
                }
                deletePlant(plant.id);
              }}
              title="Delete plant"
            >
              ✕
            </button>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{plant.name}</h3>
                <p className="text-gray-600">{plant.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${healthColors[plant.health]}`}>
                {plant.health}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Planted:</span>
                <span className="font-medium">{new Date(plant.plantedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Watered:</span>
                <span className="font-medium">{new Date(plant.lastWatered).toLocaleDateString()}</span>
              </div>
              {plant.plantingArea && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{
                    availableAreas.find(area => area.id === plant.plantingArea)?.name || plant.plantingArea
                  }</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {plants.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants yet</h3>
          <p className="text-gray-600 mb-4">Add your first plant to start tracking your garden</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-garden-green hover:bg-garden-dark text-white px-6 py-2 rounded-lg"
          >
            Add Your First Plant
          </button>
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPlant={addPlant}
        availableZones={availableAreas}
      />

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <PlantDetailView
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onUpdatePlant={updatePlant}
        />
      )}
    </div>
  );
};

export default YourPlant; 