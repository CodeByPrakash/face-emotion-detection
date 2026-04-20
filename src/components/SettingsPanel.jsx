import { Settings, Sliders, Eye, Timer } from 'lucide-react';

function Toggle({ checked, onChange }) {
    return (
        <label className="toggle">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
        </label>
    );
}

export default function SettingsPanel({ settings, setSettings }) {
    return (
        <div className="glass-card">
            <div className="card-header">
                <span className="card-title"><Settings size={15} /> Detection Settings</span>
            </div>
            <div className="card-body">

                {/* Detection interval */}
                <div className="setting-row">
                    <div>
                        <div className="setting-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Timer size={13} style={{ color: 'var(--primary-light)' }} />
                            Detection Interval
                        </div>
                        <div className="setting-desc">{settings.interval}ms between detections</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="range"
                            min={100}
                            max={1000}
                            step={50}
                            value={settings.interval}
                            onChange={e => setSettings(s => ({ ...s, interval: Number(e.target.value) }))}
                        />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 42, textAlign: 'right' }}>
                            {settings.interval}ms
                        </span>
                    </div>
                </div>

                {/* Confidence threshold */}
                <div className="setting-row">
                    <div>
                        <div className="setting-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Sliders size={13} style={{ color: 'var(--primary-light)' }} />
                            Min Confidence
                        </div>
                        <div className="setting-desc">Ignore detections below this threshold</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="range"
                            min={0.1}
                            max={0.9}
                            step={0.05}
                            value={settings.confidence}
                            onChange={e => setSettings(s => ({ ...s, confidence: Number(e.target.value) }))}
                        />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 42, textAlign: 'right' }}>
                            {(settings.confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Show landmarks */}
                <div className="setting-row">
                    <div>
                        <div className="setting-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Eye size={13} style={{ color: 'var(--primary-light)' }} />
                            Show Facial Landmarks
                        </div>
                        <div className="setting-desc">Draw 68 facial keypoints on faces</div>
                    </div>
                    <Toggle
                        checked={settings.showLandmarks}
                        onChange={v => setSettings(s => ({ ...s, showLandmarks: v }))}
                    />
                </div>

            </div>
        </div>
    );
}
