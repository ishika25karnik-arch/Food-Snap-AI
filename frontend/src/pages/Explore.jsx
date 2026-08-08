import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const popularSearches = [
    "Apple", "Banana", "Oats", "Spinach", "Paneer", 
    "Pizza", "Burger", "Dal", "Rice", "Pudina", "Curry Leaves"
];

const Explore = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (searchQuery) => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const res = await api.post('/food/search', { foodName: searchQuery });
            navigate('/result', { state: { resultData: res.data } });
        } catch (error) {
            console.error("Search error", error);
            alert("Could not analyze food. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Explore Food</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Search any food to discover its nutrition, benefits, things to watch, and how it can fit into your diet.
            </p>

            <form onSubmit={onSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 3rem', position: 'relative' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={24} />
                    <input 
                        type="text" 
                        placeholder="Search food... (e.g., Paneer, Dal, Pizza)" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', fontSize: '1.25rem', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.1)', outline: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0 2rem' }}>
                    {loading ? <Loader2 size={24} className="spin" /> : 'Analyze'}
                </button>
            </form>

            <style>{`.spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

            <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Popular Searches</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {popularSearches.map(food => (
                        <button 
                            key={food} 
                            onClick={() => handleSearch(food)}
                            style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', fontSize: '1rem', fontWeight: '500', transition: 'all 0.2s', cursor: 'pointer', color: 'var(--text-main)' }}
                            onMouseOver={e => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--primary)'; }}
                            onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.7)'; e.target.style.color = 'var(--text-main)'; e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }}
                        >
                            {food}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Explore;
