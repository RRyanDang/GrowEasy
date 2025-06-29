# GrowEasy Backend

A Flask-based backend for the GrowEasy plant monitoring application that provides plant analysis, growth tracking, and plant information services.

## Features

- **Plant Health Analysis**: Uses EfficientNet-B0 for image-based plant health assessment
- **Growth Stage Tracking**: Determines plant growth stages based on planting date and health
- **Anomaly Detection**: Identifies diseases, nutrient deficiencies, and other plant issues
- **Plant Information**: Integrates with Perenual API for comprehensive plant data
- **Care Recommendations**: Provides personalized care tips based on plant type and health

## API Endpoints

### Health Check
- `GET /health` - Check server and model status

### Plant Analysis
- `POST /analyze` - Analyze plant image and health
  - Requires: `image` (base64), `plantType`, `plantedDate`

### Plant Search
- `GET /plant-search?q=<query>` - Search for plant information using Perenual API

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Get a Perenual API key:
   - Visit [Perenual API](https://perenual.com/docs/api)
   - Sign up for a free account
   - Get your API key

3. Update the API key in `app.py`:
```python
api_key = 'sk-YourPerenualAPIKeyHere'  # Replace with your actual API key
```

4. Run the server:
```bash
python app.py
```

## Perenual API Integration

The backend now uses the Perenual API instead of Trefle for plant information. Perenual provides:

- Comprehensive plant database with 400,000+ species
- Detailed care information (watering, sunlight, maintenance)
- Growth characteristics and requirements
- High-quality plant images
- Scientific classification data

### API Features Used

- **Species List**: Search for plants by common name
- **Species Details**: Get detailed care and growth information
- **Plant Images**: Access high-quality plant photos
- **Care Guidelines**: Watering, sunlight, and maintenance requirements

## Model Information

- **EfficientNet-B0**: Pre-trained image classification model
- **Feature Extraction**: Uses the last layer before classification
- **Health Analysis**: Simulated based on extracted features
- **Growth Stages**: Plant-specific growth stage definitions

## Response Format

### Plant Search Response
```json
{
  "query": "tomato",
  "results": [
    {
      "id": 123,
      "common_name": "Tomato",
      "scientific_name": "Solanum lycopersicum",
      "family": "Solanaceae",
      "genus": "Solanum",
      "image_url": "https://...",
      "description": "...",
      "care_tips": ["..."],
      "sunlight": "full",
      "water_needs": "average",
      "difficulty": "medium",
      "growth_rate": "fast",
      "growing_season": "Spring to Fall",
      "max_height": "200",
      "min_temp": "10"
    }
  ],
  "total": 1
}
```

## Error Handling

- API rate limiting and timeout handling
- Graceful fallback for missing plant data
- Comprehensive error logging
- User-friendly error messages

## Development

The backend is designed to be easily extensible:
- Add new plant types to `PLANT_STAGES`
- Extend disease patterns in `DISEASE_PATTERNS`
- Implement real ML models for health analysis
- Add more API integrations as needed

## 🌟 Features

- **EfficientNet-B0 Model**: Pre-trained deep learning model for plant analysis
- **Plant Health Assessment**: Analyzes plant health and growth stages
- **Disease Detection**: Identifies common plant diseases and issues
- **Growth Stage Classification**: Determines current growth stage based on time and visual analysis
- **RESTful API**: Clean API endpoints for frontend integration
- **GPU Support**: Automatic GPU detection for faster processing
- **Virtual Environment**: Isolated Python environment for clean dependency management

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Run the startup script (Recommended):**
   ```bash
   python start_backend.py
   ```

   This script will:
   - Check Python version compatibility
   - Create a virtual environment (`venv/`)
   - Install all required dependencies in the virtual environment
   - Check for GPU availability
   - Start the Flask server

### Alternative Setup Methods

#### Windows Users
```bash
# Double-click or run:
start_backend.bat

# Or manually activate environment:
activate_env.bat
```

#### Unix/Linux/Mac Users
```bash
# Make script executable (first time only):
chmod +x activate_env.sh

# Run the activation script:
./activate_env.sh
```

#### Manual Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and model information.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda" // or "cpu"
}
```

### Plant Analysis
```
POST /analyze
```
Analyzes plant images using EfficientNet.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "plantType": "Tomato",
  "plantedDate": "2024-03-15"
}
```

**Response:**
```json
{
  "growthAssessment": {
    "stage": "Vegetative Growth",
    "health": "good",
    "confidence": 0.85,
    "description": "Your Tomato is progressing well...",
    "nextStage": "Flowering",
    "estimatedDays": 30
  },
  "anomalies": {
    "detected": false,
    "issues": []
  },
  "overallHealth": "good",
  "recommendations": [
    "Continue regular watering",
    "Monitor for any changes"
  ],
  "analysisDate": "2024-03-20T10:30:00",
  "modelUsed": "EfficientNet-B0",
  "confidence": 0.85
}
```

