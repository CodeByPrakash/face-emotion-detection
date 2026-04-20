import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Loader } from 'lucide-react';

export default function VideoFeed({ videoRef, canvasRef, isStreaming, setIsStreaming, isModelLoaded, loadingProgress }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const streamRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setHasCameraPermission(true);
            setIsStreaming(true);
        } catch (err) {
            console.error('Camera error:', err);
            setHasCameraPermission(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsStreaming(false);
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        };
    }, []);

    return (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
                <span className="card-title">
                    <Camera size={15} />
                    Live Feed
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isStreaming && <span className="badge live">LIVE</span>}
                    <button
                        className={isStreaming ? 'btn-danger' : 'btn-primary'}
                        onClick={isStreaming ? stopCamera : startCamera}
                        disabled={!isModelLoaded}
                        style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                        {isStreaming ? <><CameraOff size={13} /> Stop</> : <><Camera size={13} /> Start Camera</>}
                    </button>
                </div>
            </div>

            {/* Model loading bar */}
            {!isModelLoaded && (
                <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Loader size={13} style={{ color: 'var(--primary-light)', animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loading AI models... {loadingProgress}%</span>
                    </div>
                    <div className="loading-bar" style={{ width: `${loadingProgress}%`, height: 3, transition: 'width 0.5s ease' }} />
                </div>
            )}

            <div className="card-body" style={{ padding: 12 }}>
                <div className="video-container" style={{ background: '#000', borderRadius: 10 }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            transform: 'scaleX(-1)',
                            objectFit: 'cover',
                            display: isStreaming ? 'block' : 'none',
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            transform: 'scaleX(-1)',
                            display: isStreaming ? 'block' : 'none',
                        }}
                    />

                    <AnimatePresence>
                        {!isStreaming && (
                            <motion.div
                                className="no-camera"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <CameraOff size={36} style={{ opacity: 0.3 }} />
                                {hasCameraPermission === false ? (
                                    <span style={{ fontSize: 13 }}>Camera access denied. Please allow camera permissions.</span>
                                ) : (
                                    <span style={{ fontSize: 13 }}>
                                        {isModelLoaded ? 'Click "Start Camera" to begin detection' : 'Waiting for AI models to load...'}
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
