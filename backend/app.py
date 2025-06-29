#.\.venv\Scripts\activate


from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import io
from PIL import Image
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms
from efficientnet_pytorch import EfficientNet
import cv2
from datetime import datetime
import json
import requests

app = Flask(__name__)
CORS(app)

# Global variables for model
model = None
device = None
transform = None

# Plant growth stages
PLANT_STAGES = {
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
}

# Disease patterns for different plants
DISEASE_PATTERNS = {
    'Tomato': {
        'Early Blight': {'symptoms': ['brown spots', 'yellow leaves'], 'severity': 'medium'},
        'Late Blight': {'symptoms': ['dark lesions', 'white mold'], 'severity': 'high'},
        'Leaf Spot': {'symptoms': ['circular spots', 'yellowing'], 'severity': 'low'},
        'Blossom End Rot': {'symptoms': ['black bottom', 'fruit damage'], 'severity': 'medium'},
        'Nitrogen Deficiency': {'symptoms': ['yellow leaves', 'stunted growth'], 'severity': 'medium'},
        'Overwatering': {'symptoms': ['wilting', 'yellow leaves'], 'severity': 'low'}
    },
    'Lettuce': {
        'Downy Mildew': {'symptoms': ['yellow spots', 'white fuzz'], 'severity': 'high'},
        'Bacterial Leaf Spot': {'symptoms': ['brown spots', 'holes'], 'severity': 'medium'},
        'Tip Burn': {'symptoms': ['brown edges', 'leaf damage'], 'severity': 'low'},
        'Overwatering': {'symptoms': ['wilting', 'root rot'], 'severity': 'medium'}
    }
}

def load_model():
    """Load EfficientNet model"""
    global model, device, transform
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Load pre-trained EfficientNet
    model = EfficientNet.from_pretrained('efficientnet-b0')
    model.eval()
    model.to(device)
    
    # Define image transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    print("EfficientNet model loaded successfully!")

def preprocess_image(image_data):
    """Preprocess image for EfficientNet"""
    try:
        # Check if model and transform are loaded
        if transform is None or device is None:
            print("Model or transform not loaded")
            return None, None
            
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Apply transformations
        tensor = transform(image)  # This returns a torch.Tensor
        image_tensor = tensor.unsqueeze(0).to(device)
        
        return image_tensor, image
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None, None

def extract_features(image_tensor):
    """Extract features using EfficientNet"""
    try:
        # Check if model is loaded
        if model is None:
            print("Model not loaded")
            return None
            
        with torch.no_grad():
            # Get features from the last layer before classification
            features = model.extract_features(image_tensor)
            # Global average pooling
            features = torch.nn.functional.adaptive_avg_pool2d(features, 1)
            features = features.squeeze().cpu().numpy()
            return features
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

def analyze_plant_health(features, plant_type):
    """Analyze plant health based on extracted features"""
    try:
        # Simulate health analysis based on feature patterns
        # In a real implementation, you would have a trained classifier here
        
        # Generate health scores based on feature statistics
        feature_mean = np.mean(features)
        feature_std = np.std(features)
        
        # Simulate health classification
        health_score = np.clip(feature_mean * 0.5 + feature_std * 0.3, 0.1, 0.95)
        
        # Simulate disease detection
        disease_score = np.random.uniform(0, 0.4)  # Low disease probability
        nutrient_score = np.random.uniform(0, 0.3)
        pest_score = np.random.uniform(0, 0.2)
        water_score = np.random.uniform(0, 0.3)
        
        return {
            'healthy': health_score,
            'diseased': disease_score,
            'nutrientDeficient': nutrient_score,
            'pestInfested': pest_score,
            'overwatered': water_score,
            'underwatered': np.random.uniform(0, 0.2)
        }
    except Exception as e:
        print(f"Error analyzing plant health: {e}")
        return None

