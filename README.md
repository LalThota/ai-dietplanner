# StudentFit AI - Personalized Workout & Diet Planner

StudentFit AI is an intelligent fitness application designed specifically for students. It generates personalized workout routines and diet plans based on user profiles, budget, and access to equipment. It also features an AI chatbot for fitness queries and an AI Food Analyzer.

## 🚀 Features

### 1. **Personalized Planning**
- **Fitness Prediction**: Uses Machine Learning (Random Forest) to predict your fitness level based on Age, BMI, and Activity Level.
- **Custom Workouts**: Generates routines (Home/Gym) tailored to your goal (Weight Loss, Muscle Gain, Fitness).
- **Budget-Friendly Diets**: Suggests meals (Veg/Non-Veg) that fit a student's budget.

### 2. **AI Fitness Assistant (Chatbot)** 💬
- **Smart Queries**: Ask about specific foods ("protein in eggs"), workouts ("how to do squats"), or general health tips.
- **Interactive UI**: Floating chat interface with "Thinking..." indicators and auto-scrolling.

### 3. **AI Food Analyzer** 📷
- **Photo Upload**: Upload a photo of your meal.
- **Nutrient Breakdown**: Get estimated Calories, Protein, Carbs, and Fats.
- **Dark Mode UI**: Sleek, modern interface for photo uploads.

### 4. **PDF Export** 📄
- **Downloadable Plans**: Export your generated workout and diet plan as a professionally formatted PDF.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS Modules (Glassmorphism design)
- **Backend**: Flask (Python), Scikit-learn (ML Model)
- **PDF Generation**: jsPDF
- **Icons**: standard emoji / React icons logic

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js & npm
- Python 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/LalThota/ai-dietplanner.git
cd ai-dietplanner
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```
*Note: Ensure you have `flask`, `flask-cors`, `numpy`, `pandas`, `scikit-learn` installed.*

Start the Flask server:
```bash
python app.py
```
Server runs at: `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```
App runs at: `http://localhost:5173`

---

## 📖 Usage

1. **Enter Details**: Fill in your Age, Height, Weight, and Goals.
2. **Generate Plan**: The AI predicts your fitness level and creates a plan.
3. **Chat**: Use the bottom-right bubble to ask questions like "Why drink water?".
4. **Analyze Food**: Go to the "Food Analyzer" tab to upload food pics.
5. **Download**: Click "Download PDF Plan" to save your routine.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.

---

## 📜 License

This project is open-source.
