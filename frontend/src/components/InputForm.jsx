import React from 'react';

const InputForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '1.5rem' }}>Tell us about yourself</h2>

      <div className="grid-cols-2">
        <div className="form-group">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            className="form-input"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="e.g. 21"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input
            type="number"
            name="height"
            className="form-input"
            value={formData.height}
            onChange={handleChange}
            required
            placeholder="e.g. 175"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            className="form-input"
            value={formData.weight}
            onChange={handleChange}
            required
            placeholder="e.g. 70"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Fitness Goal</label>
        <select name="goal" className="form-select" value={formData.goal} onChange={handleChange}>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Fitness">General Fitness/Maintenance</option>
        </select>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Lifestyle & Resources</h3>

      <div className="grid-cols-2">
        <div className="form-group">
          <label className="form-label">Daily Available Time (mins)</label>
          <select name="freeTime" className="form-select" value={formData.freeTime} onChange={handleChange}>
            <option value="15">15 mins (Very Busy)</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">60+ mins</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Activity Level</label>
          <select name="activityLevel" className="form-select" value={formData.activityLevel} onChange={handleChange}>
            <option value="1">Sedentary (Student/Desk job)</option>
            <option value="2">Lightly Active</option>
            <option value="3">Very Active (Sports/Gym)</option>
          </select>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="form-group">
          <label className="form-label">Food Budget (Monthly)</label>
          <select name="budget" className="form-select" value={formData.budget} onChange={handleChange}>
            <option value="Low">Low (&lt; ₹3000)</option>
            <option value="Medium">Medium (₹3000 - ₹7000)</option>
            <option value="High">High (&gt; ₹7000)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Dietary Preference</label>
          <select name="dietPreference" className="form-select" value={formData.dietPreference} onChange={handleChange}>
            <option value="Veg">Vegetarian</option>
            <option value="Non-Veg">Non-Vegetarian</option>
            <option value="Eggitarian">Eggitarian</option>
            <option value="Vegan">Vegan</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Access to Gym?</label>
        <select name="gymAccess" className="form-select" value={formData.gymAccess} onChange={handleChange}>
          <option value="No">No (Home Workout)</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        Generate AI Plan
      </button>
    </form>
  );
};

export default InputForm;
