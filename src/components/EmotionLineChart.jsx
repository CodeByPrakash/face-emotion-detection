import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import { TrendingUp } from 'lucide-react';
import { EMOTION_COLORS, EMOTIONS } from '../hooks/useFaceDetection';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const VISIBLE = ['happy', 'sad', 'angry', 'surprised', 'neutral'];

export default function EmotionLineChart({ history }) {
    const data = useMemo(() => {
        const labels = history.map((_, i) => i === history.length - 1 ? 'Now' : '');
        return {
            labels,
            datasets: VISIBLE.map(emotion => ({
                label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                data: history.map(h => (h.emotions[emotion] || 0) * 100),
                borderColor: EMOTION_COLORS[emotion],
                backgroundColor: EMOTION_COLORS[emotion] + '18',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                fill: false,
                tension: 0.4,
            })),
        };
    }, [history]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 200 },
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false },
                border: { color: 'transparent' },
            },
            y: {
                min: 0,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#475569',
                    font: { family: 'Inter', size: 11 },
                    callback: v => `${v}%`,
                    maxTicksLimit: 5,
                },
                border: { color: 'transparent' },
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', size: 11 },
                    boxWidth: 12,
                    boxHeight: 2,
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'line',
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(14,14,26,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 10,
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`,
                },
            },
        },
    }), []);

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <span className="card-title">
                    <TrendingUp size={15} />
                    Emotion History
                </span>
                <span className="badge">Last 60 frames</span>
            </div>
            <div className="card-body" style={{ flex: 1, minHeight: 220 }}>
                {history.length < 2 ? (
                    <div className="empty-state" style={{ height: 220 }}>
                        <TrendingUp size={28} />
                        <span>Start detection to see emotion trends over time</span>
                    </div>
                ) : (
                    <Line data={data} options={options} />
                )}
            </div>
        </div>
    );
}
