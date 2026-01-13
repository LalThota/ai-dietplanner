
export const predictFitness = (age, bmi, activityLevel) => {
    // Logic mirrored from backend/app.py
    if (bmi < 18.5 || bmi > 30) {
        return "Beginner";
    } else if (bmi >= 18.5 && bmi <= 25 && activityLevel >= 2) {
        return "Intermediate";
    } else if (activityLevel === 3) {
        return "Advanced";
    } else {
        return "Beginner";
    }
};

export const generatePlan = (fitnessLevel, formData) => {
    const { gymAccess, goal, dietPreference, budget } = formData;

    // --- Workout Plan Logic ---
    let workoutPlan = "";
    const baseWorkout = gymAccess === 'No' ? "Home Workout Routine (No Equipment)" : "Gym Workout Routine";

    if (gymAccess === 'No') {
        if (fitnessLevel === 'Beginner') {
            workoutPlan = `${baseWorkout} - Beginner Focus on Form:
Mon: 15 mins Full Body (10 Squats, 10 Pushups/Knee-pushups, 15s Plank)
Tue: 20 mins Brisk Walk
Wed: 15 mins Core (Crunches, Leg Raises)
Thu: Rest
Fri: 15 mins Full Body (Repeat Mon)
Sat: Active Rest (Stretching)
Sun: Rest`;
        } else if (fitnessLevel === 'Intermediate') {
            workoutPlan = `${baseWorkout} - Intensity Increased:
Mon: 30 mins HIIT (Burpees, High Knees, Mountain Climbers)
Tue: 45 mins Jogging/Run
Wed: Upper Body Strength (Pushups: 3x15, Chair Dips: 3x12)
Thu: Active Recovery (Yoga)
Fri: Lower Body Strength (Lunges: 3x20, Squat Jumps: 3x15)
Sat: 60 mins Sport/Activity
Sun: Rest`;
        } else { // Advanced
            workoutPlan = `${baseWorkout} - High Intensity:
Mon: Calisthenics Circuit (Pullups if bar avail, Diamond Pushups, Pistol Squat progs)
Tue: 5km Run (Target < 25mins)
Wed: Core Shred (Plank variations 5 mins, Leg raises, Russian twists)
Thu: HIIT Cardio (Tabata style)
Fri: Endurance Training (100 Burpees challenge)
Sat: Long Run / Cycling
Sun: Rest`;
        }
    } else {
        // Gym
        if (goal === 'Muscle Gain') {
            workoutPlan = `${baseWorkout} - Push/Pull/Legs Split:
Mon: Push (Bench Press, Overhead Press, Triceps)
Tue: Pull (Lat Pulldown, Rows, Biceps)
Wed: Legs (Squats, Leg Press, Calves)
Thu: Rest
Fri: Upper Body Compound
Sat: Lower Body & Abs
Sun: Rest`;
        } else {
            workoutPlan = `${baseWorkout} - General Fitness:
Mon: Full Body Strength (Compound movements)
Tue: Cardio (Treadmill/Elliptical 30 mins)
Wed: Active Recovery
Thu: Upper Body Focus
Fri: Lower Body Focus
Sat: Functional Training / Classes
Sun: Rest`;
        }
    }

    // --- Diet Plan Logic ---
    let cheapProt = dietPreference !== 'Vegan' ? "Eggs, Lentils, Soya Chunks" : "Lentils, Soya, Chickpeas";
    let richProt = dietPreference === 'Non-Veg' ? "Chicken Breast, Fish, Whey Protein" :
        (dietPreference === 'Veg' ? "Paneer, Greek Yogurt, Whey" : "Tofu, Quinoa, Vegan Protein");

    const proteinSource = budget === 'Low' ? cheapProt : richProt;
    const proteinList = proteinSource.split(',');

    const dietPlan = `Target: ${goal} | Diet: ${dietPreference} | Budget: ${budget}

Breakfast: Oatmeal with Milk/Water + Fruit + (${proteinList[0]})
Lunch: Rice/Roti + Dal/Vegetables + Portion of ${proteinList[1] || proteinList[0]}
Snack: Fruit / Nuts / Green Tea
Dinner: Salad + Light portion of Carb + ${proteinList.length > 2 ? proteinList[proteinList.length - 1] : proteinList[0]}

Hydration: Drink 3-4 Liters of water daily.
Note: Adjust portion sizes based on hunger and results.`;

    return { workout_plan: workoutPlan, diet_plan: dietPlan };
};
