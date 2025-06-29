import React, { useState } from 'react';
import { Search, BookOpen, Sun, Droplets, Calendar } from 'lucide-react';
import { plantDictionaryService, PlantInfo } from '../services/plantDictionaryService';

const PlantDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState<PlantInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setPlants([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await plantDictionaryService.searchPlants(query);
      setPlants(response.results);
    } catch (err) {
      setError('Failed to search plants. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Plant Dictionary</h2>
        <p className="text-gray-600 mt-1">Search for any plant and get detailed information</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for any plant (e.g., tomato, rose, oak)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-green focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-garden-green mx-auto"></div>
          <p className="text-gray-600 mt-2">Searching plants...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Plants Grid */}
      {!loading && !error && plants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{plant.common_name}</h3>
                  <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[plant.difficulty]}`}>
                  {plant.difficulty}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{plant.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Sun className="w-4 h-4" />
                  <span className="capitalize">{plant.sunlight} sun</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Droplets className="w-4 h-4" />
                  <span className="capitalize">{plant.water_needs} water</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{plant.growing_season}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">Care Tips</h4>
                <ul className="space-y-1">
                  {plant.care_tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-garden-green mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                {plant.care_tips.length > 2 && (
                  <p className="text-sm text-gray-500 mt-2">+{plant.care_tips.length - 2} more tips</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && plants.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">Try a different search term</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !error && plants.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for any plant</h3>
          <p className="text-gray-600">Type a plant name to get detailed information from our database</p>
        </div>
      )}
    </div>
  );
};

export default PlantDictionary; 