import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend
} from 'chart.js';
import { PieChart } from 'lucide-react';
import { EMOTION_COLORS, EMOTIONS } from '../hooks/useFaceDetection';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EmotionDonutChart({ sessionStats }) {
    const counts = EMOTIONS.map(e => sessionStats.dominantCounts[e] || 0);
    const total = counts.reduce((a, b) => a + b, 0);

    const data = useMemo(() => ({
        labels: EMOTIONS.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
        datasets: [{
            data: counts,
            backgroundColor: EMOTIONS.map(e => EMOTION_COLORS[e] + 'cc'),
            borderColor: EMOTIONS.map(e => EMOTION_COLORS[e]),
            borderWidth: 1.5,
            hoverOffset: 6,
        }],
    }), [counts]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        animation: { duration: 400 },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', size: 11 },
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    filter: (item) => counts[item.index] > 0,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(14,14,26,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 10,
                callbacks: {
                    label: ctx => {
                        const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
                        return ` ${ctx.label}: ${pct}%`;
                    }
                }
            },
        },
    }), [counts, total]);

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <span className="card-title">
                    <PieChart size={15} />
                    Session Distribution
                </span>
                <span className="badge">{total} frames</span>
            </div>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                {total === 0 ? (
                    <div className="empty-state" style={{ padding: 20 }}>
                        <PieChart size={24} />
                        <span>No data yet</span>
                    </div>
                ) : (
                    <div style={{ width: '100%', maxWidth: 280, position: 'relative' }}>
                        <Doughnut data={data} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
}
