# 🎭 EmoSense — Face Emotion Detector

> Real-time face emotion detection dashboard powered by AI, built with React + Vite and face-api.js.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![face-api.js](https://img.shields.io/badge/face--api.js-0.22-ff6b6b)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **Real-time emotion detection** via webcam using TinyFaceDetector + FaceExpressionNet
- **Multi-face support** — detects and labels multiple faces simultaneously
- **4 live charts** — Bar, Radar, Donut, and Line (history) charts for emotion visualization
- **Session stats** — tracks dominant emotion, total frames, and per-emotion percentages
- **Snapshot gallery** — capture and save webcam frames annotated with detected emotions
- **Configurable settings** — adjust detection interval, confidence threshold, and facial landmark overlay
- **Animated UI** — smooth page transitions with Framer Motion
- **Dark premium dashboard** with collapsible sidebar

---

## 🗂️ Project Structure

```
Face-Emotion-Detection/
├── public/
│   └── models/                  # face-api.js model weights (required)
│       ├── tiny_face_detector_model-*
│       ├── face_landmark_68_tiny_model-*
│       └── face_expression_model-*
├── src/
│   ├── components/
│   │   ├── VideoFeed.jsx        # Webcam feed with canvas overlay
│   │   ├── StatsPanel.jsx       # Live emotion stats
│   │   ├── EmotionBarChart.jsx  # Current emotion bar chart
│   │   ├── EmotionRadarChart.jsx
│   │   ├── EmotionDonutChart.jsx
│   │   ├── EmotionLineChart.jsx # Emotion history over time
│   │   ├── SnapshotGallery.jsx  # Saved snapshots
│   │   ├── SettingsPanel.jsx    # Detection settings
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── hooks/
│   │   ├── useFaceDetection.js  # Core AI detection loop
│   │   ├── useEmotionHistory.js # History & session stats
│   │   └── useSnapshots.js      # Snapshot management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A webcam / camera device

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MrStark65/Face-Emotion-Detection.git
cd Face-Emotion-Detection

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The app requires camera permission. Allow it when prompted by your browser.

---

## 🧠 AI Models

The face-api.js model weights are already bundled in `public/models/`. Three models are used:

| Model | Purpose |
|---|---|
| `tiny_face_detector` | Fast face bounding box detection |
| `face_landmark_68_tiny` | 68-point facial landmark detection |
| `face_expression` | Expression/emotion classification |

If you need to re-download the models manually, grab them from the [face-api.js weights repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place the files in `public/models/`.

---

## 🎛️ Settings

| Setting | Default | Description |
|---|---|---|
| Detection Interval | 300ms | How often the detection loop runs |
| Confidence Threshold | 0.5 | Minimum score to register a face |
| Show Landmarks | Off | Overlay 68-point facial landmarks on the video |

---

## 🏗️ Tech Stack

| Technology | Role |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite 6](https://vitejs.dev/) | Build tool & dev server |
| [face-api.js](https://github.com/justadudewhohacks/face-api.js) | In-browser face & emotion AI |
| [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) | Data visualization |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Lucide React](https://lucide.dev/) | Icons |

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
