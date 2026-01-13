import { useState } from 'react'
import InputForm from './components/InputForm'
import PlanDisplay from './components/PlanDisplay'

function App() {
  const [step, setStep] = useState('input') // input, loading, result
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    goal: 'Fitness',
    activityLevel: '2',
    dietPreference: 'Non-Veg',
    budget: 'Medium',
    gymAccess: 'No',
    freeTime: '45'
  })
  const [plan, setPlan] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('loading')
    try {
      const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)

      // Predict Fitness Level
      const response = await fetch('http://localhost:5000/api/predict-fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          bmi: bmi,
          activity_level: parseInt(formData.activityLevel)
        })
      })
      const fitnessData = await response.json()

      // Generate Plan
      const planResponse = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fitness_level: fitnessData.fitness_level })
      })
      const planResult = await planResponse.json()

      setPlan({ ...planResult, fitness_level: fitnessData.fitness_level })
      setStep('result')
    } catch (err) {
      console.error(err)
      alert('Failed to connect to backend. Make sure the Flask server is running on port 5000!')
      setStep('input')
    }
  }

  return (
    <div className="container animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
        <h1 style={{
          fontSize: '3rem',
          background: 'linear-gradient(to right, #818cf8, #2dd4bf)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          StudentFit AI
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Your Personalized Workout & Diet Planner
        </p>
      </header>

      {step === 'input' && (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <InputForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      )}

      {step === 'loading' && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderLeftColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h2>Analyzing your profile...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generating the best plan for your student budget</p>
        </div>
      )}

      {step === 'result' && plan && (
        <PlanDisplay plan={plan} onReset={() => setStep('input')} />
      )}
    </div>
  )
}
export default App
