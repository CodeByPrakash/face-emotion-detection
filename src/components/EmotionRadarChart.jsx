import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Crosshair } from 'lucide-react';
import { EMOTION_COLORS, EMOTIONS } from '../hooks/useFaceDetection';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function EmotionRadarChart({ currentEmotions }) {
    const data = useMemo(() => ({
        labels: EMOTIONS.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
        datasets: [{
            label: 'Current',
            data: EMOTIONS.map(e => (currentEmotions[e] || 0) * 100),
            backgroundColor: 'rgba(99,102,241,0.15)',
            borderColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: EMOTIONS.map(e => EMOTION_COLORS[e]),
            pointBorderColor: 'transparent',
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    }), [currentEmotions]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 300 },
        scales: {
            r: {
                min: 0,
                max: 100,
                angleLines: { color: 'rgba(255,255,255,0.06)' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                pointLabels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', size: 11 },
                },
                ticks: {
                    display: false,
                    stepSize: 25,
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(14,14,26,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 10,
                callbacks: {
                    label: ctx => ` ${ctx.parsed.r.toFixed(1)}%`,
                },
            },
        },
    }), []);

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <span className="card-title">
                    <Crosshair size={15} />
                    Emotion Radar
                </span>
            </div>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
                <div style={{ width: '100%', maxWidth: 260 }}>
                    <Radar data={data} options={options} />
                </div>
            </div>
        </div>
    );
}
