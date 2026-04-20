import { motion } from 'framer-motion';
import { Users, Smile, Zap, Clock, RotateCcw } from 'lucide-react';
import { EMOTION_COLORS, EMOTION_EMOJI, EMOTIONS } from '../hooks/useFaceDetection';

const emotionEmoji = EMOTION_EMOJI;

function StatCard({ icon: Icon, label, value, sub, color }) {
    return (
        <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </div>
    );
}

export default function StatsPanel({ faceData, dominantEmotion, sessionStats, isStreaming, onReset }) {
    const [domName, domConf] = dominantEmotion || ['neutral', 0];
    const faceCount = faceData.length;

    const longestStreak = sessionStats.longestStreak;
    const sessionTime = sessionStats.totalFrames;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Dominant emotion hero */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 70% 50%, ${EMOTION_COLORS[domName]}18, transparent 70%)`,
                    pointerEvents: 'none',
                }} />
                <div className="card-header">
                    <span className="card-title"><Smile size={15} /> Current Emotion</span>
                    {faceCount > 0 && (
                        <span className="face-count-badge">
                            <Users size={12} />
                            {faceCount} {faceCount === 1 ? 'face' : 'faces'}
                        </span>
                    )}
                </div>
                <motion.div
                    className="dominant-emotion"
                    key={domName}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <span className="emotion-emoji" style={{ color: EMOTION_COLORS[domName] }}>
                        {emotionEmoji[domName]}
                    </span>
                    <span className="emotion-name" style={{ color: EMOTION_COLORS[domName] }}>
                        {isStreaming && faceCount > 0 ? domName : '—'}
                    </span>
                    <span className="emotion-confidence">
                        {isStreaming && faceCount > 0
                            ? `${(domConf * 100).toFixed(1)}% confidence`
                            : 'No face detected'}
                    </span>
                </motion.div>
            </div>

            {/* Mini stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatCard
                    icon={Users}
                    label="Faces Detected"
                    value={faceCount}
                    sub="in current frame"
                    color="#22d3ee"
                />
                <StatCard
                    icon={Zap}
                    label="Longest Streak"
                    value={longestStreak.emotion ? `${emotionEmoji[longestStreak.emotion]} ×${longestStreak.count}` : '—'}
                    sub={longestStreak.emotion || 'none yet'}
                    color="#facc15"
                />
                <StatCard
                    icon={Clock}
                    label="Total Frames"
                    value={sessionTime.toLocaleString()}
                    sub="analyzed this session"
                    color="#a855f7"
                />
                <StatCard
                    icon={Smile}
                    label="Top Emotion"
                    value={sessionStats.totalFrames > 0
                        ? EMOTIONS.reduce((a, b) =>
                            (sessionStats.dominantCounts[a] || 0) > (sessionStats.dominantCounts[b] || 0) ? a : b
                        )
                        : '—'}
                    sub="most frequent"
                    color="#4ade80"
                />
            </div>

            {/* Reset button */}
            <button className="btn-danger" onClick={onReset} style={{ width: '100%', justifyContent: 'center' }}>
                <RotateCcw size={14} />
                Reset Session Stats
            </button>
        </div>
    );
}