def determine_growth_stage(plant_type, days_since_planting, health_analysis):
    """Determine growth stage based on time and health analysis"""
    try:
        stages = PLANT_STAGES.get(plant_type, PLANT_STAGES['Tomato'])
        health_score = health_analysis['healthy']
        total_stages = len(stages)
        
        # For newly planted seeds (0-3 days), always start at stage 0 (first stage)
        if days_since_planting <= 3:
            current_stage_index = 0
        # For very young plants (4-14 days), likely still in germination/seedling
        elif days_since_planting <= 14:
            current_stage_index = min(1, total_stages - 1)
        # For young plants (15-30 days), likely in early vegetative growth
        elif days_since_planting <= 30:
            current_stage_index = min(2, total_stages - 1)
        # For maturing plants (31-60 days), likely in flowering or fruiting
        elif days_since_planting <= 60:
            current_stage_index = min(3, total_stages - 1)
        # For mature plants (60+ days), likely in final stages
        else:
            current_stage_index = min(4, total_stages - 1)
        
        # Adjust based on health - poor health can regress growth stage
        if health_score < 0.4:
            current_stage_index = max(0, current_stage_index - 1)
        elif health_score < 0.6:
            # Don't progress as quickly with fair health
            current_stage_index = max(0, current_stage_index - 1)
        
        # Ensure we don't exceed the number of stages for this plant
        current_stage_index = min(current_stage_index, total_stages - 1)
        
        current_stage = stages[current_stage_index]
        
        # Determine next stage (if not at final stage)
        if current_stage_index < total_stages - 1:
            next_stage = stages[current_stage_index + 1]
        else:
            next_stage = current_stage  # Already at final stage
        
        # Determine health level
        if health_score > 0.8:
            health = 'excellent'
        elif health_score > 0.6:
            health = 'good'
        elif health_score > 0.4:
            health = 'fair'
        else:
            health = 'poor'
        
        # Calculate estimated days to next stage based on plant type and current health
        if current_stage_index < total_stages - 1:
            # Base progression time varies by plant type
            base_progression_days = {
                'Tomato': 30, 'Pepper': 25, 'Cucumber': 20, 'Strawberry': 25,
                'Lettuce': 15, 'Spinach': 12, 'Kale': 18, 'Basil': 20,
                'Mint': 15, 'Rosemary': 25, 'Thyme': 20, 'Oregano': 20,
                'Parsley': 18, 'Cilantro': 15, 'Carrot': 35, 'Blueberry': 30,
                'Raspberry': 25, 'Sunflower': 20, 'Marigold': 18, 'Lavender': 25
            }
            base_days = base_progression_days.get(plant_type, 25)
            
            # Adjust based on health - better health means faster progression
            if health == 'excellent':
                estimated_days = max(5, base_days - 10)
            elif health == 'good':
                estimated_days = max(8, base_days - 5)
            elif health == 'fair':
                estimated_days = base_days
            else:  # poor health
                estimated_days = base_days + 10
        else:
            estimated_days = 0  # Already at final stage
        
        return {
            'stage': current_stage,
            'health': health,
            'confidence': health_score,
            'nextStage': next_stage,
            'estimatedDays': estimated_days,
            'currentStageIndex': current_stage_index,
            'totalStages': total_stages
        }
    except Exception as e:
        print(f"Error determining growth stage: {e}")
        return None

def detect_anomalies(health_analysis, plant_type):
    """Detect anomalies based on health analysis"""
    try:
        issues = []
        disease_patterns = DISEASE_PATTERNS.get(plant_type, DISEASE_PATTERNS['Tomato'])
        
        # Check for diseases
        if health_analysis['diseased'] > 0.3:
            issues.append({
                'type': 'disease',
                'severity': 'high' if health_analysis['diseased'] > 0.6 else 'medium',
                'description': 'Plant disease detected - possible fungal or bacterial infection',
                'confidence': health_analysis['diseased'],
                'recommendations': ['Apply fungicide', 'Improve air circulation', 'Remove affected leaves']
            })
        
        # Check for nutrient deficiency
        if health_analysis['nutrientDeficient'] > 0.4:
            issues.append({
                'type': 'nutrient',
                'severity': 'medium',
                'description': 'Nutrient deficiency detected - likely nitrogen or phosphorus',
                'confidence': health_analysis['nutrientDeficient'],
                'recommendations': ['Apply balanced fertilizer', 'Check soil pH', 'Add organic matter']
            })
        
        # Check for pests
        if health_analysis['pestInfested'] > 0.3:
            issues.append({
                'type': 'pest',
                'severity': 'high' if health_analysis['pestInfested'] > 0.5 else 'low',
                'description': 'Pest activity detected - inspect for insects',
                'confidence': health_analysis['pestInfested'],
                'recommendations': ['Inspect underside of leaves', 'Apply organic pest control', 'Remove affected parts']
            })
        
        # Check for watering issues
        if health_analysis['overwatered'] > 0.4:
            issues.append({
                'type': 'water',
                'severity': 'medium',
                'description': 'Overwatering detected - soil may be too wet',
                'confidence': health_analysis['overwatered'],
                'recommendations': ['Reduce watering frequency', 'Improve drainage', 'Check soil moisture']
            })
        
        return {
            'detected': len(issues) > 0,
            'issues': issues
        }
    except Exception as e:
        print(f"Error detecting anomalies: {e}")
        return {'detected': False, 'issues': []}

