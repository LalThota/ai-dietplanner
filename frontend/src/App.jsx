import { useState, useEffect, useRef } from 'react'
import InputForm from './components/InputForm'
import PlanDisplay from './components/PlanDisplay'
import FoodAnalyzer from './components/FoodAnalyzer'
import { predictFitness, generatePlan } from './utils/aiLogic';

function App() {
  const [step, setStep] = useState('input') // input, loading, result
  const [activeTab, setActiveTab] = useState('plan') // plan, food
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
  const [isTyping, setIsTyping] = useState(false)

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ type: 'bot', text: 'Hi! I am your AI fitness assistant. Ask me anything about your diet or workout!' }])
  const [userInput, setUserInput] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isChatOpen])

  const handleSendChat = async (e) => {
    e.preventDefault();
    const messageText = userInput.trim();
    if (!messageText) return;

    // Add user message immediately
    const userMessage = { type: 'user', text: messageText };
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      setChatMessages(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setChatMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting. Please try again soon!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('loading')

    // Get API URL from environment variable or default to localhost
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    console.log("Using API URL:", API_URL);

    try {
      const bmi = parseFloat(formData.weight) / ((parseFloat(formData.height) / 100) ** 2)

      // Predict Fitness Level
      const response = await fetch(`${API_URL}/api/predict-fitness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          bmi: bmi,
          activity_level: parseInt(formData.activityLevel)
        })
      })

      if (!response.ok) {
        throw new Error('Backend connection failed');
      }

      const fitnessData = await response.json()

      // Generate Plan
      const planResponse = await fetch(`${API_URL}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fitness_level: fitnessData.fitness_level })
      })

      if (!planResponse.ok) {
        throw new Error('Plan generation failed');
      }

      const planResult = await planResponse.json()

      setPlan({ ...planResult, fitness_level: fitnessData.fitness_level })
      setStep('result')
    } catch (err) {
      console.error(err)
      alert(`Failed to connect to backend (${API_URL}). Please check if the backend is running.`)
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

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={() => setActiveTab('plan')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'plan' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Planner
          </button>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'food' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Food Analyzer
          </button>
        </div>
      </header>

      {activeTab === 'food' ? (
        <FoodAnalyzer />
      ) : (
        <>
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
        </>
      )}

      {/* Chat Bot Extension */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        {isChatOpen && (
          <div className="glass-card animate-fade-in" style={{
            width: '320px',
            height: '450px',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(to right, #818cf8, #2dd4bf)',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>StudentFit Assistant</span>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  padding: '0.6rem 1rem',
                  borderRadius: msg.type === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  maxWidth: '80%',
                  fontSize: '0.9rem'
                }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.6rem 1rem',
                  borderRadius: '18px 18px 18px 2px',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}>
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendChat} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask away..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  color: 'white'
                }}
              />
              <button type="submit" style={{
                background: 'var(--primary)',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: 'white',
                cursor: 'pointer'
              }}>→</button>
            </form>
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #2dd4bf)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          💬
        </button>
      </div>
    </div>
  )
}
export default App
