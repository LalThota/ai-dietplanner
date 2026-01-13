import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# 1. Generate Synthetic Data
# Features: Age, BMI, Activity Level (1=Low, 2=Moderate, 3=High)
# Target: Fitness Level (Beginner, Intermediate, Advanced)

def generate_data(n_samples=1000):
    np.random.seed(42)
    ages = np.random.randint(18, 60, size=n_samples)
    bmis = np.random.uniform(15, 40, size=n_samples)
    activity_levels = np.random.randint(1, 4, size=n_samples) # 1, 2, 3
    
    fitness_levels = []
    
    for age, bmi, activity in zip(ages, bmis, activity_levels):
        # Logic to assign ground truth for training
        score = 0
        
        # BMI scoring
        if 18.5 <= bmi <= 24.9:
            score += 2
        elif 25 <= bmi <= 29.9:
            score += 1
        else: # Underweight or Obese
            score += 0
            
        # Activity scoring
        score += activity * 1.5
        
        # Age scoring (younger usually fitter potential, slightly)
        if age < 30:
            score += 1
        elif age > 50:
            score -= 1
            
        # Determine level
        if score < 3:
            fitness_levels.append('Beginner')
        elif 3 <= score <= 5:
            fitness_levels.append('Intermediate')
        else:
            fitness_levels.append('Advanced')
            
    df = pd.DataFrame({
        'Age': ages,
        'BMI': bmis,
        'ActivityLevel': activity_levels,
        'FitnessLevel': fitness_levels
    })
    
    return df

def train():
    print("Generating synthetic data...")
    df = generate_data()
    print(df.head())
    
    X = df[['Age', 'BMI', 'ActivityLevel']]
    y = df['FitnessLevel']
    
    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Model
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Accuracy
    print(f"Accuracy: {clf.score(X_test, y_test):.2f}")
    
    # Save Model & Label Encoder
    with open('backend/fitness_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
        
    with open('backend/label_encoder.pkl', 'wb') as f:
        pickle.dump(le, f)
        
    print("Model saved to backend/fitness_model.pkl")

if __name__ == "__main__":
    # Ensure backend directory exists for saving
    if not os.path.exists('backend'):
        os.makedirs('backend')
    train()