def generate_recommendations(growth_stage, anomalies, plant_type):
    """Generate care recommendations"""
    try:
        recommendations = []
        
        # Growth-based recommendations
        if growth_stage['health'] == 'poor':
            recommendations.extend(['Increase watering frequency', 'Add organic fertilizer'])
        
        # Anomaly-based recommendations
        for issue in anomalies['issues']:
            recommendations.extend(issue['recommendations'])
        
        # Plant-specific recommendations
        if plant_type == 'Tomato':
            recommendations.extend(['Provide support as plant grows', 'Prune suckers for better fruit production'])
        elif plant_type == 'Lettuce':
            recommendations.extend(['Harvest outer leaves first', 'Provide shade in hot weather'])
        
        return recommendations[:5]  # Limit to top 5
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return ['Continue regular watering', 'Monitor for any changes']

def generate_stage_description(plant_type, growth_stage, days_since_planting):
    """Generate a descriptive sentence for the growth stage"""
    stage = growth_stage['stage']
    health = growth_stage['health']
    next_stage = growth_stage['nextStage']
    estimated_days = growth_stage['estimatedDays']
    
    # For newly planted seeds (0-3 days)
    if days_since_planting <= 3:
        return f"Your {plant_type} has just been planted! It's in the {stage.lower()} stage and will begin to grow soon."
    
    # For plants in germination stage
    if stage == 'Germination':
        return f"Your {plant_type} is in the germination stage. Keep the soil moist and warm for optimal sprouting."
    
    # For plants in seedling stage
    elif stage == 'Seedling':
        return f"Your {plant_type} is in the seedling stage with {health} health. Continue providing adequate light and water."
    
    # For plants in vegetative growth
    elif stage == 'Vegetative Growth':
        return f"Your {plant_type} is growing well in the vegetative stage with {health} health. Estimated {estimated_days} days until {next_stage.lower()}."
    
    # For plants in flowering stage
    elif stage == 'Flowering':
        return f"Your {plant_type} is flowering! This is an exciting stage with {health} health. Estimated {estimated_days} days until {next_stage.lower()}."
    
    # For plants in fruiting stage
    elif stage == 'Fruiting':
        return f"Your {plant_type} is producing fruit with {health} health! Harvest when ready."
    
    # For plants in maturity stage
    elif stage == 'Maturity':
        return f"Your {plant_type} has reached maturity with {health} health. Ready for harvest!"
    
    # For other stages
    else:
        return f"Your {plant_type} is in the {stage.lower()} stage with {health} health. Estimated {estimated_days} days until {next_stage.lower()}."

def calculate_progress_percentage(current_stage_index, total_stages):
    """Calculate the progress percentage of the plant"""
    return round((current_stage_index + 1) / total_stages * 100, 1)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device) if device else None
    })

