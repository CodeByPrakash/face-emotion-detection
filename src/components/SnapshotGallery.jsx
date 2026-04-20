import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Trash2, X, Image } from 'lucide-react';
import { EMOTION_COLORS, EMOTION_EMOJI } from '../hooks/useFaceDetection';

export default function SnapshotGallery({ snapshots, onTakeSnapshot, onDelete, onClear, canTakeSnapshot }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card">
                <div className="card-header">
                    <span className="card-title"><Image size={15} /> Snapshot Gallery</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" onClick={onTakeSnapshot} disabled={!canTakeSnapshot} style={{ fontSize: 12, padding: '6px 12px' }}>
                            <Camera size={13} /> Capture
                        </button>
                        {snapshots.length > 0 && (
                            <button className="btn-danger" onClick={onClear} style={{ fontSize: 12, padding: '6px 12px' }}>
                                <Trash2 size={13} /> Clear All
                            </button>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    {snapshots.length === 0 ? (
                        <div className="empty-state">
                            <Camera size={28} />
                            <span>No snapshots yet. Start detection and press Capture.</span>
                        </div>
                    ) : (
                        <div className="snapshot-grid">
                            <AnimatePresence>
                                {snapshots.map((s) => (
                                    <motion.div
                                        key={s.id}
                                        className="snapshot-item"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <img src={s.dataUrl} alt={s.emotion} />
                                        <div className="snapshot-emotion" style={{ color: EMOTION_COLORS[s.emotion] }}>
                                            {EMOTION_EMOJI[s.emotion]} {s.emotion}
                                        </div>
                                        <button
                                            onClick={() => onDelete(s.id)}
                                            style={{
                                                position: 'absolute', top: 4, right: 4,
                                                width: 20, height: 20, borderRadius: 6,
                                                background: 'rgba(0,0,0,0.6)', border: 'none',
                                                color: 'white', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                        >
                                            <X size={11} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