## 🔧 Technical Details

### Virtual Environment
The backend uses a Python virtual environment (`venv/`) to:
- Isolate dependencies from system Python
- Ensure consistent package versions
- Avoid conflicts with other projects
- Make deployment easier

### Model Architecture
- **Base Model**: EfficientNet-B0 (pre-trained on ImageNet)
- **Input Size**: 224x224 pixels
- **Feature Extraction**: Global average pooling
- **Classification**: Custom plant health classifier

### Supported Plant Types
- Tomatoes, Lettuce, Basil, Peppers
- Cucumbers, Carrots, Spinach, Kale
- Herbs: Mint, Rosemary, Thyme, Oregano
- Fruits: Strawberries, Blueberries, Raspberries
- Flowers: Sunflowers, Marigolds, Lavender

### Disease Detection
The model can detect:
- **Diseases**: Early Blight, Late Blight, Leaf Spot
- **Nutrient Issues**: Nitrogen deficiency, phosphorus deficiency
- **Water Issues**: Overwatering, underwatering
- **Pest Problems**: Insect infestations

## 🛠️ Development

### Project Structure
```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── start_backend.py    # Startup script with virtual environment
├── start_backend.bat   # Windows startup script
├── activate_env.bat    # Windows virtual environment activation
├── activate_env.sh     # Unix/Linux/Mac virtual environment activation
└── README.md          # This file
```

### Virtual Environment Management

#### Creating a New Environment
```bash
python start_backend.py  # Automatically creates venv/
```

#### Activating Environment Manually
```bash
# Windows
venv\Scripts\activate

# Unix/Linux/Mac
source venv/bin/activate
```

#### Deactivating Environment
```bash
deactivate
```

#### Removing Environment
```bash
# Windows
rmdir /s venv

# Unix/Linux/Mac
rm -rf venv
```

### Adding New Plant Types

1. **Update PLANT_STAGES** in `app.py`:
   ```python
   PLANT_STAGES['NewPlant'] = ['Germination', 'Growth', 'Maturity']
   ```

2. **Add disease patterns** in `DISEASE_PATTERNS`:
   ```python
   DISEASE_PATTERNS['NewPlant'] = {
       'Disease Name': {'symptoms': [...], 'severity': 'medium'}
   }
   ```

### Customizing the Model

1. **Change EfficientNet version** in `load_model()`:
   ```python
   model = EfficientNet.from_pretrained('efficientnet-b1')  # or b2, b3, etc.
   ```

2. **Add custom classifiers** in `analyze_plant_health()`:
   ```python
   # Add your custom classification logic here
   ```

## 🚀 Performance

### Hardware Requirements
- **Minimum**: 4GB RAM, CPU only
- **Recommended**: 8GB+ RAM, GPU with CUDA support

### Processing Time
- **CPU**: ~2-3 seconds per image
- **GPU**: ~0.5-1 second per image

### Model Size
- EfficientNet-B0: ~29MB
- Virtual environment: ~500MB
- Total backend size: ~600MB

## 🔍 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   # Make sure virtual environment is activated
   source venv/bin/activate  # Unix/Linux/Mac
   venv\Scripts\activate     # Windows
   
   # Reinstall requirements
   pip install -r requirements.txt
   ```

2. **Virtual environment issues**
   ```bash
   # Remove and recreate virtual environment
   rm -rf venv  # Unix/Linux/Mac
   rmdir /s venv  # Windows
   python start_backend.py
   ```

3. **CUDA/GPU issues**
   - Install CUDA toolkit if using GPU
   - Fallback to CPU automatically

4. **Port 5000 already in use**
   ```bash
   # Change port in app.py
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```

5. **Memory issues**
   - Reduce batch size
   - Use smaller EfficientNet variant (B1, B2)

### Debug Mode
Enable debug mode for detailed logs:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📊 Monitoring

### Health Check
Monitor backend health:
```bash
curl http://localhost:5000/health
```

### Logs
Check Flask logs for errors and performance metrics.

### Virtual Environment Status
```bash
# Check if virtual environment is active
echo $VIRTUAL_ENV  # Unix/Linux/Mac
echo %VIRTUAL_ENV% # Windows
```

## 🔐 Security

- CORS enabled for frontend integration
- Input validation for all endpoints
- Error handling for malformed requests
- No sensitive data storage
- Isolated virtual environment

## 📈 Future Enhancements

- [ ] Model fine-tuning on plant datasets
- [ ] Real-time video analysis
- [ ] Weather integration
- [ ] Multi-language support
- [ ] Batch processing
- [ ] Model versioning
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 