@app.route('/analyze', methods=['POST'])
def analyze_plant():
    """Analyze plant image using EfficientNet"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'plantType' not in data or 'plantedDate' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        image_data = data['image']
        plant_type = data['plantType']
        planted_date = data['plantedDate']
        
        # Calculate days since planting
        planted_datetime = datetime.strptime(planted_date, '%Y-%m-%d')
        days_since_planting = (datetime.now() - planted_datetime).days
        
        # Preprocess image
        image_tensor, original_image = preprocess_image(image_data)
        if image_tensor is None:
            return jsonify({'error': 'Failed to process image'}), 400
        
        # Extract features using EfficientNet
        features = extract_features(image_tensor)
        if features is None:
            return jsonify({'error': 'Failed to extract features'}), 400
        
        # Analyze plant health
        health_analysis = analyze_plant_health(features, plant_type)
        if health_analysis is None:
            return jsonify({'error': 'Failed to analyze plant health'}), 400
        
        # Determine growth stage
        growth_stage = determine_growth_stage(plant_type, days_since_planting, health_analysis)
        if growth_stage is None:
            return jsonify({'error': 'Failed to determine growth stage'}), 400
        
        # Detect anomalies
        anomalies = detect_anomalies(health_analysis, plant_type)
        
        # Generate recommendations
        recommendations = generate_recommendations(growth_stage, anomalies, plant_type)
        
        # Determine overall health
        if anomalies['detected'] and any(issue['severity'] == 'high' for issue in anomalies['issues']):
            overall_health = 'poor'
        elif anomalies['detected']:
            overall_health = 'fair'
        elif growth_stage['health'] == 'excellent':
            overall_health = 'excellent'
        else:
            overall_health = 'good'
        
        # Prepare response
        result = {
            'growthAssessment': {
                'stage': growth_stage['stage'],
                'health': growth_stage['health'],
                'confidence': float(growth_stage['confidence']),
                'description': generate_stage_description(plant_type, growth_stage, days_since_planting),
                'nextStage': growth_stage['nextStage'],
                'estimatedDays': growth_stage['estimatedDays'],
                'currentStageIndex': growth_stage['currentStageIndex'],
                'totalStages': growth_stage['totalStages'],
                'progressPercentage': calculate_progress_percentage(growth_stage['currentStageIndex'], growth_stage['totalStages'])
            },
            'anomalies': anomalies,
            'overallHealth': overall_health,
            'recommendations': recommendations,
            'analysisDate': datetime.now().isoformat(),
            'modelUsed': 'EfficientNet-B0',
            'confidence': float(growth_stage['confidence'])
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/plant-search', methods=['GET'])
def plant_search():
    """Search for plant information using Perenual API"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'error': 'Query parameter "q" is required'}), 400
        
        # Perenual API endpoint
        # You'll need to get a free API key from https://perenual.com/docs/api
        api_key = 'sk-pGWp686120dca940011216'  # Replace with your actual API key
        url = f"https://perenual.com/api/species-list?key={api_key}&q={query}"
        response = requests.get(url, timeout=10)
        print("Perenual response:", response.status_code, response.text)
        response.raise_for_status()
        
        data = response.json()
        
        if not data.get('data'):
            return jsonify({'results': [], 'total': 0})
        
        # Extract relevant plant information from Perenual API
        plants = []
        for plant in data['data'][:5]:  # Limit to 5 results
            # Get detailed plant information
            plant_id = plant.get('id')
            if plant_id:
                detail_url = f"https://perenual.com/api/species/details/{plant_id}?key={api_key}"
                try:
                    detail_response = requests.get(detail_url, timeout=10)
                    if detail_response.status_code == 200:
                        detail_data = detail_response.json()
                        plant_detail = detail_data.get('result', {})
                    else:
                        plant_detail = {}
                except:
                    plant_detail = {}
            else:
                plant_detail = {}
            
            # Extract care information
            care_info = plant_detail.get('care', {})
            watering = care_info.get('watering', 'medium')
            sunlight = care_info.get('sunlight', ['full'])
            if isinstance(sunlight, list) and sunlight:
                sunlight = sunlight[0]
            elif not sunlight:
                sunlight = 'full'
            
            # Extract growth information
            growth_info = plant_detail.get('growth', {})
            growth_rate = growth_info.get('growth_rate', 'medium')
            maintenance = growth_info.get('maintenance', 'medium')
            
            # Extract description
            description = plant_detail.get('description', '')
            if not description:
                description = f"A {plant.get('family', 'plant')} species in the {plant.get('genus', 'genus')} genus."
            
            # Generate care tips based on available data
            care_tips = []
            if watering == 'frequent':
                care_tips.append('Water frequently to keep soil moist')
            elif watering == 'average':
                care_tips.append('Water when top inch of soil is dry')
            elif watering == 'minimum':
                care_tips.append('Water sparingly, allow soil to dry between watering')
            
            if 'full' in str(sunlight).lower():
                care_tips.append('Provide full sunlight (6+ hours per day)')
            elif 'partial' in str(sunlight).lower():
                care_tips.append('Provide partial sunlight (3-6 hours per day)')
            elif 'shade' in str(sunlight).lower():
                care_tips.append('Provide shade or indirect light')
            
            if maintenance == 'low':
                care_tips.append('Low maintenance plant, suitable for beginners')
            elif maintenance == 'high':
                care_tips.append('High maintenance plant, requires regular attention')
            
            care_tips.extend([
                'Monitor for pests and diseases',
                'Use well-draining soil',
                'Fertilize during growing season'
            ])
            
            plant_info = {
                'id': plant.get('id'),
                'common_name': plant.get('common_name', 'Unknown'),
                'scientific_name': plant.get('scientific_name', ['Unknown'])[0] if isinstance(plant.get('scientific_name'), list) else plant.get('scientific_name', 'Unknown'),
                'family': plant.get('family', 'Unknown'),
                'genus': plant.get('genus', 'Unknown'),
                'year': plant.get('year'),
                'image_url': plant.get('default_image', {}).get('original_url') if plant.get('default_image') else None,
                'description': description,
                'care_tips': care_tips[:5],  # Limit to 5 tips
                'sunlight': sunlight,
                'water_needs': watering,
                'difficulty': maintenance,
                'growth_rate': growth_rate,
                'growing_season': growth_info.get('season', 'Varies by climate'),
                'max_height': growth_info.get('max_height', {}).get('cm', 'Unknown'),
                'min_temp': growth_info.get('minimum_temperature', {}).get('celsius', 'Unknown')
            }
            plants.append(plant_info)
        
        return jsonify({
            'query': query,
            'results': plants,
            'total': len(plants)
        })
        
    except requests.RequestException as e:
        print(f"Perenual API error: {e}")
        return jsonify({'error': 'Failed to fetch plant data'}), 500
    except Exception as e:
        print(f"Error in plant search: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Loading EfficientNet model...")
    load_model()
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000) 