import { useState, useCallback, useRef } from 'react';
import { EMOTIONS } from './useFaceDetection';

const MAX_HISTORY = 60; // 60 data points

const emptyEmotions = () =>
    Object.fromEntries(EMOTIONS.map((e) => [e, 0]));

export function useEmotionHistory() {
    const [history, setHistory] = useState([]); // array of { time, emotions }
    const [sessionStats, setSessionStats] = useState({
        totalFrames: 0,
        averages: emptyEmotions(),
        dominantCounts: emptyEmotions(),
        currentStreak: { emotion: null, count: 0 },
        longestStreak: { emotion: null, count: 0 },
    });

    const streakRef = useRef({ emotion: null, count: 0 });
    const longestRef = useRef({ emotion: null, count: 0 });
    const runningSum = useRef(emptyEmotions());
    const frameCount = useRef(0);

    const addFrame = useCallback((faceDataArray) => {
        if (!faceDataArray || faceDataArray.length === 0) return;

        // Average expressions across all detected faces
        const avg = emptyEmotions();
        faceDataArray.forEach(({ expressions }) => {
            EMOTIONS.forEach((e) => { avg[e] = (avg[e] || 0) + (expressions[e] || 0); });
        });
        EMOTIONS.forEach((e) => { avg[e] /= faceDataArray.length; });

        // Dominant emotion
        const dominant = Object.entries(avg).sort((a, b) => b[1] - a[1])[0][0];

        // Update streak
        const streak = streakRef.current;
        if (streak.emotion === dominant) {
            streak.count++;
        } else {
            streak.emotion = dominant;
            streak.count = 1;
        }
        if (streak.count > longestRef.current.count) {
            longestRef.current = { ...streak };
        }

        // Running sums for averages
        EMOTIONS.forEach((e) => { runningSum.current[e] += avg[e]; });
        frameCount.current++;

        const newPoint = { time: Date.now(), emotions: avg };

        setHistory((prev) => {
            const next = [...prev, newPoint];
            return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
        });

        setSessionStats((prev) => {
            const dominantCounts = { ...prev.dominantCounts };
            dominantCounts[dominant] = (dominantCounts[dominant] || 0) + 1;

            const averages = emptyEmotions();
            EMOTIONS.forEach((e) => { averages[e] = runningSum.current[e] / frameCount.current; });

            return {
                totalFrames: frameCount.current,
                averages,
                dominantCounts,
                currentStreak: { ...streak },
                longestStreak: { ...longestRef.current },
            };
        });
    }, []);

    const reset = useCallback(() => {
        setHistory([]);
        runningSum.current = emptyEmotions();
        frameCount.current = 0;
        streakRef.current = { emotion: null, count: 0 };
        longestRef.current = { emotion: null, count: 0 };
        setSessionStats({
            totalFrames: 0,
            averages: emptyEmotions(),
            dominantCounts: emptyEmotions(),
            currentStreak: { emotion: null, count: 0 },
            longestStreak: { emotion: null, count: 0 },
        });
    }, []);

    // Current emotions (latest frame)
    const currentEmotions = history.length > 0
        ? history[history.length - 1].emotions
        : emptyEmotions();

    const dominantEmotion = Object.entries(currentEmotions).sort((a, b) => b[1] - a[1])[0];

    return { history, currentEmotions, dominantEmotion, sessionStats, addFrame, reset };
}
