import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  size: string;
}

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: { name: string; type: string; plantingArea?: string }) => void;
  availableZones?: Zone[];
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onAddPlant, availableZones = [] }) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [plantingArea, setPlantingArea] = useState('');

  const plantTypes = [
    'Tomato', 'Lettuce', 'Basil', 'Pepper', 'Cucumber', 'Carrot', 'Spinach', 
    'Kale', 'Mint', 'Rosemary', 'Thyme', 'Oregano', 'Parsley', 'Cilantro',
    'Strawberry', 'Blueberry', 'Raspberry', 'Sunflower', 'Marigold', 'Lavender'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plantName.trim() && plantType.trim()) {
      onAddPlant({
        name: plantName.trim(),
        type: plantType.trim(),
        plantingArea: plantingArea || undefined
      });
      setPlantName('');
      setPlantType('');
      setPlantingArea('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Plant</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="plantName" className="block text-sm font-medium text-gray-700 mb-2">
              Plant Name
            </label>
            <input
              type="text"
              id="plantName"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., My Tomato Plant"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="plantType" className="block text-sm font-medium text-gray-700 mb-2">
              Plant Type
            </label>
            <select
              id="plantType"
              value={plantType}
              onChange={(e) => setPlantType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-green focus:border-transparent"
              required
            >
              <option value="">Select a plant type</option>
              {plantTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {availableZones.length > 0 && (
            <div>
              <label htmlFor="plantingArea" className="block text-sm font-medium text-gray-700 mb-2">
                Planting Area (Optional)
              </label>
              <select
                id="plantingArea"
                value={plantingArea}
                onChange={(e) => setPlantingArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-green focus:border-transparent"
              >
                <option value="">No specific area</option>
                {availableZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.size})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-garden-green hover:bg-garden-dark text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantModal; 