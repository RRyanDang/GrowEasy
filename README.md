# GrowEasy - AI Gardening Assistant

A modern web application that makes gardening easier for everyone using AI. GrowEasy provides detailed instructions, progress tracking, and AI-powered photo analysis to help you grow healthy plants.

## 🌟 Features

### 🌱 Your Plant
- Track individual plants and their health status
- Monitor planting dates and watering schedules
- **AI Photo Analysis**: Upload photos for EfficientNet-powered health assessment
- View detailed plant information and care history
- Growth stage tracking with timeline predictions

### 🗺️ Planting Area
- Plan and organize your garden zones
- Track sunlight exposure and soil types
- Manage plant placement and garden layout
- Monitor zone-specific conditions

### 📚 Plant Dictionary
- Comprehensive database of plants with care instructions
- Search and filter by plant type, difficulty, and requirements
- Detailed growing guides and care tips
- Scientific information and best practices

## 🏗️ System Architecture

```
GrowEasy/
├── frontend/                 # React TypeScript App
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── ...
│   └── package.json
├── backend/                  # Python Flask + EfficientNet
│   ├── app.py              # Flask server
│   ├── requirements.txt    # Python dependencies
│   ├── start_backend.py    # Startup script (with virtual env)
│   ├── venv/               # Python virtual environment
│   └── ...
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 14 or higher)
- **Python** (version 3.8 or higher)
- **npm** or **yarn**

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The React app will be available at [http://localhost:3000](http://localhost:3000)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run the startup script (recommended - creates virtual environment)
python start_backend.py

# OR for Windows users:
start_backend.bat

# OR manual setup with virtual environment:
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/Linux/Mac
pip install -r requirements.txt
python app.py
```

The Python backend will be available at [http://localhost:5000](http://localhost:5000)

### 3. Verify Setup

1. **Frontend**: Open [http://localhost:3000](http://localhost:3000)
2. **Backend Health**: Visit [http://localhost:5000/health](http://localhost:5000/health)
3. **Test AI**: Upload a plant photo in the "Your Plant" section

## 🤖 AI Features

### EfficientNet Integration
- **Model**: EfficientNet-B0 (pre-trained on ImageNet)
- **Analysis**: Plant health, growth stage, disease detection
- **Processing**: 224x224 pixel input, GPU acceleration support
- **Accuracy**: Confidence scoring for all predictions
- **Environment**: Isolated Python virtual environment for clean dependencies

### Photo Analysis Capabilities
- **Growth Assessment**: Current stage and timeline predictions
- **Health Analysis**: Overall plant health evaluation
- **Disease Detection**: Early blight, late blight, nutrient deficiencies
- **Anomaly Detection**: Pest issues, watering problems
- **Recommendations**: Actionable care advice

### Supported Plant Types
- **Vegetables**: Tomatoes, Lettuce, Peppers, Cucumbers, Carrots
- **Herbs**: Basil, Mint, Rosemary, Thyme, Oregano, Parsley
- **Fruits**: Strawberries, Blueberries, Raspberries
- **Flowers**: Sunflowers, Marigolds, Lavender

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Create React App** for development

### Backend
- **Flask** web framework
- **EfficientNet** deep learning model
- **PyTorch** for AI processing
- **OpenCV** for image processing
- **CORS** for cross-origin requests
- **Python Virtual Environment** for dependency isolation

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Plant Analysis
```
POST /analyze
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "plantType": "Tomato",
  "plantedDate": "2024-03-15"
}
```

## 🔧 Development

### Available Scripts

- `npm start` - Runs the React app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Backend Development

```bash
cd backend
python start_backend.py  # Auto-creates virtual environment and installs dependencies
```

### Virtual Environment Management

The backend uses a Python virtual environment (`venv/`) for clean dependency management:

```bash
# Windows
venv\Scripts\activate
venv\Scripts\deactivate

# Unix/Linux/Mac
source venv/bin/activate
deactivate
```

### Environment Variables

Create `.env` files for custom configurations:

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env):**
```
FLASK_ENV=development
MODEL_PATH=./models
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment
```bash
cd backend
python start_backend.py  # Creates virtual environment
# Or manually:
python -m venv venv
source venv/bin/activate  # Unix/Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
gunicorn app:app -b 0.0.0.0:5000
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend not responding**
   - Check if Python backend is running on port 5000
   - Verify virtual environment is activated
   - Check dependencies: `pip install -r requirements.txt`

2. **AI analysis fails**
   - Ensure EfficientNet model is loaded
   - Check GPU/CPU availability
   - Verify image format (JPEG/PNG)
   - Make sure virtual environment is active

3. **Virtual environment issues**
   ```bash
   # Remove and recreate virtual environment
   rm -rf venv  # Unix/Linux/Mac
   rmdir /s venv  # Windows
   python start_backend.py
   ```

4. **CORS errors**
   - Backend CORS is configured for localhost:3000
   - Check browser console for specific errors

5. **Port conflicts**
   - Frontend: Change port in package.json scripts
   - Backend: Modify port in app.py

### Performance Tips

- **GPU Usage**: Install CUDA for faster AI processing
- **Image Quality**: Use high-resolution photos for better analysis
- **Batch Processing**: Upload multiple photos for comprehensive analysis
- **Virtual Environment**: Keep dependencies isolated for better performance

## 📊 Monitoring

### Health Checks
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000/health](http://localhost:5000/health)

### Logs
- Frontend: Browser console and terminal
- Backend: Flask logs in terminal

### Virtual Environment Status
```bash
# Check if virtual environment is active
echo $VIRTUAL_ENV  # Unix/Linux/Mac
echo %VIRTUAL_ENV% # Windows
```

## 🔐 Security

- CORS configured for development
- Input validation on all endpoints
- No sensitive data storage
- Secure image processing
- Isolated virtual environment

## 📈 Future Enhancements

- **Advanced AI**: Fine-tuned plant-specific models
- **Weather Integration**: Local weather-based recommendations
- **Community Features**: Share garden progress and tips
- **Mobile App**: Native iOS and Android applications
- **Smart Notifications**: AI-powered care reminders
- **Batch Analysis**: Process multiple plants simultaneously
- **Video Analysis**: Real-time plant monitoring
- **Docker Support**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review backend logs for errors
- Ensure virtual environment is properly set up
- Open an issue in the GitHub repository

---

**🌱 Happy Gardening with AI! 🌱** 