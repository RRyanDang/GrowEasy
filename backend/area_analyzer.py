from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import io
from PIL import Image
import numpy as np
import torch
import torch.nn as nn
import cv2

app = Flask(__name__)
CORS(app)

# Simple U-Net-like model for area segmentation
class SimpleUNet(nn.Module):
    def __init__(self):
        super(SimpleUNet, self).__init__()
        # Minimal U-Net architecture
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(16, 16, 3, padding=1),
            nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.Conv2d(16, 16, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(16, 1, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x

model = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_model():
    global model
    model = SimpleUNet()
    model.eval()
    model.to(device)
    print("U-Net model loaded")

def analyze_area(image_data):
    """Analyze planting area from image"""
    try:
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Resize for processing
        image = image.resize((256, 256))
        image_array = np.array(image)  # Keep as uint8 (0-255)
        
        # Convert to tensor for model (normalize to 0-1)
        image_tensor = torch.FloatTensor(image_array).permute(2, 0, 1).unsqueeze(0).to(device) / 255.0
        
        # Simple area calculation (placeholder for U-Net)
        with torch.no_grad():
            # Use uint8 image for OpenCV color conversion
            hsv = cv2.cvtColor(image_array, cv2.COLOR_RGB2HSV)
            lower_green = np.array([35, 20, 20])
            upper_green = np.array([85, 255, 255])
            green_mask = cv2.inRange(hsv, lower_green, upper_green)
            area_percentage = np.sum(green_mask > 0) / (256 * 256) * 100
            
            # Calculate usable area
            usable_area = area_percentage * 0.8  # Assume 80% is usable
            
            # Simple recommendations based on area
            if usable_area > 70:
                recommendation = "Large area - Plant in rows with 2-3 feet spacing"
            elif usable_area > 40:
                recommendation = "Medium area - Use square foot gardening method"
            else:
                recommendation = "Small area - Focus on vertical gardening and containers"
        
        return {
            'totalArea': round(area_percentage, 1),
            'usableArea': round(usable_area, 1),
            'recommendation': recommendation,
            'plantingMethod': 'rows' if usable_area > 50 else 'square_foot',
            'estimatedPlants': int(usable_area / 4)  # Rough estimate
        }
        
    except Exception as e:
        print(f"Error analyzing area: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

@app.route('/analyze-area', methods=['POST'])
def analyze_planting_area():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'Missing image data'}), 400
        
        result = analyze_area(data['image'])
        if result is None:
            return jsonify({'error': 'Failed to analyze area'}), 400
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in analyze-area endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Loading U-Net model...")
    load_model()
    print("Starting area analyzer server...")
    app.run(debug=True, host='0.0.0.0', port=5001) 