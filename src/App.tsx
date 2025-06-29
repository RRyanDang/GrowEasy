import React, { useState } from 'react';
import { Sprout, MapPin, BookOpen } from 'lucide-react';
import YourPlant from './components/YourPlant';
import PlantDetailView from './components/PlantDetailView';
import PlantingArea from './components/PlantingArea';
import PlantDictionary from './components/PlantDictionary';
import { storage } from './utils/storage';

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

type ActiveTab = 'plants' | 'areas' | 'dictionary';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('plants');
  const [areas, setAreas] = useState<Zone[]>(() => storage.getAreas());

  const updateAreas = (newAreas: Zone[]) => {
    setAreas(newAreas);
    storage.saveAreas(newAreas);
  };

  const tabs = [
    {
      id: 'plants' as ActiveTab,
      name: 'Your Plants',
      icon: Sprout,
      description: 'Track and manage your plants'
    },
    {
      id: 'areas' as ActiveTab,
      name: 'Planting Areas',
      icon: MapPin,
      description: 'Plan and organize your garden'
    },
    {
      id: 'dictionary' as ActiveTab,
      name: 'Plant Dictionary',
      icon: BookOpen,
      description: 'Learn about different plants'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'plants':
        return <YourPlant availableAreas={areas} onAreasUpdate={updateAreas} />;
      case 'areas':
        return <PlantingArea onAreasUpdate={updateAreas} />;
      case 'dictionary':
        return <PlantDictionary />;
      default:
        return <YourPlant availableAreas={areas} onAreasUpdate={updateAreas} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GrowEasy</h1>
                <p className="text-sm text-gray-600">AI Gardening Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-garden-green text-garden-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App; 