import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Camera, Flame, Heart, ArrowRight, Search, Salad } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [recentScans, setRecentScans] = useState([]);
    const [stats, setStats] = useState({ totalScans: 0, avgScore: 0, caloriesTracked: 0 });
    const [dietPlan, setDietPlan] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const historyRes = await api.get('/food/history');
                const scans = historyRes.data.scans;
                setRecentScans(scans.slice(0, 3));
                
                if (scans.length > 0) {
                    const totalCal = scans.reduce((sum, s) => sum + s.calories, 0);
                    const avg = scans.reduce((sum, s) => sum + s.health_score, 0) / scans.length;
                    setStats({ totalScans: scans.length, avgScore: Math.round(avg), caloriesTracked: totalCal });
                }

                const dietRes = await api.get('/diet/current');
                if (dietRes.data.plan) {
                    setDietPlan(dietRes.data.plan);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data");
            }
        };
        fetchData();
    }, []);

    const handleQuickSearch = (e) => {
        e.preventDefault();
        if(searchQuery.trim()) {
            navigate('/explore');
            // Normally we'd pass state or handle it via URL params, but exploring is enough for demo
        }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
            
            {/* Quick Search & Welcome */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <motion.h1 variants={itemVariants} style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                    Welcome back, <span className="text-gradient">{user?.name}</span> 👋
                </motion.h1>
                <motion.form variants={itemVariants} onSubmit={handleQuickSearch} style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Quick search food..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                    />
                </motion.form>
            </div>
            
            {/* Stats Overview */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '16px', color: 'var(--primary)' }}>
                        <Camera size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '500' }}>Total Scans</p>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.totalScans}</h3>
                    </div>
                </div>
                
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '16px', color: 'var(--secondary)' }}>
                        <Heart size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '500' }}>Avg Health Score</p>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.avgScore} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ 100</span></h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '16px', color: 'var(--warning)' }}>
                        <Flame size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '500' }}>Calories Tracked</p>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.caloriesTracked} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>kcal</span></h3>
                    </div>
                </div>
            </motion.div>

            {/* Current Diet Plan Section */}
            {dietPlan && (
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', borderLeft: '6px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Salad size={24} color="var(--secondary)" />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Active Diet Plan: {dietPlan.goal}</h2>
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{dietPlan.daily_calorie_target} kcal / day</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {dietPlan.meals.map(meal => (
                            <div key={meal.meal_type} style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px', minWidth: '200px' }}>
                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{meal.meal_type}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{meal.items.length} items</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>{meal.total_meal_calories} kcal</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Recent Food Scans</h2>
                <Link to="/history" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    View All <ArrowRight size={20} />
                </Link>
            </motion.div>
            
            {recentScans.length === 0 ? (
                <motion.div variants={itemVariants} className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>You haven't scanned any food yet.</p>
                    <Link to="/scan" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Scan Your First Meal</Link>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {recentScans.map(scan => (
                        <motion.div variants={itemVariants} key={scan.id} className="glass-card" style={{ overflow: 'hidden' }}>
                            {scan.image_path ? (
                                <img src={`http://localhost:5000${scan.image_path}`} alt={scan.food_name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '220px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera color="var(--text-muted)" size={48} /></div>
                            )}
                            <div style={{ padding: '1.75rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{scan.food_name}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>{scan.calories} kcal • Score: {scan.health_score}</p>
                                <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: scan.health_score >= 75 ? '#dcfce7' : scan.health_score >= 50 ? '#fef3c7' : '#fee2e2', color: scan.health_score >= 75 ? 'var(--primary)' : scan.health_score >= 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '600' }}>
                                    {scan.health_category}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default Dashboard;
