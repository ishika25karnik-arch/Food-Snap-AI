import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Salad, Loader2, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DietPlanner = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        goal: 'Healthy Eating',
        dietType: 'No Preference',
        mealsPerDay: '3',
        likedFoods: '',
        avoidedFoods: ''
    });

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await api.post('/diet/generate', form);
            setPlan(res.data);
            setStep(3);
        } catch (err) {
            alert('Failed to generate diet plan');
        } finally {
            setLoading(false);
        }
    };

    const savePlan = async () => {
        try {
            await api.post('/diet/save', {
                goal: form.goal,
                dietType: form.dietType,
                daily_calorie_target: plan.daily_calorie_target,
                meals: plan.meals
            });
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to save plan');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '16px', color: 'var(--primary)' }}>
                    <Salad size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>AI Diet Planner</h1>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card" style={{ padding: '2.5rem' }}>
                        <h2 style={{ marginBottom: '2rem' }}>What's your primary goal?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                            {['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Healthy Eating', 'Maintenance'].map(goal => (
                                <button 
                                    key={goal} 
                                    onClick={() => setForm({...form, goal})}
                                    className={form.goal === goal ? 'btn-primary' : 'btn-secondary'}
                                    style={{ padding: '1rem', fontSize: '1.1rem' }}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>

                        <h2 style={{ marginBottom: '2rem' }}>Dietary Preference?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                            {['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian', 'No Preference'].map(type => (
                                <button 
                                    key={type} 
                                    onClick={() => setForm({...form, dietType: type})}
                                    className={form.dietType === type ? 'btn-primary' : 'btn-secondary'}
                                    style={{ padding: '1rem', fontSize: '1.1rem' }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', justifyContent: 'center' }}>
                            Next Step <ChevronRight size={20} />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card" style={{ padding: '2.5rem' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Fine-tune your plan</h2>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Meals Per Day</label>
                            <select 
                                value={form.mealsPerDay} 
                                onChange={e => setForm({...form, mealsPerDay: e.target.value})}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1.1rem', outline: 'none' }}
                            >
                                <option value="3">3 Meals (Breakfast, Lunch, Dinner)</option>
                                <option value="4">4 Meals (Includes 1 Snack)</option>
                                <option value="5">5 Meals (Includes 2 Snacks)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Foods You Like (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Rice, Paneer, Apple, Spinach"
                                value={form.likedFoods}
                                onChange={e => setForm({...form, likedFoods: e.target.value})}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1.1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Foods You Avoid (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Peanuts, Milk, Spicy food"
                                value={form.avoidedFoods}
                                onChange={e => setForm({...form, avoidedFoods: e.target.value})}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1.1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '1.25rem', fontSize: '1.2rem', justifyContent: 'center' }}>
                                Back
                            </button>
                            <button onClick={generatePlan} disabled={loading} className="btn-primary" style={{ flex: 2, padding: '1.25rem', fontSize: '1.2rem', justifyContent: 'center' }}>
                                {loading ? <Loader2 className="spin" size={24} /> : 'Generate Diet Plan'}
                            </button>
                        </div>
                        <style>{`.spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </motion.div>
                )}

                {step === 3 && plan && (
                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '3rem 2rem', color: '#fff', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Personalized Diet Plan</h2>
                            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{form.goal} • {form.dietType}</p>
                        </div>
                        
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem', textAlign: 'center' }}>
                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Calories</p>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{plan.daily_calorie_target}</h3>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Protein</p>
                                    <h3 style={{ fontSize: '1.5rem', color: '#3b82f6' }}>{plan.macros.protein_target}g</h3>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Carbs</p>
                                    <h3 style={{ fontSize: '1.5rem', color: '#10b981' }}>{plan.macros.carbs_target}g</h3>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Fat</p>
                                    <h3 style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{plan.macros.fat_target}g</h3>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {plan.meals.map((meal, idx) => (
                                    <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.5rem' }}>{meal.meal_type}</h3>
                                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{meal.total_meal_calories} kcal</span>
                                        </div>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {meal.items.map((item, i) => (
                                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                                    <div>
                                                        <span style={{ fontWeight: '600' }}>{item.food_name}</span>
                                                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({item.quantity})</span>
                                                    </div>
                                                    <span style={{ color: 'var(--text-muted)' }}>{item.estimated_calories} kcal</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', marginTop: '2rem', textAlign: 'center', color: '#b45309' }}>
                                <p style={{ fontSize: '0.9rem' }}>{plan.disclaimer}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '1.25rem', justifyContent: 'center' }}>Discard & Start Over</button>
                                <button onClick={savePlan} className="btn-primary" style={{ flex: 1, padding: '1.25rem', justifyContent: 'center' }}><Check size={20} /> Save This Diet Plan</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DietPlanner;
