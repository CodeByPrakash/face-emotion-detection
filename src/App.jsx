import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import VideoFeed from './components/VideoFeed';
import EmotionBarChart from './components/EmotionBarChart';
import EmotionLineChart from './components/EmotionLineChart';
import EmotionRadarChart from './components/EmotionRadarChart';
import EmotionDonutChart from './components/EmotionDonutChart';
import StatsPanel from './components/StatsPanel';
import SettingsPanel from './components/SettingsPanel';
import SnapshotGallery from './components/SnapshotGallery';

import { useFaceDetection } from './hooks/useFaceDetection';
import { useEmotionHistory } from './hooks/useEmotionHistory';
import { useSnapshots } from './hooks/useSnapshots';

const DEFAULT_SETTINGS = {
    interval: 300,
    confidence: 0.5,
    showLandmarks: false,
};

export default function App() {
    const [page, setPage] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const {
        isModelLoaded, isLoading, loadingProgress,
        faceData, error, startDetection, stopDetection
    } = useFaceDetection(videoRef, canvasRef, settings);

    const {
        history, currentEmotions, dominantEmotion, sessionStats, addFrame, reset
    } = useEmotionHistory();

    const { snapshots, takeSnapshot, deleteSnapshot, clearAll } = useSnapshots();

    // Feed face data to history
    useEffect(() => {
        if (faceData.length > 0) {
            addFrame(faceData);
        }
    }, [faceData, addFrame]);

    // Start/stop detection when streaming changes
    useEffect(() => {
        if (isStreaming && isModelLoaded) {
            stopDetection();
            setTimeout(() => startDetection(), 100);
        } else {
            stopDetection();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming, isModelLoaded, settings]);

    const handleSnapshot = useCallback(() => {
        if (videoRef.current && faceData.length > 0) {
            const [domName, domConf] = dominantEmotion;
            takeSnapshot(videoRef.current, domName, domConf);
            setPage('snapshots');
        }
    }, [videoRef, faceData, dominantEmotion, takeSnapshot]);

    if (error) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32 }}>
                <span style={{ fontSize: 32 }}>⚠️</span>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 480, lineHeight: 1.6 }}>{error}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Download face-api.js models to <code style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4 }}>public/models/</code>.
                    See the project README for instructions.
                </p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar
                page={page}
                setPage={setPage}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <div className="main-content">
                <Topbar
                    page={page}
                    isStreaming={isStreaming}
                    faceCount={faceData.length}
                    onSnapshot={handleSnapshot}
                    canSnapshot={isStreaming && faceData.length > 0}
                />

                <div className="content-area">
                    <AnimatePresence mode="wait">
                        {/* ===== DASHBOARD ===== */}
                        {page === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                            >
                                {/* Row 1: Video + Stats */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                                    <VideoFeed
                                        videoRef={videoRef}
                                        canvasRef={canvasRef}
                                        isStreaming={isStreaming}
                                        setIsStreaming={setIsStreaming}
                                        isModelLoaded={isModelLoaded}
                                        loadingProgress={loadingProgress}
                                    />
                                    <StatsPanel
                                        faceData={faceData}
                                        dominantEmotion={dominantEmotion}
                                        sessionStats={sessionStats}
                                        isStreaming={isStreaming}
                                        onReset={reset}
                                    />
                                </div>

                                {/* Row 2: Bar + Radar + Donut */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gap: 20 }}>
                                    <EmotionBarChart currentEmotions={currentEmotions} />
                                    <EmotionRadarChart currentEmotions={currentEmotions} />
                                    <EmotionDonutChart sessionStats={sessionStats} />
                                </div>

                                {/* Row 3: Line chart full width */}
                                <EmotionLineChart history={history} />
                            </motion.div>
                        )}

                        {/* ===== SNAPSHOTS ===== */}
                        {page === 'snapshots' && (
                            <motion.div
                                key="snapshots"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <SnapshotGallery
                                    snapshots={snapshots}
                                    onTakeSnapshot={handleSnapshot}
                                    onDelete={deleteSnapshot}
                                    onClear={clearAll}
                                    canTakeSnapshot={isStreaming && faceData.length > 0}
                                />
                            </motion.div>
                        )}

                        {/* ===== SETTINGS ===== */}
                        {page === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                style={{ maxWidth: 600 }}
                            >
                                <SettingsPanel settings={settings} setSettings={setSettings} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
