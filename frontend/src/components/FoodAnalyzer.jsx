import { useState } from 'react';

const FoodAnalyzer = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

        try {
            // In a real app, we'd send the image as multipart/form-data
            // For this mock, we just call the endpoint
            const response = await fetch(`${API_URL}/api/analyze-food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_name: image.name })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            console.error(err);
            alert("Failed to analyze food. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>AI Food Analyzer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="food-upload"
                    style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <label
                        htmlFor="food-upload"
                        className="btn btn-secondary"
                        style={{
                            cursor: 'pointer',
                            padding: '1rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#1f2937',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <span>📷</span> {preview ? 'Change Photo' : 'Upload Food Photo'}
                    </label>
                    {preview && (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                            onClick={() => document.getElementById('food-upload').click()}
                        >
                            ➕ Add Photo
                        </button>
                    )}
                </div>

                {preview && (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                        <img
                            src={preview}
                            alt="Food Preview"
                            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                        />
                    </div>
                )}

                {preview && !analysis && (
                    <button
                        className="btn btn-primary"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Nutrients'}
                    </button>
                )}

                {analysis && (
                    <div className="animate-fade-in" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                            Analysis Result: {analysis.food_item}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ background: 'rgba(129, 140, 248, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Calories</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analysis.calories} kcal</div>
                            </div>
                            <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Protein</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2dd4bf' }}>{analysis.protein}</div>
                            </div>
                            <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Carbs</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{analysis.carbs}</div>
                            </div>
                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fats</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f43f5e' }}>{analysis.fats}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Rich in: {analysis.vitamins}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodAnalyzer;
