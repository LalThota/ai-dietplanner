import React from 'react';

const PlanDisplay = ({ plan, onReset }) => {
    if (!plan) return null;

    return (
        <div className="glass-card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Your Personalized Plan</h2>
                <div style={{ textAlign: 'right' }}>
                    <span style={{
                        background: plan.fitness_level === 'Advanced' ? '#ef4444' : plan.fitness_level === 'Intermediate' ? '#f59e0b' : '#10b981',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {plan.fitness_level}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Workout Section */}
                <div>
                    <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', borderBottom: '2px solid var(--secondary)', display: 'inline-block' }}>Weekly Workout Routine</h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                        {/* Check if plans are objects or strings. Assuming strings for now as per app.py placeholder */}
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{plan.workout_plan}</p>
                    </div>
                </div>

                {/* Diet Section */}
                <div>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--primary)', display: 'inline-block' }}>Daily Diet Plan</h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{plan.diet_plan}</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button onClick={onReset} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
                    Start Over
                </button>
            </div>
        </div>
    );
};
export default PlanDisplay;
