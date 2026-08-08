import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Search, LayoutDashboard, Salad, Bookmark, History, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
                <Camera size={28} /> FoodSnap<span style={{ color: 'var(--text-main)' }}>AI</span>
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><LayoutDashboard size={18} /> Dashboard</Link>
                        <Link to="/explore" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Search size={18} /> Explore</Link>
                        <Link to="/diet" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Salad size={18} /> Diet Planner</Link>
                        <Link to="/saved" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Bookmark size={18} /> Saved</Link>
                        <Link to="/history" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><History size={18} /> History</Link>
                        
                        <Link to="/scan" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Scan Food</Link>
                        <button onClick={handleLogout} style={{ background: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><LogOut size={18} /> Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontWeight: '600' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
