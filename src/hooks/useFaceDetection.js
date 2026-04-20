import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const MODELS_URL = '/models';

export function useFaceDetection(videoRef, canvasRef, settings) {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [faceData, setFaceData] = useState([]);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const isRunningRef = useRef(false);

    // Load models
    useEffect(() => {
        let cancelled = false;

        const loadModels = async () => {
            try {
                setIsLoading(true);
                setLoadingProgress(0);

                await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
                if (cancelled) return;
                setLoadingProgress(33);

                await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL);
                if (cancelled) return;
                setLoadingProgress(66);

                await faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL);
                if (cancelled) return;
                setLoadingProgress(100);

                setIsModelLoaded(true);
                setIsLoading(false);
            } catch (err) {
                if (!cancelled) {
                    console.error('Model loading error:', err);
                    setError('Failed to load AI models. Please check that model files exist at /public/models/');
                    setIsLoading(false);
                }
            }
        };

        loadModels();
        return () => { cancelled = true; };
    }, []);

    // Detection loop
    const startDetection = useCallback(() => {
        if (!isModelLoaded || isRunningRef.current) return;
        isRunningRef.current = true;

        const detect = async () => {
            if (!videoRef.current || !canvasRef.current) return;
            const video = videoRef.current;
            if (video.readyState < 2) return;

            try {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: settings.confidence }))
                    .withFaceLandmarks(true)
                    .withFaceExpressions();

                // Draw on canvas
                const canvas = canvasRef.current;
                const dims = faceapi.matchDimensions(canvas, video, true);
                const resized = faceapi.resizeResults(detections, dims);

                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                resized.forEach((det) => {
                    const { x, y, width, height } = det.detection.box;
                    const expressions = det.expressions;
                    const dominant = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];

                    // Draw box
                    const emotionColor = getEmotionColor(dominant[0]);
                    ctx.strokeStyle = emotionColor;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = emotionColor;
                    ctx.shadowBlur = 8;
                    ctx.strokeRect(x, y, width, height);
                    ctx.shadowBlur = 0;

                    // Corner decorations
                    const cornerSize = 12;
                    ctx.lineWidth = 3;
                    // TL
                    ctx.beginPath(); ctx.moveTo(x, y + cornerSize); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize, y); ctx.stroke();
                    // TR
                    ctx.beginPath(); ctx.moveTo(x + width - cornerSize, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerSize); ctx.stroke();
                    // BL
                    ctx.beginPath(); ctx.moveTo(x, y + height - cornerSize); ctx.lineTo(x, y + height); ctx.lineTo(x + cornerSize, y + height); ctx.stroke();
                    // BR
                    ctx.beginPath(); ctx.moveTo(x + width - cornerSize, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - cornerSize); ctx.stroke();

                    // Label background
                    const label = `${EMOTION_EMOJI[dominant[0]]} ${dominant[0]} ${(dominant[1] * 100).toFixed(0)}%`;
                    ctx.font = 'bold 13px Inter, sans-serif';
                    const textW = ctx.measureText(label).width + 16;
                    const textH = 24;
                    const lx = x;
                    const ly = y - textH - 4;

                    ctx.fillStyle = 'rgba(0,0,0,0.75)';
                    ctx.beginPath();
                    ctx.roundRect(lx, Math.max(0, ly), textW, textH, 6);
                    ctx.fill();
                    ctx.shadowColor = emotionColor;
                    ctx.shadowBlur = 6;
                    ctx.fillStyle = emotionColor;
                    ctx.fillText(label, lx + 8, Math.max(16, ly + 17));
                    ctx.shadowBlur = 0;

                    // Landmarks
                    if (settings.showLandmarks) {
                        ctx.fillStyle = 'rgba(99,102,241,0.6)';
                        det.landmarks.positions.forEach(pt => {
                            ctx.beginPath();
                            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    }
                });

                setFaceData(detections.map(d => ({
                    expressions: { ...d.expressions },
                    box: { ...d.detection.box },
                })));
            } catch (e) {
                // ignore frame errors
            }
        };

        intervalRef.current = setInterval(detect, settings.interval);
    }, [isModelLoaded, settings, videoRef, canvasRef]);

    const stopDetection = useCallback(() => {
        isRunningRef.current = false;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setFaceData([]);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [canvasRef]);

    return { isModelLoaded, isLoading, loadingProgress, faceData, error, startDetection, stopDetection };
}

export const EMOTION_COLORS = {
    happy: '#facc15',
    sad: '#60a5fa',
    angry: '#f87171',
    fearful: '#a78bfa',
    disgusted: '#4ade80',
    surprised: '#fb923c',
    neutral: '#94a3b8',
};

export const EMOTION_EMOJI = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲',
    neutral: '😐',
};

function getEmotionColor(emotion) {
    return EMOTION_COLORS[emotion] || '#6366f1';
}

export const EMOTIONS = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
