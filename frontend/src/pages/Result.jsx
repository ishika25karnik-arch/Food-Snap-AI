import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import api from '../services/api';
import { Check, ArrowLeft, Bookmark, Salad, AlertTriangle, Leaf, Zap, Heart } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

const AnimatedCounter = ({ value, color }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1500;
        if(value === 0) return;
        const increment = value / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <h1 style={{ fontSize: '4.5rem', margin: 0, color, fontWeight: '800' }}>{count}</h1>;
};

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resultData = location.state?.resultData;

    const [saved, setSaved] = useState(false);
    const [addedToDiet, setAddedToDiet] = useState(false);

    if (!resultData) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>No data available. <button onClick={() => navigate('/explore')} className="btn-primary mt-4">Explore Food</button></div>;
    }

    const { foodName, category, nutrition, healthScore, healthCategory, imageUrl, confirmedWeight, benefits, thingsToWatch, healthierTips, servingSuggestion } = resultData;
    const scoreColor = healthScore >= 75 ? 'var(--primary)' : healthScore >= 50 ? 'var(--warning)' : 'var(--danger)';

    const barData = [
        { name: 'Protein', value: nutrition.protein || 0, fill: '#3b82f6' },
        { name: 'Carbs', value: nutrition.carbohydrates || 0, fill: '#10b981' },
        { name: 'Fat', value: nutrition.fat || 0, fill: '#f59e0b' },
        { name: 'Fiber', value: nutrition.fiber || 0, fill: '#8b5cf6' },
        { name: 'Sugar', value: nutrition.sugar || 0, fill: '#ef4444' }
    ];

    const radarData = [
        { subject: 'Protein', A: nutrition.protein || 0, fullMark: 100 },
        { subject: 'Fiber', A: nutrition.fiber || 0, fullMark: 100 },
        { subject: 'Carbs', A: nutrition.carbohydrates || 0, fullMark: 100 },
        { subject: 'Fat', A: nutrition.fat || 0, fullMark: 100 },
        { subject: 'Sugar', A: nutrition.sugar || 0, fullMark: 100 },
        { subject: 'Sodium/10', A: (nutrition.sodium || 0) / 10, fullMark: 100 },
    ];

    const handleSaveFavorite = async () => {
        try {
            await api.post('/food/favorites', { foodName, category });
            setSaved(true);
        } catch (err) {
            alert('Failed to save to favorites');
        }
    };

    const handleSaveScan = async () => {
        try {
            await api.post('/food/save', resultData);
            navigate('/history');
        } catch (err) {
            alert('Failed to save to history');
        }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
            
            {/* Header Actions */}
            <motion.div variants={cardVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-muted)' }}><ArrowLeft size={28} /></button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{foodName}</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSaveFavorite} className="btn-secondary" disabled={saved}>
                        {saved ? <><Check size={20} color="var(--primary)" /> Saved</> : <><Bookmark size={20} /> Save Food</>}
                    </button>
                    {imageUrl && (
                        <button onClick={handleSaveScan} className="btn-primary"><Check size={20} /> Log Meal</button>
                    )}
                </div>
            </motion.div>

            {/* Top Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.4))' }}>
                    {imageUrl ? (
                        <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} src={`http://localhost:5000${imageUrl}`} alt={foodName} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                    ) : (
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
                            <Leaf size={64} color="var(--primary)" />
                        </motion.div>
                    )}
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontWeight: '700' }}>{foodName}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>{category} • {confirmedWeight}g</p>
                </motion.div>

                <motion.div variants={cardVariants} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Health Score</h3>
                    <motion.div 
                        initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                        style={{ width: '160px', height: '160px', borderRadius: '50%', border: `10px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: `0 0 30px ${scoreColor}40` }}
                    >
                        <AnimatedCounter value={healthScore} color={scoreColor} />
                    </motion.div>
                    <div style={{ padding: '0.5rem 1.5rem', background: `${scoreColor}15`, color: scoreColor, borderRadius: '999px', fontWeight: '700', fontSize: '1.2rem' }}>
                        {healthCategory}
                    </div>
                </motion.div>

                <motion.div variants={cardVariants} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Zap size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600', fontSize: '1.25rem' }}>Total Calories</p>
                    <h1 style={{ fontSize: '4.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '800' }}>
                        {nutrition.calories} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: '500' }}>kcal</span>
                    </h1>
                </motion.div>
            </div>

            {/* AI Knowledge Sections (New) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.2)" }} className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(16, 185, 129, 0.08))', borderTop: '4px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Heart size={28} fill="var(--primary)" fillOpacity={0.2} /></motion.div> Benefits
                    </h3>
                    {benefits && benefits.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {benefits.map((b, i) => (
                                <motion.li key={i} whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.8)' }} transition={{ type: "spring", stiffness: 300 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>{b.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{b.description}</p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : <p style={{ color: 'var(--text-muted)' }}>Provides essential macronutrients.</p>}
                </motion.div>

                <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.2)" }} className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245, 158, 11, 0.08))', borderTop: '4px solid var(--warning)' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning)', fontWeight: '700' }}>
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }}><AlertTriangle size={28} fill="var(--warning)" fillOpacity={0.2} /></motion.div> Things to Watch
                    </h3>
                    {thingsToWatch && thingsToWatch.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {thingsToWatch.map((t, i) => (
                                <motion.li key={i} whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.8)' }} transition={{ type: "spring", stiffness: 300 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>{t.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{t.description}</p>
                                </motion.li>
                            ))}
                        </ul>
                    ) : <p style={{ color: 'var(--text-muted)' }}>Generally safe as a food in normal amounts, but individual tolerance may vary.</p>}
                </motion.div>
            </div>

            {/* Macro Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
                <motion.div variants={cardVariants} className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Macronutrients (g)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={barData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}g`} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={cardVariants} className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Nutrition Profile</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                                <Radar name="Nutrition" dataKey="A" stroke="var(--primary)" strokeWidth={3} fill="var(--primary)" fillOpacity={0.4} isAnimationActive={true} animationDuration={1500} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recommendations */}
            {(healthierTips || servingSuggestion) && (
                <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)' }} className="glass-card" style={{ padding: '2.5rem', marginTop: '1.5rem', borderLeft: `6px solid var(--secondary)`, background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(255,255,255,0.9) 100%)' }}>
                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: '700' }}>Dietary Recommendations</h3>
                    {servingSuggestion && <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.1rem', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}><strong>Serving Suggestion:</strong> {servingSuggestion}</p>}
                    
                    {healthierTips && healthierTips.length > 0 && (
                        <div>
                            <p style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Make it better:</p>
                            <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                                {healthierTips.map((tip, i) => (
                                    <motion.li key={i} whileHover={{ x: 5 }} style={{ marginBottom: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', borderLeft: '3px solid var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Check size={16} color="var(--secondary)" /> <span style={{ color: 'var(--text-muted)' }}>{tip}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>FoodSnap AI provides general nutrition information and is not a substitute for professional medical advice.</p>
            </div>
        </motion.div>
    );
};

export default Result;
