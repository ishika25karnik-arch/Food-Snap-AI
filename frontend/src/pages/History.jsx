import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Trash2, ArrowLeft } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/food/history');
                setHistory(res.data.scans);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scan?")) return;
        try {
            await api.delete(`/food/${id}`);
            setHistory(history.filter(scan => scan.id !== id));
        } catch (err) {
            alert('Failed to delete scan');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: 'var(--text-muted)' }}><ArrowLeft size={28} /></button>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>My Food History</h1>
            </div>
            
            {history.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>You haven't scanned any meals yet.</p>
                    <button onClick={() => navigate('/scan')} className="btn-primary">Scan Your First Meal</button>
                </motion.div>
            ) : (
                <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="show" 
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
                >
                    <AnimatePresence>
                        {history.map(scan => (
                            <motion.div 
                                variants={itemVariants}
                                key={scan.id} 
                                exit="exit"
                                layout
                                className="glass-card" 
                                style={{ overflow: 'hidden', position: 'relative' }}
                            >
                                <button 
                                    onClick={() => handleDelete(scan.id)}
                                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.9)', padding: '0.6rem', borderRadius: '50%', color: 'var(--danger)', zIndex: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                                {scan.image_path ? (
                                    <img src={`http://localhost:5000${scan.image_path}`} alt={scan.food_name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '220px', background: 'rgba(0,0,0,0.05)' }} />
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{scan.food_name}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{scan.calories} kcal • Score: {scan.health_score}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ padding: '0.35rem 0.85rem', background: scan.health_score >= 75 ? '#dcfce7' : scan.health_score >= 50 ? '#fef3c7' : '#fee2e2', color: scan.health_score >= 75 ? 'var(--primary)' : scan.health_score >= 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            {scan.health_category}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {new Date(scan.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default History;
