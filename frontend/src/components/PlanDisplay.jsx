import React from 'react';
import { jsPDF } from 'jspdf';

const PlanDisplay = ({ plan, onReset }) => {
    if (!plan) return null;

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(129, 140, 248); // #818cf8
        doc.text("StudentFit AI - Your Plan", 20, 25);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text(`Fitness Level: ${plan.fitness_level}`, 20, 35);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        // Workout Section
        doc.setFontSize(18);
        doc.setTextColor(45, 212, 191); // #2dd4bf
        doc.text("Weekly Workout Routine", 20, 55);

        doc.setFontSize(11);
        doc.setTextColor(0);
        const workoutLines = doc.splitTextToSize(plan.workout_plan, 170);
        doc.text(workoutLines, 20, 65);

        // Diet Section
        let yPos = 65 + (workoutLines.length * 6) + 15;
        if (yPos > 240) {
            doc.addPage();
            yPos = 25;
        }

        doc.setFontSize(18);
        doc.setTextColor(129, 140, 248);
        doc.text("Daily Diet Plan", 20, yPos);

        doc.setFontSize(11);
        doc.setTextColor(0);
        const dietLines = doc.splitTextToSize(plan.diet_plan, 170);
        doc.text(dietLines, 20, yPos + 10);

        doc.save(`StudentFit_Plan_${plan.fitness_level}.pdf`);
    };

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

            <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={downloadPDF}
                    className="btn btn-secondary"
                    style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', border: 'none', fontWeight: 'bold' }}
                >
                    📄 Download PDF Plan
                </button>
                <button onClick={onReset} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
                    Start Over
                </button>
            </div>
        </div>
    );
};
export default PlanDisplay;
