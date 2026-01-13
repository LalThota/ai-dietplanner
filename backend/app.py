from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load ML Model
model = None
le = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fitness_model.pkl')
LE_PATH = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')

try:
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(LE_PATH, 'rb') as f:
            le = pickle.load(f)
        print("ML Model loaded successfully.")
    else:
        print("Model file not found. Using rule-based fallback.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/')
def home():
    return jsonify({"message": "AI Workout & Diet Planner API is running"})

@app.route('/api/predict-fitness', methods=['POST'])
def predict_fitness():
    """
    Predict fitness level using ML model if available, else rules.
    """
    data = request.json
    try:
        age = data.get('age')
        bmi = data.get('bmi')
        activity = data.get('activity_level')
        
        if model and le:
            # Predict using model
            # Features: Age, BMI, ActivityLevel
            features = np.array([[age, bmi, activity]])
            prediction_idx = model.predict(features)[0]
            fitness_level = le.inverse_transform([prediction_idx])[0]
            method = "ml_model"
        else:
            # Rule-based fallback
            if bmi < 18.5 or bmi > 30:
                fitness_level = "Beginner"
            elif 18.5 <= bmi <= 25 and activity >= 2:
                fitness_level = "Intermediate"
            elif activity == 3:
                fitness_level = "Advanced"
            else:
                fitness_level = "Beginner"
            method = "rule_based"
        
        return jsonify({"fitness_level": fitness_level, "method": method})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    """
    Generate Workout and Diet plan based on user profile and constraints.
    """
    data = request.json
    fitness = data.get('fitness_level', 'Beginner')
    gym = data.get('gymAccess', 'No')
    goal = data.get('goal', 'Fitness')
    diet_pref = data.get('dietPreference', 'Veg')
    budget = data.get('budget', 'Medium')
    
    # --- Workout Plan Logic ---
    workout_plan = ""
    
    if gym == 'No':
        base_workout = "Home Workout Routine (No Equipment)"
        if fitness == 'Beginner':
             workout_plan = (f"{base_workout} - Beginner Focus on Form:\n"
                             "Mon: 15 mins Full Body (10 Squats, 10 Pushups/Knee-pushups, 15s Plank)\n"
                             "Tue: 20 mins Brisk Walk\n"
                             "Wed: 15 mins Core (Crunches, Leg Raises)\n"
                             "Thu: Rest\n"
                             "Fri: 15 mins Full Body (Repeat Mon)\n"
                             "Sat: Active Rest (Stretching)\n"
                             "Sun: Rest")
        elif fitness == 'Intermediate':
             workout_plan = (f"{base_workout} - Intensity Increased:\n"
                             "Mon: 30 mins HIIT (Burpees, High Knees, Mountain Climbers)\n"
                             "Tue: 45 mins Jogging/Run\n"
                             "Wed: Upper Body Strength (Pushups: 3x15, Chair Dips: 3x12)\n"
                             "Thu: Active Recovery (Yoga)\n"
                             "Fri: Lower Body Strength (Lunges: 3x20, Squat Jumps: 3x15)\n"
                             "Sat: 60 mins Sport/Activity\n"
                             "Sun: Rest")
        else: # Advanced
             workout_plan = (f"{base_workout} - High Intensity:\n"
                             "Mon: Calisthenics Circuit (Pullups if bar avail, Diamond Pushups, Pistol Squat progs)\n"
                             "Tue: 5km Run (Target < 25mins)\n"
                             "Wed: Core Shred (Plank variations 5 mins, Leg raises, Russian twists)\n"
                             "Thu: HIIT Cardio (Tabata style)\n"
                             "Fri: Endurance Training (100 Burpees challenge)\n"
                             "Sat: Long Run / Cycling\n"
                             "Sun: Rest")
    else:
        base_workout = "Gym Workout Routine"
        if goal == 'Muscle Gain':
            split = "Push/Pull/Legs"
            workout_plan = (f"{base_workout} - {split} Split:\n"
                            "Mon: Push (Bench Press, Overhead Press, Triceps)\n"
                            "Tue: Pull (Lat Pulldown, Rows, Biceps)\n"
                            "Wed: Legs (Squats, Leg Press, Calves)\n"
                            "Thu: Rest\n"
                            "Fri: Upper Body Compound\n"
                            "Sat: Lower Body & Abs\n"
                            "Sun: Rest")
        else:
             workout_plan = (f"{base_workout} - General Fitness:\n"
                             "Mon: Full Body Strength (Compound movements)\n"
                             "Tue: Cardio (Treadmill/Elliptical 30 mins)\n"
                             "Wed: Active Recovery\n"
                             "Thu: Upper Body Focus\n"
                             "Fri: Lower Body Focus\n"
                             "Sat: Functional Training / Classes\n"
                             "Sun: Rest")

    # --- Diet Plan Logic ---
    diet_plan = ""
    # Simple templates based on budget and preference
    cheap_prot = "Eggs, Lentils, Soya Chunks" if diet_pref != 'Vegan' else "Lentils, Soya, Chickpeas"
    rich_prot = "Chicken Breast, Fish, Whey Protein" if diet_pref == 'Non-Veg' else ("Paneer, Greek Yogurt, Whey" if diet_pref == 'Veg' else "Tofu, Quinoa, Vegan Protein")
    
    protein_source = cheap_prot if budget == 'Low' else rich_prot
    
    diet_plan = (f"Target: {goal} | Diet: {diet_pref} | Budget: {budget}\n\n"
                 f"Breakfast: Oatmeal with Milk/Water + Fruit + ({protein_source.split(',')[0]})\n"
                 f"Lunch: Rice/Roti + Dal/Vegetables + Portion of {protein_source.split(',')[1]}\n"
                 f"Snack: Fruit / Nuts / Green Tea\n"
                 f"Dinner: Salad + Light portion of Carb + {protein_source.split(',')[-1] if len(protein_source.split(',')) > 2 else protein_source.split(',')[0]}\n\n"
                 f"Hydration: Drink 3-4 Liters of water daily.\n"
                 f"Note: Adjust portion sizes based on hunger and results.")

    return jsonify({
        "workout_plan": workout_plan,
        "diet_plan": diet_plan
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
