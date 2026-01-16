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

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Enhanced rule-based chatbot for fitness & diet queries.
    """
    data = request.json
    message = data.get('message', '').lower()
    
    # Knowledge Base
    responses = {
        # Nutrition & Macros
        "protein": "Protein is essential for muscle repair and growth. Good sources include: Chicken breast, Eggs, Greek Yogurt, Lentils, Cottage Cheese (Paneer), and Soya chunks.",
        "carbs": "Carbohydrates are your body's main energy source. Focus on complex carbs like Oats, Brown Rice, Quinoa, Sweet Potatoes, and Whole Wheat.",
        "fats": "Healthy fats supports hormone health. Include Nuts (Almonds, Walnuts), Seeds (Chia, Flax), Olive Oil, and Avocados in moderation.",
        "fiber": "Fiber aids digestion and keeps you full. Eat plenty of Vegetables, Fruits (Apples, Berries), and Whole Grains.",
        "hydration": "Water is crucial for performance. Aim for 3-4 liters daily. Drink more if you exercise heavily or it's hot.",
        "vitamins": "Eat a rainbow of vegetables to get all necessary vitamins. Spinach, Carrots, Bell Peppers, and Citrus fruits are great choices.",

        # Specific Foods
        "egg": "One large egg contains about 6g of protein and healthy fats. It's a gold standard protein source.",
        "chicken": "Chicken breast is a lean protein powerhouse. 100g yields about 31g of protein with very little fat.",
        "rice": "Rice is a good carb source for energy. White rice is fast-digesting (good post-workout), brown rice is slower (good for sustained energy).",
        "milk": "Milk is great for hydration and protein (casein & whey). 1 cup has ~8g protein. Choose low-fat if cutting calories.",
        "banana": "Bananas are excellent pre-workout fuel. They provide potassium and fast-acting carbs for energy.",
        "oats": "Oats are a fantastic slow-digesting carb. They keep you full and provide sustained energy for workouts.",

        # Workouts & Exercises
        "workout": "Consistency beats intensity! For beginners, 3 days of full-body strength training is ideal. Advanced lifters can try a Push-Pull-Legs split.",
        "abs": "Abs are made in the kitchen! You need low body fat to see them. Plank, Leg Raises, and Russian Twists strengthen the core.",
        "cardio": "Cardio improves heart health and burns calories. Try 150 mins of moderate activity (brisk walk) or 75 mins vigorous (running) per week.",
        "muscle": "To build muscle, lift heavy enough to challenge yourself (hypertrophy range: 8-12 reps) and eat a slight calorie surplus.",
        "squat": "Squats are the king of leg exercises. Keep your back straight, chest up, and drive through your heels. Depth matters!",
        "pushup": "Pushups build chest, shoulders, and triceps. Keep your body in a straight line. If too hard, start on your knees.",

        # Goals
        "weight loss": "To lose weight, you must be in a calorie deficit (burning more than you eat). Prioritize protein and veggies to stay full.",
        "fat loss": "Fat loss comes from a proper diet + exercise. Strength training helps preserve muscle while you lose fat.",
        "gain": "To gain weight/muscle, eat in a surplus (300-500 kcal above maintenance). Focus on nutrient-dense foods, not just junk.",
        "maintenance": "Maintenance is eating enough to keep your weight stable. It's great for diet breaks or when you're happy with your physique.",

        # General
        "hello": "Hi there! I'm your StudentFit AI assistant. Ask me about foods, exercises, or your fitness goals!",
        "hi": "Hello! Ready to get fit? Ask me anything about your diet or workout plan.",
        "thank": "You're welcome! Keep crushing your goals!",
        "help": "I can help with nutrition info, workout tips, or motivation. Try asking 'What should I eat?' or 'How to do pushups?'"
    }

    # Intelligent Matching
    response = "I'm not sure about that specific detail yet, but I'm learning! Try asking about specific foods (like 'eggs', 'rice'), nutrients ('protein', 'carbs'), or goals ('weight loss', 'muscle')."
    
    # Check for direct keyword matches
    for key, reply in responses.items():
        if key in message:
            response = reply
            break
            
    # Contextual fallbacks if no direct match
    if response.startswith("I'm not sure"):
        if "eat" in message or "food" in message or "diet" in message:
            response = "For a balanced diet, aim for a plate with 1/2 vegetables, 1/4 lean protein, and 1/4 complex carbs. Avoid processed sugars!"
        elif "exercise" in message or "gym" in message or "train" in message:
            response = "Any movement is good movement! Start with a routine you truly enjoy so you can stick to it long-term."
        elif "sleep" in message or "rest" in message:
            response = "Sleep is when your muscles grow! Aim for 7-9 hours of quality sleep every night for best results."

    return jsonify({"response": response})

@app.route('/api/analyze-food', methods=['POST'])
def analyze_food():
    """
    Mock AI Food analyzer.
    In a real app, this would use Google Gemini Pro Vision or similar.
    """
    # For now, we return a random analysis
    return jsonify({
        "food_item": "Detected Food",
        "calories": 250,
        "protein": "15g",
        "carbs": "30g",
        "fats": "8g",
        "vitamins": "Vitamin C, B12"
    })

@app.route('/api/export-plan', methods=['POST'])
def export_plan():
    """
    Return the plan as a downloadable string/file content.
    """
    data = request.json
    workout = data.get('workout_plan', '')
    diet = data.get('diet_plan', '')
    
    full_plan = f"STUDENTFIT AI - YOUR CUSTOM PLAN\n\nWORKOUT PLAN:\n{workout}\n\nDIET PLAN:\n{diet}"
    
    return jsonify({"file_content": full_plan, "filename": "My_StudentFit_Plan.txt"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
