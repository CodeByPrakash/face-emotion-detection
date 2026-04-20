import { useState, useCallback } from 'react';

export function useSnapshots() {
    const [snapshots, setSnapshots] = useState([]);

    const takeSnapshot = useCallback((videoEl, emotion, confidence) => {
        if (!videoEl) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, -canvas.width, 0);
        ctx.restore();
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSnapshots((prev) => [
            { id: Date.now(), dataUrl, emotion, confidence, time: new Date() },
            ...prev,
        ].slice(0, 20)); // keep last 20
    }, []);

    const deleteSnapshot = useCallback((id) => {
        setSnapshots((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const clearAll = useCallback(() => setSnapshots([]), []);

    return { snapshots, takeSnapshot, deleteSnapshot, clearAll };
}
