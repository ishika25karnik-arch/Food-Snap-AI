import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.9 } };

const SavedFoods = () => {
    const [foods, setFoods] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await api.get('/food/favorites/all');
                setFoods(res.data.foods);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSaved();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this food from saved?")) return;
        try {
            await api.delete(`/food/favorites/${id}`);
            setFoods(foods.filter(f => f.id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleAnalyze = async (foodName) => {
        try {
            const res = await api.post('/food/search', { foodName });
            navigate('/result', { state: { resultData: res.data } });
        } catch (error) {
            alert("Could not analyze food.");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: 'var(--secondary)' }}>
                    <Bookmark size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My Saved Foods</h1>
            </div>
            
            {foods.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>You haven't saved any foods yet.</p>
                    <button onClick={() => navigate('/explore')} className="btn-primary">Explore Foods</button>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {foods.map(food => (
                            <motion.div variants={itemVariants} key={food.id} exit="exit" layout className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                                <button onClick={() => handleDelete(food.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--danger)', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', paddingRight: '2rem' }}>{food.food_name}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{food.category}</p>
                                <button onClick={() => handleAnalyze(food.food_name)} className="btn-secondary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}>
                                    Analyze <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default SavedFoods;
