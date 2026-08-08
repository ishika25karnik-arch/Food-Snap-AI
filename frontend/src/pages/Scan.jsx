import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Scan = () => {
    const [mode, setMode] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [aiData, setAiData] = useState(null);
    const [confirmedWeight, setConfirmedWeight] = useState(100);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const startCamera = async () => {
        setMode('camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert('Camera permission is required to scan food.');
            setMode(null);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            const f = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            setFile(f);
            setImageSrc(URL.createObjectURL(blob));
            stopCamera();
            setMode('preview');
        }, 'image/jpeg');
    };

    const handleUpload = (e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            setImageSrc(URL.createObjectURL(f));
            setMode('preview');
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setStatus('scanning');
        
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/food/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAiData(res.data);
            setConfirmedWeight(res.data.estimatedWeight || 100);
            setTimeout(() => {
                setStatus('portion');
            }, 1000);
        } catch (err) {
            alert('Failed to analyze image. Please try again.');
            setStatus('idle');
            setMode('preview');
        }
    };

    const handleCalculate = async () => {
        setStatus('calculating');
        try {
            const res = await api.post('/food/calculate', {
                foodName: aiData.foodName,
                weight: confirmedWeight,
                category: aiData.category,
                confidence: aiData.confidence,
                ingredients: aiData.ingredients,
                imageUrl: aiData.imageUrl
            });
            
            navigate('/result', { state: { resultData: res.data } });
        } catch (err) {
            alert('Failed to calculate nutrition.');
            setStatus('portion');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}
        >
            <AnimatePresence mode="wait">
                {status === 'scanning' && (
                    <motion.div 
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="glass-card" 
                        style={{ padding: '0', overflow: 'hidden', position: 'relative', borderRadius: '16px' }}
                    >
                        <img src={imageSrc} style={{ width: '100%', height: '400px', objectFit: 'cover', filter: 'brightness(0.7)' }} alt="Scanning" />
                        <div className="scanner-overlay">
                            <div className="scanner-line"></div>
                            <RefreshCw size={48} color="#fff" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem', dropShadow: '0 0 10px rgba(255,255,255,0.5)' }} />
                            <h2 style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Analyzing Image...</h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Gemini AI is extracting ingredients.</p>
                        </div>
                    </motion.div>
                )}

                {status === 'portion' && (
                    <motion.div 
                        key="portion"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card" 
                        style={{ margin: '2rem auto', padding: '3rem 2rem' }}
                    >
                        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Confirm Portion</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We detected <strong>{aiData.foodName}</strong>. How much are you eating?</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                            {[100, 200, 300].map(w => (
                                <button 
                                    key={w}
                                    onClick={() => setConfirmedWeight(w)} 
                                    className={confirmedWeight === w ? 'btn-primary' : 'btn-secondary'}
                                    style={{ padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                                >
                                    <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{w === 100 ? 'Small' : w === 200 ? 'Medium' : 'Large'}</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{w}g</span>
                                </button>
                            ))}
                        </div>

                        <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Or enter exact weight (g):</label>
                            <input 
                                type="number" 
                                value={confirmedWeight} 
                                onChange={(e) => setConfirmedWeight(Number(e.target.value))} 
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid rgba(16, 185, 129, 0.2)', fontSize: '1.25rem', outline: 'none', transition: 'border 0.3s' }}
                                onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                                onBlur={e => e.target.style.border = '2px solid rgba(16, 185, 129, 0.2)'}
                            />
                        </div>

                        <button onClick={handleCalculate} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem' }}>
                            Calculate Nutrition <ChevronRight size={24} />
                        </button>
                    </motion.div>
                )}

                {status === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Scan Your Meal</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Take a fresh photo or upload an image from your gallery.</p>
                        
                        {!mode && (
                            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startCamera} className="glass-card" style={{ padding: '3.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '1.5rem', borderRadius: '50%' }}>
                                        <Camera size={40} color="#fff" />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem' }}>Open Camera</h2>
                                </motion.button>
                                
                                <motion.label whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-card" style={{ padding: '3.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                                        <Upload size={40} color="var(--secondary)" />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem' }}>Upload Image</h2>
                                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                                </motion.label>
                            </div>
                        )}

                        {mode === 'camera' && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ padding: '1rem', borderRadius: '16px', overflow: 'hidden' }}>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button onClick={() => { stopCamera(); setMode(null); }} className="btn-secondary" style={{ padding: '1rem 2rem' }}>Cancel</button>
                                    <button onClick={capturePhoto} className="btn-primary" style={{ padding: '1rem 2rem' }}><Camera size={20} /> Capture</button>
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </motion.div>
                        )}

                        {mode === 'preview' && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ padding: '1rem', borderRadius: '16px' }}>
                                <img src={imageSrc} alt="Preview" style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '0.5rem' }}>
                                    <button onClick={() => { setImageSrc(null); setFile(null); setMode(null); }} className="btn-secondary" style={{ padding: '1rem 2rem' }}>Retake</button>
                                    <button onClick={handleAnalyze} className="btn-primary" style={{ padding: '1rem 2rem' }}><RefreshCw size={20} /> Analyze Food</button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Scan;
