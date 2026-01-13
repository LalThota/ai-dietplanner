# StudentFit AI - Personalized Workout & Diet Planner

## Project Overview
This is an AI-powered fitness application designed for students. It generates personalized workout and diet plans based on:
- BMI & Logic-based Fitness Assessment
- Budget Constraints
- Available Time & Equipment
- Dietary Preferences

## Tech Stack
- **Frontend**: React (Vite), Modern CSS (Glassmorphism)
- **Backend**: Python (Flask)
- **AI/ML**: Scikit-Learn (Random Forest) to classify fitness levels (Trained on synthetic data)

## Setup & Run

### 1. Prerequisites
- Node.js installed
- Python installed

### 2. Installation
Backend:
```bash
pip install -r backend/requirements.txt
```

Frontend:
```bash
cd frontend
npm install
```

### 3. Running the App
Double-click `run_app.bat` 
OR run manually:

Terminal 1 (Backend):
```bash
python backend/app.py
```
(Note: First time run will use the pre-trained `backend/fitness_model.pkl`. To retrain: `python backend/train_model.py`)

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
