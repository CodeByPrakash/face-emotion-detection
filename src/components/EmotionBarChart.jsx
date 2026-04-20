import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { BarChart2 } from 'lucide-react';
import { EMOTION_COLORS, EMOTIONS } from '../hooks/useFaceDetection';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EmotionBarChart({ currentEmotions }) {
    const data = useMemo(() => ({
        labels: EMOTIONS.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
        datasets: [{
            label: 'Confidence',
            data: EMOTIONS.map(e => (currentEmotions[e] || 0) * 100),
            backgroundColor: EMOTIONS.map(e => EMOTION_COLORS[e] + 'cc'),
            borderColor: EMOTIONS.map(e => EMOTION_COLORS[e]),
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
        }],
    }), [currentEmotions]);

    const options = useMemo(() => ({
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        scales: {
            x: {
                min: 0,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#475569',
                    font: { family: 'Inter', size: 11 },
                    callback: v => `${v}%`,
                },
                border: { color: 'transparent' },
            },
            y: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
                border: { color: 'transparent' },
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
                    label: ctx => ` ${ctx.parsed.x.toFixed(1)}%`,
                },
            },
        },
    }), []);

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <span className="card-title">
                    <BarChart2 size={15} />
                    Emotion Breakdown
                </span>
                <span className="badge">Live</span>
            </div>
            <div className="card-body" style={{ flex: 1, minHeight: 240 }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
