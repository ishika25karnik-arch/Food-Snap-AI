import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Activity, Heart, ArrowRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const iconVariants = {
    float: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const Home = () => {
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ textAlign: 'center', padding: '6rem 1rem 4rem', position: 'relative' }}
        >
            <motion.h1 
                variants={itemVariants}
                style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.1' }}
            >
                Snap Your Food.<br/>
                <span className="text-gradient">Understand Your Nutrition.</span>
            </motion.h1>
            
            <motion.p 
                variants={itemVariants}
                style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}
            >
                Use advanced Vision AI to analyze your meals, get accurate nutritional estimates, and make smarter food choices effortlessly.
            </motion.p>
            
            <motion.div 
                variants={itemVariants}
                style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '6rem', flexWrap: 'wrap' }}
            >
                <Link to="/scan" className="btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>
                    <Camera size={24} /> Try It Now <ArrowRight size={20} />
                </Link>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}
            >
                <motion.div className="glass-card" style={{ padding: '2.5rem 1.5rem', width: '280px' }}>
                    <motion.div variants={iconVariants} animate="float" style={{ display: 'inline-block', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Activity size={36} color="var(--primary)" />
                    </motion.div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Analysis</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Instantly recognize any food and estimate portion sizes automatically.</p>
                </motion.div>
                
                <motion.div className="glass-card" style={{ padding: '2.5rem 1.5rem', width: '280px' }}>
                    <motion.div variants={iconVariants} animate="float" style={{ display: 'inline-block', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Heart size={36} color="var(--danger)" />
                    </motion.div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Health Score</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Get personalized health scores based on macro and micronutrients.</p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Home;
