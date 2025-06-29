// Plant stages data that matches the backend
export const PLANT_STAGES: { [key: string]: string[] } = {
  'Tomato': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting'],
  'Lettuce': ['Germination', 'Seedling', 'Leaf Development', 'Maturity'],
  'Basil': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering'],
  'Pepper': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting'],
  'Cucumber': ['Germination', 'Seedling', 'Vine Growth', 'Flowering', 'Fruiting'],
  'Carrot': ['Germination', 'Seedling', 'Root Development', 'Maturity'],
  'Spinach': ['Germination', 'Seedling', 'Leaf Development', 'Maturity'],
  'Kale': ['Germination', 'Seedling', 'Leaf Development', 'Maturity'],
  'Mint': ['Germination', 'Seedling', 'Vegetative Growth', 'Maturity'],
  'Rosemary': ['Germination', 'Seedling', 'Vegetative Growth', 'Maturity'],
  'Thyme': ['Germination', 'Seedling', 'Vegetative Growth', 'Maturity'],
  'Oregano': ['Germination', 'Seedling', 'Vegetative Growth', 'Maturity'],
  'Parsley': ['Germination', 'Seedling', 'Leaf Development', 'Maturity'],
  'Cilantro': ['Germination', 'Seedling', 'Leaf Development', 'Maturity'],
  'Strawberry': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting'],
  'Blueberry': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting'],
  'Raspberry': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering', 'Fruiting'],
  'Sunflower': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering'],
  'Marigold': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering'],
  'Lavender': ['Germination', 'Seedling', 'Vegetative Growth', 'Flowering']
};

export interface ProgressStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  completed: boolean;
  current: boolean;
}

export const getStageDescription = (stageName: string): string => {
  const descriptions: { [key: string]: string } = {
    'Germination': 'Seeds sprouting and developing roots',
    'Seedling': 'Young plants developing true leaves',
    'Vegetative Growth': 'Plants growing leaves and stems',
    'Vine Growth': 'Plants developing vines and tendrils',
    'Leaf Development': 'Plants developing mature leaves',
    'Root Development': 'Plants developing strong root systems',
    'Flowering': 'Plants producing flowers',
    'Fruiting': 'Plants producing fruits/vegetables',
    'Maturity': 'Plants ready for harvest'
  };
  
  return descriptions[stageName] || 'Plant growth stage';
};

export const getStageDuration = (stageName: string, plantType: string): string => {
  const durations: { [key: string]: { [key: string]: string } } = {
    'Germination': {
      'Tomato': '7-14 days',
      'Lettuce': '5-10 days',
      'Basil': '7-14 days',
      'Carrot': '10-21 days',
      'default': '7-14 days'
    },
    'Seedling': {
      'Tomato': '14-21 days',
      'Lettuce': '10-15 days',
      'Basil': '14-21 days',
      'Carrot': '21-30 days',
      'default': '14-21 days'
    },
    'Vegetative Growth': {
      'Tomato': '30-60 days',
      'Basil': '30-45 days',
      'default': '30-60 days'
    },
    'Leaf Development': {
      'Lettuce': '20-30 days',
      'Spinach': '15-25 days',
      'Kale': '25-35 days',
      'default': '20-30 days'
    },
    'Root Development': {
      'Carrot': '60-80 days',
      'default': '60-80 days'
    },
    'Flowering': {
      'Tomato': '7-14 days',
      'Pepper': '7-14 days',
      'Cucumber': '7-14 days',
      'default': '7-14 days'
    },
    'Fruiting': {
      'Tomato': '30-90 days',
      'Pepper': '45-75 days',
      'Cucumber': '50-70 days',
      'default': '30-90 days'
    },
    'Maturity': {
      'Lettuce': '45-60 days',
      'Spinach': '40-50 days',
      'Kale': '50-65 days',
      'Carrot': '70-80 days',
      'default': '45-60 days'
    }
  };
  
  const stageDurations = durations[stageName];
  if (!stageDurations) return 'Varies by plant';
  
  return stageDurations[plantType] || stageDurations['default'] || 'Varies by plant';
};

export const generateProgressStages = (
  plantType: string, 
  currentStageIndex: number, 
  totalStages: number
): ProgressStage[] => {
  const stages = PLANT_STAGES[plantType] || PLANT_STAGES['Tomato'];
  
  return stages.map((stage: string, index: number) => ({
    id: (index + 1).toString(),
    name: stage,
    description: getStageDescription(stage),
    duration: getStageDuration(stage, plantType),
    completed: index < currentStageIndex,
    current: index === currentStageIndex
  }));
}; 