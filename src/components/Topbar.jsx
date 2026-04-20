import { Camera, RotateCcw, Brain } from 'lucide-react';

export default function Topbar({ page, isStreaming, faceCount, onSnapshot, canSnapshot }) {
    const pageTitles = {
        dashboard: 'Dashboard',
        snapshots: 'Snapshot Gallery',
        settings: 'Settings',
    };

    return (
        <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="topbar-title">{pageTitles[page] || 'EmoSense'}</span>
                {isStreaming && faceCount > 0 && (
                    <span className="face-count-badge">
                        <Brain size={11} />
                        {faceCount} face{faceCount !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
            <div className="topbar-actions">
                {page === 'dashboard' && (
                    <button
                        className="btn-primary"
                        onClick={onSnapshot}
                        disabled={!canSnapshot}
                        style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                        <Camera size={13} />
                        Snapshot
                    </button>
                )}
            </div>
        </header>
    );
}
