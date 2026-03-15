import { useState, useCallback, useRef, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";



// ─── CSS INJECTED ONCE ───────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0f172a;
    --navy2: #1e293b;
    --blue: #3b82f6;
    --sky: #60a5fa;
    --ice: #eff6ff;
    --mint: #10b981;
    --gold: #f59e0b;
    --danger: #ef4444;
    --success: #22c55e;
    --gray50: #f8fafc;
    --gray100: #f1f5f9;
    --gray200: #e2e8f0;
    --gray400: #94a3b8;
    --gray600: #475569;
    --gray800: #1e293b;
    --white: #ffffff;
    --shadow-xs: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
    --shadow-sm: 0 4px 6px -2px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
    --shadow-md: 0 12px 24px -8px rgba(0,0,0,0.1), 0 4px 8px -2px rgba(0,0,0,0.05);
    --shadow-lg: 0 24px 48px -16px rgba(0,0,0,0.15), 0 8px 16px -4px rgba(0,0,0,0.08);
    --shadow-xl: 0 32px 64px -20px rgba(0,0,0,0.2), 0 12px 24px -8px rgba(0,0,0,0.1);
    --shadow-glow: 0 0 0 2px rgba(59,130,246,0.2);
  }

  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
    background: var(--gray50); 
    color: var(--gray800); 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.02em;
  }

  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animate-fade { animation: fadeIn 0.3s ease both; }
  .animate-slide-up { animation: slideUp 0.35s ease both; }
  .animate-slide-right { animation: slideRight 0.35s ease both; }
  .animate-scale { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }

  .hover-lift {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg) !important;
  }

  .hover-scale {
    transition: transform 0.2s ease;
  }
  .hover-scale:hover {
    transform: scale(1.02);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--navy), var(--navy2));
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    box-shadow: var(--shadow-sm);
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, var(--navy2), var(--blue));
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-cta{
  padding:14px 32px;
  font-size:16px;
  border-radius:12px;
  box-shadow:0 8px 24px rgba(0,0,0,0.35);
}

  .btn-secondary {
    background: white;
    color: var(--gray600);
    border: 1px solid var(--gray200);
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    box-shadow: var(--shadow-xs);
  }
  .btn-secondary:hover {
    background: var(--gray50);
    border-color: var(--gray400);
    color: var(--gray800);
    box-shadow: var(--shadow-sm);
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--gray200);
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: var(--gray600);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
  }
  .btn-ghost:hover {
    background: var(--gray50);
    border-color: var(--gray400);
    color: var(--gray800);
  }

  .btn-danger {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: var(--danger);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
  }
  .btn-danger:hover {
    background: var(--danger);
    color: white;
    border-color: var(--danger);
  }


 .metric-input{

  width:100%;
  height:40px;

  border-radius:10px;

  border:1px solid var(--gray200);

  padding:0 12px;

  font-size:14px;
  font-weight:500;

  color:var(--navy);

  background:var(--white);

  outline:none;

  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    transform .15s ease;

}

.metric-input:hover{

  border-color:var(--gray300);

}

.metric-input:focus{

  border-color:var(--blue);

  box-shadow:0 0 0 3px rgba(59,130,246,0.15);

  transform:scale(1.01);

}


/* Remove number arrows */

.metric-input::-webkit-outer-spin-button,
.metric-input::-webkit-inner-spin-button{

  -webkit-appearance:none;
  margin:0;

}

.metric-input[type=number]{

  -moz-appearance:textfield;

}


 .card{
position:relative;

background:white;

border-radius:16px;

border:1px solid #e2e8f0;

padding:22px;

display:flex;
flex-direction:column;

/* REMOVE THESE */
/* align-items:center; */
/* text-align:center; */

align-items:stretch;
text-align:left;

box-shadow:
0 4px 10px rgba(0,0,0,0.04),
0 14px 28px rgba(0,0,0,0.05);

transition:
transform .25s cubic-bezier(.2,.8,.2,1),
box-shadow .25s cubic-bezier(.2,.8,.2,1),
border-color .25s ease;

}

.card:hover{

transform:translateY(-6px);

box-shadow:
0 10px 24px rgba(0,0,0,0.08),
0 22px 46px rgba(0,0,0,0.10);

border-color:#dbe3ec;

}

.card-img{
width:100%;
height:140px;
border-radius:12px;
overflow:hidden;
margin-bottom:16px;
background:#f8fafc;
}

.card-img img{
width:100%;
height:100%;
object-fit:cover;
transition:transform .35s ease;
}

.card:hover .card-img img{
transform:scale(1.08);
}


 .card:hover {

  transform: translateY(-4px);

  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 18px 36px rgba(0,0,0,0.08);

  border-color: var(--gray300);

}

.section-title{
font-size:26px;
font-weight:700;
margin-bottom:22px;
letter-spacing:-0.02em;
}

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.01em;
  }

  .badge-success {
    background: #dcfce7;
    color: #166534;
  }
  
  .badge-danger {
    background: #fee2e2;
    color: #991b1b;
  }

  .badge-info {
    background: var(--ice);
    color: var(--navy);
  }

  .metric-progress {
    height: 6px;
    border-radius: 3px;
    background: var(--gray200);
    overflow: hidden;
  }
  .metric-progress-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .upload-zone {

  border: 2px dashed var(--gray200);

  border-radius: 14px;

  padding: 28px 24px;

  text-align: center;

  cursor: pointer;

  background: var(--gray50);

  min-height: 140px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 12px;

  transition:
    border-color .25s ease,
    background .25s ease,
    transform .2s ease,
    box-shadow .25s ease;

}


/* Hover */

.upload-zone:hover {

  border-color: var(--blue);

  background: var(--ice);

  box-shadow: 0 8px 20px rgba(0,0,0,0.06);

}


/* Dragging */

.upload-zone.dragging {

  border-color: var(--blue);

  background: var(--ice);

  transform: scale(1.02);

  box-shadow: 0 12px 28px rgba(59,130,246,0.15);

}


/* File Uploaded */

.upload-zone.has-file {

  border-style: solid;

  border-color: var(--blue);

  background: var(--ice);

  box-shadow: 0 6px 16px rgba(0,0,0,0.05);

}

.weight-slider{

width:100%;

height:6px;

border-radius:6px;

appearance:none;

outline:none;

cursor:pointer;

transition:background .2s ease;

}


/* Chrome / Edge thumb */

.weight-slider::-webkit-slider-thumb{

appearance:none;

width:16px;

height:16px;

border-radius:50%;

background:var(--blue);

cursor:pointer;

border:3px solid white;

box-shadow:0 2px 6px rgba(0,0,0,0.15);

transition:transform .15s ease;

}


/* Hover thumb */

.weight-slider::-webkit-slider-thumb:hover{

transform:scale(1.15);

}


/* Firefox */

.weight-slider::-moz-range-thumb{

width:16px;

height:16px;

border-radius:50%;

background:var(--blue);

border:3px solid white;

cursor:pointer;

}

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    margin-bottom: 4px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
  }
  .nav-item:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }
  .nav-item.active {
    background: rgba(255,255,255,0.15);
    color: white;
    font-weight: 600;
    backdrop-filter: blur(8px);
  }

  .stat-tile {
    position: relative;
    overflow: hidden;
    border-radius: 14px;
    padding: 20px;
    background: white;
    border: 1px solid var(--gray200);
    box-shadow: var(--shadow-xs);
    transition: all 0.2s ease;
  }
  .stat-tile::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--sky));
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .stat-tile:hover::after {
    opacity: 1;
  }

  .tab-btn {
    padding: 8px 18px;
    border-radius: 10px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--gray100);
    color: var(--gray600);
  }
  .tab-btn:hover {
    background: var(--gray200);
    color: var(--gray800);
  }
  .tab-btn.active {
    background: var(--navy);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .metric-row {
    display: grid;
    grid-template-columns: 140px 1fr 1fr auto auto;
    gap: 16px;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--gray200);
    transition: background 0.15s;
  }
  .metric-row:hover {
    background: var(--gray50);
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--navy), var(--blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  input[type=range] {
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--blue);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: var(--shadow-md);
  }

  @media print {
    aside, header, .no-print { display: none !important; }
    main { margin: 0 !important; padding: 20px !important; }
    .card { box-shadow: none !important; border: 1px solid #ddd !important; }
    @page { size: A4; margin: 20mm; }
  }

  .layout-grid {
    display: grid;
    gap: 24px;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text-xs { font-size: 12px; line-height: 1.5; }
  .text-sm { font-size: 14px; line-height: 1.5; }
  .text-base { font-size: 16px; line-height: 1.5; }
  .text-lg { font-size: 18px; line-height: 1.5; }
  .text-xl { font-size: 20px; line-height: 1.4; }
  .text-2xl { font-size: 24px; line-height: 1.3; }
  .text-3xl { font-size: 30px; line-height: 1.2; }

  .font-mono { font-family: 'SF Mono', 'Menlo', monospace; }

  .kpi-card{
display:flex;
flex-direction:column;
justify-content:center;
gap:6px;
}

.kpi-header{
display:flex;
align-items:center;
gap:8px;
font-size:13px;
font-weight:600;
color:#64748b;
}

.kpi-icon{
font-size:18px;
}

.kpi-value{
font-size:32px;
font-weight:800;
color:#0f172a;
line-height:1.2;
}

.kpi-sub{
font-size:12px;
color:#94a3b8;
}

.kpi-card{
transition:all .25s ease;
}

.kpi-card:hover{
transform:translateY(-4px);
box-shadow:0 12px 30px rgba(0,0,0,0.12);
}
`;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const C = {
  navy: "#0f172a",
  navy2: "#1e293b", 
  blue: "#3b82f6",
  sky: "#60a5fa",
  ice: "#eff6ff",
  mint: "#10b981",
  gold: "#f59e0b",
  danger: "#ef4444",
  success: "#22c55e",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray800: "#1e293b",
  white: "#ffffff",
};

const PALETTE = [
  "#3b82f6", "#60a5fa", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

const DEFAULT_WEIGHTS = { coupling:1, cohesion:1, modularity:1, extensibility:1, complexity:1 };
const METRIC_KEYS    = ["coupling","cohesion","modularity","extensibility","complexity"];
const METRIC_LABELS  = ["Coupling","Cohesion","Modularity","Extensibility","Complexity"];
const blankScores    = () => Object.fromEntries(METRIC_KEYS.map(k => [k,""]));
const blankPattern   = (id) => ({ id, name:"", file:null, image:null, scores: blankScores() });

// ─── ICONS ───────────────────────────────────────────────────────────────────
const SVG = ({ d, size=18, color="currentColor", fill="none", viewBox="0 0 24 24", sw=2 }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill}
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const Ico = {
  dash:     <SVG d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  search:   <SVG d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  doc:      <SVG d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  chat:     <SVG d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  upload:   <SVG d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
  chevron:  <SVG d="M9 5l7 7-7 7" />,
  check:    <SVG d="M5 13l4 4L19 7" />,
  trend:    <SVG d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  dl:       <SVG d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  star:     <SVG d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  x:        <SVG d="M6 18L18 6M6 6l12 12" />,
  plus:     <SVG d="M12 5v14M5 12h14" />,
  trash:    <SVG d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  info:     <SVG d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  settings: <SVG d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  logo:     <SVG d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  eye:      <SVG d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
  chart:    <SVG d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
};



// ─── HELPERS ───────────────────────────────────────────────────────────────

// Convert file to base64 for image preview / storage
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File reading failed"));

    reader.readAsDataURL(file);
  });


// Compute weighted maintainability score
const computeWeightedAvg = (scores, weights) => {

  const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  if (!weightSum) return 0;

  const weightedScore = METRIC_KEYS.reduce((sum, key) => {
    const score = Number(scores[key]) || 0;
    const weight = Number(weights[key]) || 0;
    return sum + score * weight;
  }, 0);

  return weightedScore / weightSum;
};


// Improvement badge (visual indicator)
const ImproveBadge = ({ value }) => {

  const positive = value > 0;
  const neutral = value === 0;

  return (
    <span
      className={`badge ${
        neutral
          ? "badge-neutral"
          : positive
          ? "badge-success"
          : "badge-danger"
      }`}
    >
      {neutral ? "—" : positive ? "↑" : "↓"}{" "}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};



// ─── SIDEBAR ────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, collapsed, setCollapsed }) => {

  const items = [
    { id:"landing", label:"Dashboard", icon:Ico.dash },
    { id:"analysis", label:"New Analysis", icon:Ico.search }
  ];

  const active = (id) => page === id || (page === "result" && id === "analysis");

  return (

<motion.aside

initial={false}

animate={{
  width: collapsed ? 72 : 260
}}

transition={{
  duration:0.35,
  ease:"easeInOut"
}}

style={{
  minHeight:"100vh",
  background:`linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 100%)`,
  position:"fixed",
  top:0,
  left:0,
  zIndex:200,
  display:"flex",
  flexDirection:"column",
  boxShadow:"4px 0 30px rgba(0,0,0,0.12)"
}}

>

{/* ───── LOGO AREA ───── */}

<motion.div

onClick={()=>setCollapsed(!collapsed)}

whileHover={{ background:"rgba(255,255,255,0.03)" }}

style={{
padding: collapsed ? "20px 14px" : "26px 24px",
borderBottom:"1px solid rgba(255,255,255,0.06)",
display:"flex",
alignItems:"center",
gap:12,
cursor:"pointer"
}}

>

<motion.div

whileHover={{ rotate:10, scale:1.05 }}

transition={{ duration:0.2 }}

style={{
width:40,
height:40,
borderRadius:12,
background:"linear-gradient(135deg,#60a5fa,#3b82f6)",
display:"flex",
alignItems:"center",
justifyContent:"center",
flexShrink:0,
boxShadow:"0 6px 16px rgba(59,130,246,0.35)"
}}

>

<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>

</motion.div>

<AnimatePresence>

{!collapsed && (

<motion.div

initial={{ opacity:0, x:-10 }}
animate={{ opacity:1, x:0 }}
exit={{ opacity:0, x:-10 }}
transition={{ duration:0.25 }}

>

<div style={{
fontSize:16,
fontWeight:700,
color:"white",
lineHeight:1.3
}}>
UML Portal
</div>

<div style={{
fontSize:11,
color:"rgba(255,255,255,0.4)",
fontWeight:500
}}>
ANALYSIS SUITE
</div>

</motion.div>

)}

</AnimatePresence>

</motion.div>


{/* ───── NAVIGATION ───── */}

<nav style={{
flex:1,
padding:"20px 10px",
display:"flex",
flexDirection:"column",
gap:6
}}>

{items.map(({id,label,icon})=>{

const isActive = active(id);

return(

<motion.button

key={id}

onClick={()=>setPage(id)}

whileHover={{ x:4 }}

whileTap={{ scale:0.96 }}

style={{
display:"flex",
alignItems:"center",
gap:12,
justifyContent: collapsed ? "center" : "flex-start",
padding: collapsed ? "12px" : "12px 16px",
borderRadius:10,
border:"none",
background:isActive ? "rgba(255,255,255,0.08)" : "transparent",
color:"white",
cursor:"pointer",
position:"relative",
fontSize:14,
fontWeight:500
}}

>

{/* Active indicator */}

{isActive && (

<motion.div

layoutId="activeIndicator"

style={{
position:"absolute",
left:0,
top:6,
bottom:6,
width:3,
borderRadius:2,
background:"#3b82f6"
}}

/>

)}

<span style={{
opacity:isActive ? 1 : 0.7,
display:"flex"
}}>

{icon}

</span>

{!collapsed && label}

</motion.button>

)

})}

</nav>


{/* ───── FOOTER ───── */}

<AnimatePresence>

{!collapsed && (

<motion.div

initial={{ opacity:0 }}
animate={{ opacity:1 }}
exit={{ opacity:0 }}

style={{
padding:"20px 24px",
borderTop:"1px solid rgba(255,255,255,0.06)",
fontSize:11,
color:"rgba(255,255,255,0.35)",
fontWeight:500,
letterSpacing:"0.4px"
}}

>

ACADEMIC RESEARCH v2.0

</motion.div>

)}

</AnimatePresence>

</motion.aside>

  );

};



// ─── TOPBAR ────────────────────────────────────────────────────────────────
const Topbar = ({ title, sub, left }) => {

return (

<motion.header

initial={{ y:-40, opacity:0 }}

animate={{ y:0, opacity:1 }}

transition={{ duration:0.45, ease:"easeOut" }}

style={{
position:"fixed",
top:0,
left:left,
right:0,
height:72,
background:"rgba(255,255,255,0.85)",
backdropFilter:"blur(14px)",
borderBottom:`1px solid ${C.gray200}`,
display:"flex",
alignItems:"center",
justifyContent:"space-between",
padding:"0 34px",
zIndex:190,
transition:"left 0.35s ease"
}}

>

{/* ───── TITLE SECTION ───── */}

<div>

<motion.h1

initial={{ opacity:0, y:6 }}
animate={{ opacity:1, y:0 }}
transition={{ delay:0.15, duration:0.35 }}

style={{
fontSize:20,
fontWeight:700,
color:C.navy,
margin:0,
lineHeight:1.25,
letterSpacing:"-0.01em"
}}

>

{title}

</motion.h1>

{sub && (

<motion.p

initial={{ opacity:0 }}
animate={{ opacity:1 }}
transition={{ delay:0.25 }}

style={{
fontSize:13,
color:C.gray400,
marginTop:4,
fontWeight:400
}}

>

{sub}

</motion.p>

)}

</div>


{/* ───── RIGHT SIDE ───── */}

<div style={{
display:"flex",
alignItems:"center",
gap:22
}}>


{/* SYSTEM STATUS */}

<motion.div

initial={{ opacity:0 }}
animate={{ opacity:1 }}
transition={{ delay:0.3 }}

style={{
display:"flex",
alignItems:"center",
gap:8
}}

>

<motion.div

animate={{
scale:[1,1.2,1]
}}

transition={{
repeat:Infinity,
duration:2,
ease:"easeInOut"
}}

style={{
width:8,
height:8,
borderRadius:"50%",
background:C.success,
boxShadow:`0 0 0 4px ${C.success}20`
}}

></motion.div>

<span style={{
fontSize:13,
color:C.gray600,
fontWeight:500
}}>

System Active

</span>

</motion.div>


{/* USER AVATAR */}

<motion.div

whileHover={{ scale:1.08 }}

whileTap={{ scale:0.95 }}

transition={{ duration:0.2 }}

style={{
width:40,
height:40,
borderRadius:12,
background:`linear-gradient(135deg, ${C.blue}, ${C.sky})`,
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"white",
fontSize:16,
fontWeight:700,
boxShadow:"0 6px 16px rgba(59,130,246,0.35)",
cursor:"pointer"
}}

>

R

</motion.div>

</div>

</motion.header>

);

};

// ─── CARD ────────────────────────────────────────────────────────────────────

const Card = ({
  children,
  style = {},
  className = "",
  delay = 0
}) => (

<motion.div

  className={`card ${className}`}

  initial={{ opacity:0, y:20 }}

  animate={{ opacity:1, y:0 }}

  transition={{
    duration:0.45,
    ease:"easeOut",
    delay
  }}

  whileHover={{
    y:-6,
    scale:1.01
  }}

  style={{
    borderRadius:16,
    background:"white",
    boxShadow:"0 8px 28px rgba(0,0,0,0.06)",
    padding:24,
    position:"relative",
    ...style
  }}

>

{children}

</motion.div>

);

// ─── SECTION TITLE ───────────────────────────────────────────────────────────

const ST = ({ label, sub, badge }) => (

<motion.div

initial={{ opacity:0, y:12 }}

animate={{ opacity:1, y:0 }}

transition={{ duration:0.35, ease:"easeOut" }}

style={{
marginBottom:24,
position:"relative"
}}

>

{/* Title Row */}

<div style={{
display:"flex",
alignItems:"center",
gap:12,
flexWrap:"wrap"
}}>

<motion.h2

initial={{ opacity:0 }}

animate={{ opacity:1 }}

transition={{ delay:0.05 }}

style={{
fontSize:18,
fontWeight:700,
color:C.navy,
margin:0,
letterSpacing:"-0.02em"
}}

>

{label}

</motion.h2>


{/* Optional Badge */}

{badge && (

<motion.span

initial={{ scale:0.8, opacity:0 }}

animate={{ scale:1, opacity:1 }}

transition={{ delay:0.1 }}

className="badge badge-info"

style={{
fontSize:11,
padding:"4px 10px"
}}

>

{badge}

</motion.span>

)}

</div>


{/* Subtitle */}

{sub && (

<motion.p

initial={{ opacity:0 }}

animate={{ opacity:1 }}

transition={{ delay:0.15 }}

style={{
fontSize:14,
color:C.gray400,
marginTop:6,
lineHeight:1.5,
maxWidth:640
}}

>

{sub}

</motion.p>

)}


</motion.div>

);



// ─── METRIC INPUT ────────────────────────────────────────────────────────────

const MetricInput = ({ label, value, onChange, error }) => {

return (

<motion.div

initial={{ opacity:0, y:10 }}

animate={{ opacity:1, y:0 }}

transition={{ duration:0.3 }}

style={{ marginBottom:18 }}

>

<label style={{
display:"block",
fontSize:12,
fontWeight:600,
color:C.gray400,
marginBottom:6,
letterSpacing:"-0.01em"
}}>

{label}

</label>


<motion.input

className="metric-input"

type="number"

min={0}

max={10}

step={0.1}

value={value}

placeholder="0.0 – 10.0"

onChange={(e)=>onChange(e.target.value)}

whileFocus={{ scale:1.02 }}

transition={{ duration:0.15 }}

style={{
borderColor: error ? C.danger : undefined
}}

>


</motion.input>


{error && (

<motion.span

initial={{ opacity:0, y:-4 }}

animate={{ opacity:1, y:0 }}

style={{
fontSize:11,
color:C.danger,
marginTop:4,
display:"block",
fontWeight:500
}}

>

{error}

</motion.span>

)}

</motion.div>

);

};

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────

const UploadZone = ({ file, onFile, accentColor=C.blue, compact=false }) => {

const [drag,setDrag] = useState(false);
const [preview,setPreview] = useState(null);
const ref = useRef();

useEffect(()=>{

if(!file || !file.type?.includes("image")){
setPreview(null);
return;
}

const url = URL.createObjectURL(file);

setPreview(url);

return ()=>URL.revokeObjectURL(url);

},[file]);


const drop = useCallback((e)=>{

e.preventDefault();

setDrag(false);

const f = e.dataTransfer.files[0];

if(f) onFile(f);

},[onFile]);


return(

<motion.div

className={`upload-zone ${drag?"dragging":""} ${file?"has-file":""}`}

whileHover={{ scale:1.01 }}

animate={{
borderColor: file ? accentColor : drag ? accentColor : C.gray200
}}

transition={{ duration:0.2 }}

style={{
minHeight: compact ? 150 : 180,
cursor:"pointer",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:10
}}

onClick={()=>ref.current.click()}

onDrop={drop}

onDragOver={(e)=>{e.preventDefault();setDrag(true)}}

onDragLeave={()=>setDrag(false)}

>

<input

ref={ref}

type="file"

accept="image/*,.pdf"

style={{display:"none"}}

onChange={(e)=>onFile(e.target.files[0]||null)}

/>


{/* FILE SELECTED */}

{file ? (

<motion.div

initial={{ opacity:0, scale:0.9 }}

animate={{ opacity:1, scale:1 }}

transition={{ duration:0.25 }}

style={{
display:"flex",
flexDirection:"column",
alignItems:"center",
gap:8,
width:"100%"
}}

>

{preview ? (

<img

src={preview}

alt="preview"

style={{
maxWidth:"100%",
maxHeight:80,
borderRadius:8,
objectFit:"cover",
border:`1px solid ${C.gray200}`
}}

/>

) : (

<div style={{ fontSize:32 }}>📄</div>

)}


<div style={{
fontSize:13,
fontWeight:600,
color:C.gray800,
maxWidth:"100%",
overflow:"hidden",
textOverflow:"ellipsis",
whiteSpace:"nowrap"
}}>

{file.name}

</div>


<div style={{
fontSize:11,
color:C.gray400
}}>

{(file.size/1024).toFixed(1)} KB

</div>


<motion.button

className="btn-danger"

whileHover={{ scale:1.05 }}

whileTap={{ scale:0.95 }}

onClick={(e)=>{
e.stopPropagation();
onFile(null);
}}

style={{ marginTop:6 }}

>

{Ico.trash} Remove

</motion.button>

</motion.div>

) : (

<motion.div

initial={{ opacity:0 }}

animate={{ opacity:1 }}

transition={{ duration:0.3 }}

style={{
display:"flex",
flexDirection:"column",
alignItems:"center",
gap:8
}}

>

<motion.div

animate={{
y:[0,-4,0]
}}

transition={{
repeat:Infinity,
duration:2
}}

style={{
color:accentColor,
opacity:0.6
}}

>

<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>

</svg>

</motion.div>


<div style={{
fontSize:14,
fontWeight:600,
color:C.gray600
}}>

Drop or click to browse

</div>


<div style={{
fontSize:11,
color:C.gray400
}}>

PNG, JPG, PDF up to 10MB

</div>

</motion.div>

)}

</motion.div>

);

};

// ─── WEIGHT SLIDER ───────────────────────────────────────────────────────────

const WeightSlider = ({ label, value, onChange }) => {

const percent = ((value - 0.1) / 1.9) * 100;

return (

<motion.div

initial={{ opacity:0, y:10 }}

animate={{ opacity:1, y:0 }}

transition={{ duration:0.3 }}

style={{ marginBottom:16 }}

>

{/* Label Row */}

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:6
}}>

<label style={{
fontSize:12,
fontWeight:600,
color:C.gray400,
letterSpacing:"-0.01em"
}}>

{label}

</label>


<motion.span

key={value}

initial={{ scale:0.85, opacity:0 }}

animate={{ scale:1, opacity:1 }}

transition={{ duration:0.2 }}

style={{
fontSize:13,
fontWeight:700,
color:C.blue,
background:C.ice,
padding:"3px 10px",
borderRadius:12
}}

>

{value.toFixed(1)}×

</motion.span>

</div>


{/* Slider */}

<input

type="range"

min={0.1}

max={2.0}

step={0.1}

value={value}

onChange={(e)=>onChange(+e.target.value)}

className="weight-slider"

style={{
background: `linear-gradient(
  90deg,
  ${C.blue} 0%,
  ${C.blue} ${percent}%,
  ${C.gray200} ${percent}%,
  ${C.gray200} 100%
)`
}}

/>

</motion.div>

);

};


// ─── PATTERN CARD (for New Analysis) ─────────────────────────────────────────

const PatternCard = ({ pattern, index, onUpdate, onRemove, weights, errors = {} }) => {

  const accent = PALETTE[(index + 1) % PALETTE.length];
  const [expand, setExpand] = useState(true);

  const scores = pattern.scores || {};
  const allScoresEntered = METRIC_KEYS.every(k => scores[k] !== "" && scores[k] !== undefined);

  return (

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
     style={{
  borderRadius: 16,
  border: `1px solid ${expand ? accent + "30" : C.gray200}`,
  overflow: "hidden",
  background: "white",
  boxShadow: expand ? `0 10px 24px ${accent}12` : "var(--shadow-xs)",
  width: "100%"
}}
    >

      {/* HEADER */}

      <motion.div
        onClick={() => setExpand(!expand)}
        whileHover={{ backgroundColor: `${accent}08` }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 22px",
          cursor: "pointer",
          borderBottom: expand ? `1px solid ${accent}20` : "none"
        }}
      >

        {/* PATTERN INDEX */}

        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
            border: `1px solid ${accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: accent
          }}
        >
          P{index + 1}
        </div>

        {/* INFO */}

        <div style={{ flex: 1 }}>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.navy
            }}
          >
            {pattern.name || `Pattern Design ${index + 1}`}
          </div>

          <div
            style={{
              fontSize: 12,
              color: C.gray400
            }}
          >
            {pattern.file ? `✓ ${pattern.file.name}` : "No file uploaded"} ·{" "}
            {METRIC_KEYS.some(k => scores[k] !== "" && scores[k] !== undefined)
              ? "Metrics entered"
              : "No metrics yet"}
          </div>

        </div>

        {/* REMOVE BUTTON */}

        <motion.button
          className="btn-danger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          {Ico.trash}
        </motion.button>

        {/* CHEVRON */}

        <motion.div
          animate={{ rotate: expand ? 90 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: C.gray400 }}
        >
          {Ico.chevron}
        </motion.div>

      </motion.div>


      {/* CONTENT */}

      <AnimatePresence>

        {expand && (

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "24px 24px 26px"
            }}
          >

            {/* MAIN GRID */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 32,
                marginBottom: 22
              }}
            >

              {/* LEFT SIDE */}

              <div>

                {/* PATTERN NAME */}

                <div style={{ marginBottom: 18 }}>

                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.gray400,
                      marginBottom: 6,
                      display: "block"
                    }}
                  >
                    Pattern Name
                  </label>

                  <input
                    className="metric-input"
                    type="text"
                    value={pattern.name || ""}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    placeholder="e.g. Singleton, Observer…"
                    style={{ borderColor: accent + "60" }}
                  />

                </div>

                {/* UML DIAGRAM */}

                <div>

                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.gray400,
                      marginBottom: 6,
                      display: "block"
                    }}
                  >
                    UML Diagram
                  </label>

                  <UploadZone
                    file={pattern.file}
                    onFile={(f) => onUpdate({ file: f })}
                    accentColor={accent}
                    compact
                  />

                  {errors[`file_${pattern.id}`] && (
                    <p
                      style={{
                        color: C.danger,
                        fontSize: 11,
                        marginTop: 4
                      }}
                    >
                      {errors[`file_${pattern.id}`]}
                    </p>
                  )}

                </div>

              </div>


              {/* RIGHT SIDE */}

              <div>

                <div
                  style={{
                    background: `${accent}12`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 14,
                    fontSize: 12,
                    fontWeight: 700,
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${accent}30`
                  }}
                >

                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: accent
                    }}
                  />

                  Maintainability Scores

                </div>

                {METRIC_KEYS.map((k, i) => (

                  <MetricInput
                    key={k}
                    label={METRIC_LABELS[i]}
                    value={scores[k] ?? ""}
                    onChange={(v) =>
                      onUpdate({
                        scores: {
                          ...scores,
                          [k]: v
                        }
                      })
                    }
                    error={errors[`score_${pattern.id}_${k}`]}
                  />

                ))}

              </div>

            </div>


            {/* WEIGHTED SCORE */}

            {allScoresEntered && (

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: `${accent}08`,
                  border: `1px solid ${accent}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  maxWidth: 420
                }}
              >

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.gray600
                  }}
                >
                  Weighted Score:
                </span>

                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: accent
                  }}
                >
                  {computeWeightedAvg(scores, weights).toFixed(2)}
                </span>

                <span
                  style={{
                    fontSize: 12,
                    color: C.gray400
                  }}
                >
                  / 10.0
                </span>

              </motion.div>

            )}

          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>

  );
};


// ─── GENERATE CONCLUSION ─────────────────────────────────────────────────────

const genConclusion = (baseline, patterns = [], weights) => {

  if (!patterns.length) {
    return "No pattern-based designs were provided for comparison.";
  }

  // Baseline score
  const baselineAvg = computeWeightedAvg(baseline, weights);

  // Determine best pattern
  let bestPattern = null;
  let bestScore = -Infinity;

  patterns.forEach((p) => {
    const score = computeWeightedAvg(p.scores || {}, weights);
    if (score > bestScore) {
      bestScore = score;
      bestPattern = p;
    }
  });

  // Improvement calculation
  const improvement = ((bestScore - baselineAvg) / (baselineAvg || 1)) * 100;

  // Pattern names list
  const patternNames = patterns
    .map((p) => p.name || "Pattern Design")
    .join(", ");

  // Positive improvement conclusion
  if (improvement > 0) {

    return `Among the ${patterns.length} pattern-based design(s) evaluated (${patternNames}), the "${bestPattern?.name || "best-performing pattern"}" design achieved the highest maintainability score of ${bestScore.toFixed(2)}, representing a ${improvement.toFixed(1)}% improvement over the patternless baseline (${baselineAvg.toFixed(2)}).

This result suggests that incorporating appropriate design patterns improves structural quality by reducing coupling, increasing cohesion, and enabling better modularity and extensibility within the system architecture.`;

  }

  // No improvement conclusion
  return `The evaluation of ${patterns.length} pattern-based design(s) (${patternNames}) shows limited improvement compared with the patternless baseline.

The best-performing design "${bestPattern?.name || "Pattern"}" achieved a maintainability score of ${bestScore.toFixed(2)}, while the baseline scored ${baselineAvg.toFixed(2)}.

These findings indicate that the selected design patterns may not have been applied optimally, and further architectural refinement may be necessary to achieve improved maintainability outcomes.`;

};


// ─── FLOATING BACKGROUND ─────────────────

const FloatingBackground = () => {

return (

<div className="bg-blobs">

<div className="blob blob1"></div>
<div className="blob blob2"></div>
<div className="blob blob3"></div>

</div>

);

};


// ─── DASHBOARD PAGE ─────────────────────────────────────────

const LandingPage = ({ setPage }) => {

  const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

const cardAnimation = {
  hidden: { opacity:0, y:50 },
  show: {
    opacity:1,
    y:0,
    transition:{
      duration:0.7,
      ease:[0.25,0.1,0.25,1]
    }
  }
};

return (

<div className="animate-slide-up">


{/* ───────── HERO SECTION ───────── */}

<div
style={{
borderRadius:20,
padding:"48px 48px",
marginBottom:32,
background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
position:"relative",
overflow:"hidden",
display:"flex",
alignItems:"center",
justifyContent:"space-between",
gap:40
}}
>

<FloatingBackground />


{/* HERO TEXT */}

<div style={{ maxWidth:620 }}>

<div
style={{
fontSize:12,
color:"rgba(255,255,255,0.5)",
marginBottom:14,
fontWeight:600,
letterSpacing:"0.3px"
}}
>
ACADEMIC RESEARCH PLATFORM
</div>

<h1
style={{
fontSize:44,
fontWeight:800,
color:"white",
lineHeight:1.2,
marginBottom:16
}}
>
UML Maintainability
<br/>

<span
style={{
background:"linear-gradient(135deg,#60a5fa,#22c55e)",
WebkitBackgroundClip:"text",
WebkitTextFillColor:"transparent"
}}
>
Analysis Portal
</span>

</h1>

<p
style={{
color:"rgba(255,255,255,0.7)",
fontSize:16,
lineHeight:1.6,
marginBottom:28
}}
>
Compare UML Architectures With Maintainability Metrics
And Identify The Best Design Patterns Using Academic
Analysis Techniques.
</p>

<button
className="btn-primary"
onClick={()=>setPage("analysis")}
style={{ padding:"12px 24px" }}
>
🔍 Start New Analysis
</button>

</div>


{/* HERO IMAGE */}

<div
style={{
width:420,
height:260,
borderRadius:14,
overflow:"hidden",
flexShrink:0
}}
>

<img
src="src/assets/hero/HERO_IMAGE_SRC.jpg"
alt="UML analysis illustration"
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>

</div>



{/* ───────── HOW IT WORKS ───────── */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{ once:false, amount:0.2 }}
variants={container}
style={{ marginBottom:48 }}
>

<h2 className="section-title">
How the Analysis Works
</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:20,
alignItems:"stretch"
}}
>

{/* CARD 1 */}

<motion.div
variants={cardAnimation}
style={{ display:"flex" }}
>

<Card style={{ display:"flex", flexDirection:"column", width:"100%" }}>

<div className="card-img">
<img src="src/assets/steps/UPLOAD_IMAGE_SRC.jpeg" alt="Upload UML"/>
</div>

<h3 style={{ fontSize:16, fontWeight:700 }}>
1️⃣ Upload UML Designs
</h3>

<p style={{ color:C.gray400, marginTop:8 }}>
Upload Baseline UML Diagrams And Pattern-Based Designs
For Maintainability Comparison.
</p>

</Card>

</motion.div>


{/* CARD 2 */}

<motion.div
variants={cardAnimation}
style={{ display:"flex" }}
>

<Card style={{ display:"flex", flexDirection:"column", width:"100%" }}>

<div className="card-img">
<img src="src/assets/steps/METRICS_IMAGE_SRC.jpg" alt="Enter metrics"/>
</div>

<h3 style={{ fontSize:16, fontWeight:700 }}>
2️⃣ Enter Maintainability Metrics
</h3>

<p style={{ color:C.gray400, marginTop:8 }}>
Provide Scores For Coupling, Cohesion, Modularity,
Extensibility And Complexity.
</p>

</Card>

</motion.div>


{/* CARD 3 */}

<motion.div
variants={cardAnimation}
style={{ display:"flex" }}
>

<Card style={{ display:"flex", flexDirection:"column", width:"100%" }}>

<div className="card-img">
<img src="src/assets/steps/ANALYSIS_IMAGE_SRC.jpeg" alt="Generate analysis"/>
</div>

<h3 style={{ fontSize:16, fontWeight:700 }}>
3️⃣ Generate Analysis
</h3>

<p style={{ color:C.gray400, marginTop:8 }}>
The System Calculates Weighted Maintainability Scores
And Visualizes The Best Architecture.
</p>

</Card>

</motion.div>

</div>

</motion.div>



{/* ───────── DESIGN PATTERNS ───────── */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{ once: false, amount: 0.2 }}
variants={{ show:{ transition:{ staggerChildren:0.15 }}}}
style={{ marginBottom:60, textAlign:"center" }}
>

<h3 style={{ color:"#3b82f6", fontWeight:600, marginBottom:6 }}>
SOFTWARE DESIGN PATTERNS
</h3>

<h2 className="section-title">
Common Design Patterns
</h2>

<p style={{
maxWidth:720,
margin:"0 auto 40px",
color:C.gray400,
lineHeight:1.6
}}>
Design Patterns Improve Software Architecture By Providing Reusable
Solutions To Common Design Problems. In This Portal, We Compare
Pattern-Based UML Designs With Patternless Architecture To Evaluate
Their Impact On Maintainability Metrics.
</p>


{/* FIRST ROW */}

<div style={{
display:"flex",
justifyContent:"center",
gap:30,
marginBottom:40,
flexWrap:"wrap"
}}>

{[
{ name:"Singleton", img:"src/assets/patterns/singleton.png",
desc:"Ensures A Class Has Only One Instance And Provides Global Access." },

{ name:"Factory", img:"src/assets/patterns/factory.png",
desc:"Creates Objects Without Exposing The Creation Logic." },

{ name:"Observer", img:"src/assets/patterns/observer.webp",
desc:"Allows Objects To Automatically Notify Dependent Components." }

].map((p,i)=>(

<motion.div
key={i}
variants={{
hidden:{ opacity:0, y:40 },
show:{
opacity:1,
y:0,
transition:{
duration:0.9,
ease:"easeOut"
}
}
}}
whileHover={{ y:-8, scale:1.03 }}
>

<Card style={{ width:300 }}>

<div className="card-img">
<img src={p.img} alt={p.name}/>
</div>

<h3 style={{ fontSize:18, marginBottom:6 }}>
{p.name}
</h3>

<p style={{ fontSize:14, color:C.gray400 }}>
{p.desc}
</p>

</Card>

</motion.div>

))}

</div>


{/* SECOND ROW */}

<div style={{
display:"flex",
justifyContent:"center",
gap:30
}}>

{[
{ name:"Strategy", img:"src/assets/patterns/strategy.webp",
desc:"Encapsulates Interchangeable Algorithms Within Classes." },

{ name:"Adapter", img:"src/assets/patterns/adapter.png",
desc:"Allows Incompatible Interfaces To Work Together." }

].map((p,i)=>(

<motion.div
key={i}
variants={{
hidden:{ opacity:0, y:40 },
show:{
opacity:1,
y:0,
transition:{
duration:1.3,
ease:"easeOut"
}
}
}}
whileHover={{ y:-8, scale:1.03 }}
>

<Card style={{ width:300 }}>

<div className="card-img">
<img src={p.img} alt={p.name}/>
</div>

<h3 style={{ fontSize:18, marginBottom:6 }}>
{p.name}
</h3>

<p style={{ fontSize:14, color:C.gray400 }}>
{p.desc}
</p>

</Card>

</motion.div>

))}

</div>

</motion.div>



{/* ───────── MAINTAINABILITY METRICS ───────── */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{ once: false, amount: 0.2 }}
variants={{ show:{ transition:{ staggerChildren:0.15 }}}}
style={{ marginBottom:60, textAlign:"center" }}
>

<h3 style={{ color:"#3b82f6", fontWeight:600, marginBottom:6 }}>
SOFTWARE QUALITY FACTORS
</h3>

<h2 style={{
fontSize:30,
fontWeight:700,
marginBottom:12
}}>
Maintainability Metrics
</h2>

<p style={{
maxWidth:720,
margin:"0 auto 40px",
color:C.gray400,
lineHeight:1.6
}}>
These Metrics Are Used To Evaluate The Maintainability Of Software
Architecture. The Portal Compares Pattern-Based UML Designs And
Patternless Architectures Using These Quality Factors.
</p>


{/* FIRST ROW */}

<div style={{
display:"flex",
justifyContent:"center",
gap:30,
marginBottom:50,
flexWrap:"wrap"
}}>

{[
{ name:"Coupling", img:"src/assets/metrics/coupling.jpg", desc:"Measures Dependency Between Modules." },

{ name:"Cohesion", img:"src/assets/metrics/cohesion.jpg", desc:"Measures How Strongly Elements Of A Module Belong Together." },

{ name:"Modularity", img:"src/assets/metrics/modularity.webp", desc:"Measures How Well The System Is Divided Into Independent Modules." }

].map((m,i)=>(

<motion.div
key={i}
variants={{
hidden:{ opacity:0, y:40 },
show:{
opacity:1,
y:0,
transition:{
duration:0.9,
ease:"easeOut"
}
}
}}
whileHover={{ y:-8, scale:1.03 }}
>

<Card style={{ width:300 }}>

<div className="card-img">
<img src={m.img} alt={m.name}/>
</div>

<h3 style={{ fontSize:18, marginBottom:6 }}>
{m.name}
</h3>

<p style={{ fontSize:14, color:C.gray400 }}>
{m.desc}
</p>

</Card>

</motion.div>

))}

</div>


{/* SECOND ROW */}

<div style={{
display:"flex",
justifyContent:"center",
gap:30
}}>

{[
{ name:"Extensibility", img:"src/assets/metrics/extensibility.jpg", desc:"Measures How Easily New Features Can Be Added." },

{ name:"Complexity", img:"src/assets/metrics/complexity.jpg", desc:"Measures The Structural Complexity Of The System." }

].map((m,i)=>(

<motion.div
key={i}
variants={{
hidden:{ opacity:0, y:40 },
show:{
opacity:1,
y:0,
transition:{
duration:1.3,
ease:"easeOut"
}
}
}}
whileHover={{ y:-8, scale:1.03 }}
>

<Card style={{ width:300 }}>

<div className="card-img">
<img src={m.img} alt={m.name}/>
</div>

<h3 style={{ fontSize:18, marginBottom:6 }}>
{m.name}
</h3>

<p style={{ fontSize:14, color:C.gray400 }}>
{m.desc}
</p>

</Card>

</motion.div>

))}

</div>

</motion.div>



{/* ───────── RESEARCH SECTION ───────── */}

<Card style={{ marginBottom:48 }}>

<div
style={{
display:"flex",
alignItems:"center",
gap:30
}}
>

<div
style={{
width:260,
height:180,
borderRadius:16,
overflow:"hidden",
flexShrink:0
}}
>

<img
src="src/assets/research/research.jpg"
alt="Research illustration"
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>


<div>

<h2
style={{
fontSize:22,
fontWeight:700,
marginBottom:14
}}
>
Why Maintainability Matters
</h2>

<p
style={{
lineHeight:1.7,
color:C.gray400
}}
>
Software maintainability determines how easily systems
can evolve, adapt, and remain reliable over time.
Applying design patterns improves modularity,
reduces coupling, and increases extensibility.
This platform helps researchers compare different
architectural designs and select the most
maintainable solution.
</p>

</div>

</div>

</Card>



{/* ───────── CTA SECTION ───────── */}

<div
style={{
textAlign:"center",
padding:"70px 30px",
borderRadius:24,
background:"linear-gradient(135deg,#0f172a,#1e3a8a)",
maxWidth:950,
margin:"0 auto",
color:"#fff"
}}
>

<h2
style={{
fontSize:32,
fontWeight:800,
marginBottom:14
}}
>
Ready To Analyze Your UML Designs?
</h2>

<p
style={{
marginBottom:30,
fontSize:17,
color:"rgba(255,255,255,0.75)",
lineHeight:1.6
}}
>
Start Your Maintainability Evaluation Now.
</p>

<button
className="btn-primary btn-cta"
onClick={()=>setPage("analysis")}
>
🚀 Start Analysis
</button>

</div>


</div>

);

};



// ─── NEW ANALYSIS PAGE ────────────────────────────────────────────────────────

const NewAnalysisPage = ({ onGenerate }) => {


const [baselineFile,setBaselineFile] = useState(null);
const [baselineScores,setBaselineScores] = useState(blankScores());
const [patterns,setPatterns] = useState([blankPattern(Date.now())]);
const [weights,setWeights] = useState(DEFAULT_WEIGHTS);
const [showWeights,setShowWeights] = useState(false);
const [errors,setErrors] = useState({});
const [loading,setLoading] = useState(false);

const counter = useRef(1);


const handleUpload = async (file) => {

  try{

    const formData = new FormData();
    formData.append("umlImage", file);

    const response = await fetch(
      "http://localhost:5001/api/analyze-uml",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    console.log("AI Metrics:", data);

    // 🔥 auto fill baseline metrics
    setBaselineScores({
      coupling: data.coupling,
      cohesion: data.cohesion,
      modularity: data.modularity,
      extensibility: data.extensibility,
      complexity: data.complexity
    });

  }catch(err){

    console.error("AI analysis failed", err);

  }

};

const analyzePattern = async (file, patternId) => {

  try {

    const formData = new FormData();
    formData.append("umlImage", file);

    const response = await fetch(
      "http://localhost:5001/api/analyze-uml",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    console.log("Pattern AI Metrics:", data);

    // update that specific pattern
    setPatterns(prev =>
      prev.map(p =>
        p.id === patternId
          ? {
              ...p,
              scores: {
                coupling: data.coupling,
                cohesion: data.cohesion,
                modularity: data.modularity,
                extensibility: data.extensibility,
                complexity: data.complexity
              }
            }
          : p
      )
    );

  } catch (err) {
    console.error("Pattern AI failed", err);
  }

};


// ─── PATTERN MANAGEMENT ─────────────────────────────────────

const addPattern = () => {
counter.current++;
setPatterns(prev=>[
...prev,
blankPattern(Date.now()+counter.current)
]);
};

const removePattern = (id)=>{
setPatterns(prev=>prev.filter(p=>p.id!==id));
};

const updatePattern = (id,patch)=>{
setPatterns(prev =>
prev.map(p => p.id===id ? {...p,...patch} : p)
);
};


// ─── VALIDATION ─────────────────────────────────────────────

const validate = ()=>{

const errs = {};

if(!baselineFile)
errs.baselineFile = "Required";

METRIC_KEYS.forEach(k=>{
if(baselineScores[k]==="" || isNaN(+baselineScores[k]))
errs[`bl_${k}`] = "Required";
else if(+baselineScores[k]<0 || +baselineScores[k]>10)
errs[`bl_${k}`] = "0–10";
});

patterns.forEach(p=>{

if(!p.file)
errs[`file_${p.id}`] = "UML required";

METRIC_KEYS.forEach(k=>{
if(p.scores[k]==="" || isNaN(+p.scores[k]))
errs[`score_${p.id}_${k}`] = "Required";
else if(+p.scores[k]<0 || +p.scores[k]>10)
errs[`score_${p.id}_${k}`] = "0–10";
});

});

setErrors(errs);

return Object.keys(errs).length===0;

};


// ─── GENERATE ANALYSIS ─────────────────────────────────────

const handleGenerate = async ()=>{

if(!validate()) return;

setLoading(true);

try{

const baseImg =
baselineFile
? await fileToBase64(baselineFile)
: null;

const enrichedPatterns =
await Promise.all(
patterns.map(async p=>({
...p,
image: p.file ? await fileToBase64(p.file) : null
}))
);

setTimeout(()=>{

setLoading(false);

onGenerate({
baselineScores,
baselineFile,
baselineImage: baseImg,
patterns: enrichedPatterns,
weights
});

},900);

}catch(e){

setLoading(false);

}

};


// ─── BASELINE SCORE ─────────────────────────────────────────

const baselineAvg =
METRIC_KEYS.every(k=>baselineScores[k]!=="")
? computeWeightedAvg(baselineScores,weights)
: null;


// ─── PAGE ───────────────────────────────────────────────────

return (

<motion.div
initial={{ opacity:0, y:20 }}
animate={{ opacity:1, y:0 }}
transition={{ duration:0.4 }}
style={{
maxWidth:1100,
margin:"0 auto",
width:"100%"
}}
>

{/* ───── BASELINE SECTION ───── */}

<Card style={{ marginBottom:24 }}>

<ST
label="Baseline: Patternless UML"
sub="Upload The Reference Design & Enter Maintainability Metrics"
/>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:32
}}>

{/* LEFT */}

<div>

<div style={{
background:C.gray100,
borderRadius:10,
padding:"10px 16px",
marginBottom:16,
fontSize:13,
fontWeight:700,
color:C.gray800
}}>
Patternless UML Diagram
</div>

<UploadZone
file={baselineFile}
onFile={(file)=>{
   setBaselineFile(file);
   handleUpload(file); // 🔥 send to backend AI
}}
accentColor={C.gray600}
/>

{errors.baselineFile && (
<p style={{color:C.danger,fontSize:11,marginTop:8}}>
{errors.baselineFile}
</p>
)}


{/* BASELINE SCORE */}

{baselineAvg!==null && (

<motion.div
initial={{ opacity:0, y:8 }}
animate={{ opacity:1, y:0 }}
transition={{ duration:0.3 }}
style={{
marginTop:20,
padding:"16px 20px",
borderRadius:12,
background:C.gray50,
border:`1px solid ${C.gray200}`,
display:"flex",
alignItems:"center",
gap:20
}}
>

<div>

<div style={{
fontSize:12,
color:C.gray400
}}>
Baseline Score
</div>

<div style={{
fontSize:32,
fontWeight:800,
color:C.navy
}}>
{baselineAvg.toFixed(2)}
</div>

</div>

<div style={{
width:1,
height:40,
background:C.gray200
}}/>

<div style={{
fontSize:13,
color:C.gray400
}}>
out of 10.0
</div>

</motion.div>

)}

</div>


{/* RIGHT */}

<div>

<div style={{
background:C.gray100,
borderRadius:10,
padding:"10px 16px",
marginBottom:16,
fontSize:13,
fontWeight:700
}}>
Baseline Maintainability Scores
</div>

{METRIC_KEYS.map((k,i)=>(
<MetricInput
key={k}
label={METRIC_LABELS[i]}
value={baselineScores[k]}
onChange={v=>
setBaselineScores(prev=>({...prev,[k]:v}))
}
error={errors[`bl_${k}`]}
/>
))}

</div>

</div>

</Card>


{/* ───── PATTERN DESIGNS ───── */}

<Card style={{ marginBottom:24 }}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"flex-start",
marginBottom:20,
flexWrap:"wrap",
gap:12
}}>

<ST
label="Pattern-Based Designs"
sub="Add One Or More Pattern-Based Designs To Compare"
badge={`${patterns.length} design${patterns.length!==1?"s":""}`}
/>

<motion.button
className="btn-secondary"
whileHover={{ scale:1.04 }}
whileTap={{ scale:0.95 }}
onClick={()=>setShowWeights(!showWeights)}
style={{ padding:"8px 16px" }}
>
{Ico.settings}
{showWeights ? "Hide Weights" : "Configure Weights"}
</motion.button>

</div>


{/* WEIGHT SLIDERS */}

<AnimatePresence>

{showWeights && (

<motion.div
initial={{ opacity:0, height:0 }}
animate={{ opacity:1, height:"auto" }}
exit={{ opacity:0, height:0 }}
transition={{ duration:0.3 }}
style={{
background:C.gray50,
borderRadius:12,
padding:24,
marginBottom:24,
border:`1px solid ${C.gray200}`
}}
>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:"16px 32px"
}}>

{METRIC_KEYS.map((k,i)=>(
<WeightSlider
key={k}
label={METRIC_LABELS[i]}
value={weights[k]}
onChange={v=>
setWeights(prev=>({...prev,[k]:v}))
}
/>
))}

</div>

</motion.div>

)}

</AnimatePresence>


{/* PATTERN CARDS */}

<div style={{
display:"flex",
flexDirection:"column",
gap:20,
marginBottom:24
}}>

{patterns.map((p,i)=>(
<PatternCard
key={p.id}
pattern={p}
index={i}
weights={weights}
errors={errors}
onUpdate={(patch)=>{

  updatePattern(p.id, patch);

  if(patch.file){
     analyzePattern(patch.file, p.id); // 🔥 AI call
  }

}}
onRemove={()=>removePattern(p.id)}
/>
))}

</div>


{/* ADD PATTERN BUTTON */}

<motion.button

whileHover={{ scale:1.02 }}
whileTap={{ scale:0.96 }}

onClick={addPattern}

style={{
width:"100%",
padding:"16px",
borderRadius:12,
border:`2px dashed ${C.blue}40`,
background:`${C.blue}04`,
color:C.blue,
fontSize:14,
fontWeight:700,
cursor:"pointer",
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:8
}}

>

{Ico.plus}
Add Pattern Design

</motion.button>

</Card>


{/* ───── GENERATE ANALYSIS ───── */}

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>

<ST
label="Generate Comparison"
sub="Run the weighted maintainability analysis across all designs"
/>

<div style={{ display:"flex", gap:16, alignItems:"center" }}>

<motion.button
className="btn-primary"
whileHover={{ scale:1.04 }}
whileTap={{ scale:0.95 }}
onClick={handleGenerate}
disabled={loading}
style={{
padding:"14px 32px",
fontSize:15,
minWidth:200,
opacity:loading?0.7:1
}}
>

{loading ? "Generating..." : <>{Ico.trend} Generate Analysis</>}

</motion.button>

<div style={{ fontSize:14, color:C.gray400 }}>
Comparing baseline vs {patterns.length} pattern design{patterns.length!==1?"s":""}
</div>

</div>

</Card>

</motion.div>


);


};




// ─────────────────────────────────────────────────────────────
// RESULT PAGE
// ─────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

const hoverLift = {
  whileHover: { y: -6, scale: 1.03 },
  transition: { duration: 0.2 }
};


// ─── ANIMATED NUMBER ─────────────────────────

const AnimatedNumber = ({ value, duration = 1.2, decimals = 2 }) => {

  const motionValue = useMotionValue(0);

  const rounded = useTransform(
    motionValue,
    latest => latest.toFixed(decimals)
  );

  useEffect(() => {

    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut"
    });

    return controls.stop;

  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};


// ─────────────────────────────────────────────
// RESULT PAGE COMPONENT
// ─────────────────────────────────────────────

const ResultPage = ({ data, onClear }) => {

  const { baselineScores, patterns = [], weights } = data;

  const baseAvg = computeWeightedAvg(baselineScores, weights);

  const patternAvgs = patterns.map(p =>
    computeWeightedAvg(p.scores || {}, weights)
  );

  const bestIdx =
    patternAvgs.length > 0
      ? patternAvgs.indexOf(Math.max(...patternAvgs))
      : 0;

  const bestAvg = patternAvgs[bestIdx] || 0;

  const improvement =
    ((bestAvg - baseAvg) / (baseAvg || 1)) * 100;

  const conclusion = genConclusion(
    baselineScores,
    patterns,
    weights
  );

  // ─── BAR CHART DATA ─────────────────────────

  const barData = METRIC_LABELS.map((label,i)=>{

    const key = METRIC_KEYS[i];

    const row = {
      metric: label,
      Baseline: baselineScores[key]
    };

    patterns.forEach((p,index)=>{
      row[p.name || `Pattern ${index+1}`] =
        p.scores?.[key] || 0;
    });

    return row;
  });


  // ─── PATTERN RANKING ───────────────────────

  const ranking = patterns
    .map((p,i)=>({
      name: p.name || `Pattern ${i+1}`,
      score: patternAvgs[i],
      improvement: ((patternAvgs[i] - baseAvg)/(baseAvg||1))*100
    }))
    .sort((a,b)=>b.score - a.score);


  // ─── RISK LEVEL ───────────────────────────

  const getRiskLevel = (score)=>{

    if(score < 4) return "High Risk";
    if(score < 6) return "Moderate";
    if(score < 8) return "Good";
    return "Excellent";

  };


  return (

<motion.div
variants={containerVariants}
initial="hidden"
animate="show"
style={{ maxWidth:1400, margin:"0 auto" }}
>


{/* ───────── HEADER ───────── */}

<motion.div variants={cardVariants}>

<Card style={{ marginBottom:24 }}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}>

<div>

<h2 style={{
fontSize:26,
fontWeight:800
}}>
Analysis Results
</h2>

<p style={{
fontSize:14,
color:"#64748b"
}}>
{patterns.length} pattern design comparison
</p>

</div>

<div style={{ display:"flex", gap:10 }}>

<motion.button
className="btn-primary"
whileHover={{ scale:1.05 }}
whileTap={{ scale:0.95 }}
onClick={()=>window.print()}
>
Export PDF
</motion.button>

<motion.button
className="btn-secondary"
whileHover={{ scale:1.05 }}
whileTap={{ scale:0.95 }}
onClick={onClear}
>
New Analysis
</motion.button>

</div>

</div>


{/* ───────── KPI GRID ───────── */}

<motion.div className="kpi-grid" variants={containerVariants}>

<motion.div className="card kpi-card" variants={cardVariants} {...hoverLift}>

<div className="kpi-header">📊 Baseline Score</div>

<div className="kpi-value">
<AnimatedNumber value={baseAvg}/>
</div>

</motion.div>


<motion.div className="card kpi-card" variants={cardVariants} {...hoverLift}>

<div className="kpi-header">🏆 Best Pattern</div>

<div className="kpi-value">
{bestAvg.toFixed(2)}
</div>

</motion.div>


<motion.div className="card kpi-card" variants={cardVariants} {...hoverLift}>

<div className="kpi-header">📈 Improvement</div>

<div className="kpi-value">

{improvement >=0 ? "+" : ""}

<AnimatedNumber value={improvement} decimals={1}/> %

</div>

</motion.div>


<motion.div className="card kpi-card" variants={cardVariants} {...hoverLift}>

<div className="kpi-header">🧩 Patterns Tested</div>

<div className="kpi-value">
{patterns.length}
</div>

</motion.div>

</motion.div>

</Card>

</motion.div>



{/* ───────── CHARTS ───────── */}

<motion.div
variants={containerVariants}
style={{
display:"grid",
gridTemplateColumns:"1.3fr 1fr",
gap:24,
marginBottom:24
}}
>

<motion.div variants={cardVariants}>

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>

<ST label="Metric Comparison"
sub="Maintainability metrics across designs"/>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={barData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="metric"/>

<YAxis domain={[0,10]}/>

<Tooltip/>

<Legend/>

<Bar dataKey="Baseline" fill="#94a3b8" radius={[4,4,0,0]}/>

</BarChart>

</ResponsiveContainer>

</Card>

</motion.div>



<motion.div variants={cardVariants}>

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>

<ST label="Radar Profile"
sub="Maintainability shape overlay"/>

<ResponsiveContainer width="100%" height={300}>

<RadarChart
data={METRIC_LABELS.map((l,i)=>({
subject:l,
Baseline:baselineScores[METRIC_KEYS[i]]
}))}
>

<PolarGrid/>
<PolarAngleAxis dataKey="subject"/>
<PolarRadiusAxis domain={[0,10]}/>

<Radar
name="Baseline"
dataKey="Baseline"
stroke="#3b82f6"
fill="#3b82f6"
fillOpacity={0.2}
/>

</RadarChart>

</ResponsiveContainer>

</Card>

</motion.div>

</motion.div>



{/* ───────── PATTERN RANKING ───────── */}

<motion.div variants={cardVariants} style={{ marginBottom: 28 }}>

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>

<ST label="Pattern Performance Ranking"
sub="Comparison of pattern maintainability scores"/>

<table style={{ width:"100%", borderCollapse:"collapse" }}>

<thead>
<tr style={{
background:"linear-gradient(90deg,#e0f2fe,#f1f5f9)"
}}>
<th style={{ padding:10 }}>Rank</th>
<th>Pattern</th>
<th>Score</th>
<th>Improvement</th>
</tr>
</thead>

<tbody>

{ranking.map((p,i)=>(

<tr key={i} style={{ borderBottom:"1px solid #e2e8f0" }}>

<td style={{
padding:10,
fontWeight:700,
color:
i===0 ? "#16a34a" :
i===1 ? "#2563eb" :
"#64748b"
}}>
#{i+1}
</td>
<td>{p.name}</td>
<td>{p.score.toFixed(2)}</td>
<td>{p.improvement.toFixed(1)}%</td>

</tr>

))}

</tbody>

</table>

</Card>

</motion.div>



{/* ───────── RISK ASSESSMENT ───────── */}

<motion.div variants={cardVariants} style={{ marginBottom: 28 }}>

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>
  
<ST label="Architecture Risk Assessment"
sub="Maintainability risk classification"/>

<div style={{
display:"flex",
gap:30,
marginTop:10
}}>

<div style={{
background:"#ecfdf5",
padding:16,
borderRadius:10,
border:"1px solid #bbf7d0"
}}>
<h4>Baseline Architecture</h4>
<p style={{fontWeight:700,color:"#15803d"}}>
{getRiskLevel(baseAvg)}
</p>
</div>


<div style={{
background:"#eff6ff",
padding:16,
borderRadius:10,
border:"1px solid #bfdbfe"
}}>
<h4>Best Pattern Architecture</h4>
<p style={{fontWeight:700,color:"#1d4ed8"}}>
{getRiskLevel(bestAvg)}
</p>
</div>
/</div>

</Card>

</motion.div>



{/* ───────── CONCLUSION ───────── */}

<motion.div variants={cardVariants} style={{ marginBottom: 28 }}>

<Card style={{
marginBottom:28,
background:"linear-gradient(180deg,#ffffff,#f8fafc)"
}}>

<ST
label="Academic Conclusion"
sub="Auto generated research interpretation"
/>

<div style={{
padding:24,
background:"linear-gradient(135deg,#eff6ff,#e0f2fe)",
border:"1px solid #bfdbfe",
borderRadius:10
}}>

<p style={{
fontSize:15,
lineHeight:1.8
}}>
{conclusion}
</p>

</div>

</Card>

</motion.div>

</motion.div>

  );

};



// ─── PDF PREVIEW PAGE ─────────────────────────────────────────────────────────
const PDFPreviewPage = ({ data }) => {
  if (!data) return (
    <div className="animate-fade">
      <Card style={{ textAlign:"center", padding:"80px" }}>
        <div style={{ fontSize:48, marginBottom:16, color:C.gray400 }}>📋</div>
        <h3 style={{ fontSize:18, color:C.navy, marginBottom:8 }}>No Report Available</h3>
        <p style={{ color:C.gray400 }}>Run an analysis first to generate a PDF report.</p>
      </Card>
    </div>
  );

  const { baselineScores, patterns, weights } = data;
  const baseAvg = computeWeightedAvg(baselineScores, weights);
  const patternAvgs = patterns.map(p=>computeWeightedAvg(p.scores, weights));
  const bestIdx = patternAvgs.indexOf(Math.max(...patternAvgs));
  const bestAvg = patternAvgs[bestIdx];
  const improvement = ((bestAvg-baseAvg)/(baseAvg||1))*100;
  const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const conclusion = genConclusion(baselineScores, patterns, weights);

  const barData = METRIC_LABELS.map((label,i)=>{
    const key=METRIC_KEYS[i];
    const row={metric:label,Baseline:+baselineScores[key]||0};
    patterns.forEach(p=>{row[p.name||`P${patterns.indexOf(p)+1}`]=+p.scores[key]||0;});
    return row;
  });

  return (
    <div className="animate-slide-up">
      <Card style={{ marginBottom:24 }} className="no-print">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <ST label="PDF Report Preview" sub="Academic-formatted maintainability report"/>
          <button className="btn-primary" onClick={()=>window.print()} style={{ padding:"10px 20px" }}>
            {Ico.dl} Print / Save PDF
          </button>
        </div>
      </Card>

      {/* Report Preview */}
      <div style={{ 
        background:C.white, 
        borderRadius:20, 
        overflow:"hidden", 
        boxShadow:"var(--shadow-xl)", 
        border:`1px solid ${C.gray200}`,
      }}>
        {/* Header */}
        <div style={{ 
          background:`linear-gradient(135deg, ${C.navy}, ${C.navy2} 80%)`,
          padding:"48px 56px", 
          color:"white", 
          position:"relative", 
          overflow:"hidden" 
        }}>
          <div style={{ 
            position:"absolute", 
            width:400, 
            height:400, 
            borderRadius:"50%", 
            background:"rgba(96,165,250,0.1)", 
            top:-100, 
            right:-100, 
            filter:"blur(60px)" 
          }}/>
          <div style={{ 
            fontSize:11, 
            letterSpacing:"0.5px", 
            textTransform:"uppercase", 
            color:"rgba(255,255,255,0.5)", 
            marginBottom:16,
            fontWeight:600
          }}>
            Academic Research Report
          </div>
          <h1 style={{ 
            fontSize:32, 
            fontWeight:800, 
            margin:"0 0 12px",
            letterSpacing:"-0.02em",
            lineHeight:1.2
          }}>
            UML Maintainability Analysis
          </h1>
          <div style={{ 
            fontSize:14, 
            color:"rgba(255,255,255,0.7)",
            fontWeight:400
          }}>
            {today} · Baseline vs {patterns.length} Pattern Design{patterns.length!==1?"s":""}
          </div>
        </div>

        <div style={{ padding:"44px 56px" }}>
          {/* Executive Summary */}
          <div style={{ marginBottom:48 }}>
            <h2 style={{ 
              fontSize:20, 
              fontWeight:800, 
              color:C.navy, 
              margin:"0 0 20px",
              letterSpacing:"-0.02em",
              paddingBottom:10,
              borderBottom:`2px solid ${C.ice}`
            }}>
              1. Executive Summary
            </h2>
            <div style={{ 
              display:"grid", 
              gridTemplateColumns:`repeat(${patterns.length+2},1fr)`, 
              gap:16 
            }}>
              <div style={{ 
                background:C.gray50, 
                borderRadius:12, 
                padding:"20px", 
                borderLeft:`4px solid ${C.gray400}` 
              }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.navy, lineHeight:1.2 }}>
                  {baseAvg.toFixed(2)}
                </div>
                <div style={{ fontSize:12, color:C.gray400, marginTop:4 }}>
                  Patternless Baseline
                </div>
              </div>
              {patterns.map((p,i)=>(
                <div key={p.id} style={{ 
                  background:C.ice, 
                  borderRadius:12, 
                  padding:"20px", 
                  borderLeft:`4px solid ${PALETTE[(i+1)%PALETTE.length]}` 
                }}>
                  <div style={{ fontSize:28, fontWeight:800, color:PALETTE[(i+1)%PALETTE.length], lineHeight:1.2 }}>
                    {patternAvgs[i].toFixed(2)}
                  </div>
                  <div style={{ fontSize:12, color:C.gray400, marginTop:4 }}>
                    {p.name||`Pattern ${i+1}`}
                  </div>
                </div>
              ))}
              <div style={{ 
                background: improvement>=0 ? "#f0fdf4" : "#fef2f2", 
                borderRadius:12, 
                padding:"20px", 
                borderLeft:`4px solid ${improvement>=0 ? C.success : C.danger}` 
              }}>
                <div style={{ 
                  fontSize:28, 
                  fontWeight:800, 
                  color:improvement>=0 ? C.success : C.danger,
                  lineHeight:1.2
                }}>
                  {improvement>=0 ? "+" : ""}{improvement.toFixed(1)}%
                </div>
                <div style={{ fontSize:12, color:C.gray400, marginTop4 }}>
                  Best Improvement
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div style={{ marginBottom:48 }}>
            <h2 style={{ 
              fontSize:20, 
              fontWeight:800, 
              color:C.navy, 
              margin:"0 0 20px",
              letterSpacing:"-0.02em",
              paddingBottom:10,
              borderBottom:`2px solid ${C.ice}`
            }}>
              2. Metrics Comparison
            </h2>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr style={{ background:C.navy, color:"white" }}>
                  <th style={{ padding:"14px 16px", textAlign:"left", fontWeight:600 }}>Metric</th>
                  <th style={{ padding:"14px 16px", textAlign:"left", fontWeight:600 }}>Baseline</th>
                  {patterns.map((p,i)=>(
                    <th key={p.id} style={{ padding:"14px 16px", textAlign:"left", fontWeight:600, color:PALETTE[(i+1)%PALETTE.length] }}>
                      {p.name||`P${i+1}`}
                    </th>
                  ))}
                  <th style={{ padding:"14px 16px", textAlign:"left", fontWeight:600 }}>Best Δ</th>
                </tr>
              </thead>
              <tbody>
                {METRIC_LABELS.map((label,mi)=>{
                  const key=METRIC_KEYS[mi];
                  const bVal=+baselineScores[key]||0;
                  const pVals=patterns.map(p=>+p.scores[key]||0);
                  const bestPVal=Math.max(...pVals);
                  const pct=((bestPVal-bVal)/(bVal||1))*100;
                  return (
                    <tr key={label} style={{ 
                      background:mi%2===0 ? "white" : C.gray50,
                      borderBottom:`1px solid ${C.gray200}`
                    }}>
                      <td style={{ padding:"14px 16px", fontWeight:600, color:C.navy }}>{label}</td>
                      <td style={{ padding:"14px 16px", color:C.gray600 }}>{bVal.toFixed(1)}</td>
                      {pVals.map((v,i)=>(
                        <td key={i} style={{ padding:"14px 16px", color:PALETTE[(i+1)%PALETTE.length], fontWeight:600 }}>
                          {v.toFixed(1)}
                        </td>
                      ))}
                      <td style={{ padding:"14px 16px" }}>
                        <ImproveBadge value={pct}/>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Visual Analysis */}
          <div style={{ marginBottom:48 }}>
            <h2 style={{ 
              fontSize:20, 
              fontWeight:800, 
              color:C.navy, 
              margin:"0 0 20px",
              letterSpacing:"-0.02em",
              paddingBottom:10,
              borderBottom:`2px solid ${C.ice}`
            }}>
              3. Visual Analysis
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{top:5,right:10,bottom:5,left:-15}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/>
                <XAxis dataKey="metric" tick={{fontSize:12,fill:C.gray600}}/>
                <YAxis domain={[0,10]} tick={{fontSize:12,fill:C.gray600}}/>
                <Tooltip 
                  contentStyle={{
                    fontFamily:"'Inter',sans-serif",
                    fontSize:12,
                    borderRadius:10,
                    border:`1px solid ${C.gray200}`,
                    boxShadow:"var(--shadow-md)"
                  }}
                />
                <Legend wrapperStyle={{fontFamily:"'Inter',sans-serif",fontSize:12}}/>
                <Bar dataKey="Baseline" fill={C.gray400} radius={[4,4,0,0]} barSize={24}/>
                {patterns.map((p,i)=>(
                  <Bar 
                    key={p.id} 
                    dataKey={p.name||`P${i+1}`} 
                    fill={PALETTE[(i+1)%PALETTE.length]} 
                    radius={[4,4,0,0]} 
                    barSize={24}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conclusion */}
          <div>
            <h2 style={{ 
              fontSize:20, 
              fontWeight:800, 
              color:C.navy, 
              margin:"0 0 20px",
              letterSpacing:"-0.02em",
              paddingBottom:10,
              borderBottom:`2px solid ${C.ice}`
            }}>
              4. Academic Conclusion
            </h2>
            <div style={{ 
              background:`${C.blue}06`, 
              borderRadius:12, 
              padding:"24px 28px", 
              borderLeft:`4px solid ${C.blue}` 
            }}>
              <p style={{ 
                fontSize:15, 
                lineHeight:1.8, 
                color:C.gray800, 
                margin:0,
                fontWeight:400
              }}>
                {conclusion}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop:48, 
            paddingTop:20, 
            borderTop:`1px solid ${C.gray200}`, 
            display:"flex", 
            justifyContent:"space-between", 
            fontSize:12, 
            color:C.gray400 
          }}>
            <span>UML Maintainability Analysis Portal — Academic Research Tool v2.0</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("landing");
  const [collapsed, setCollapsed] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [projects, setProjects] = useState([
    { title:"E-Commerce System v1", date:"Feb 14, 2026", baselineAvg:5.4, bestAvg:7.8, improvement:44.4, patternNames:["Factory","Observer"] },
    { title:"Library Management",   date:"Jan 28, 2026", baselineAvg:6.1, bestAvg:8.2, improvement:34.4, patternNames:["Singleton"] },
  ]);

  const sw = collapsed ? 72 : 260;

  const titles = {
    landing:    { title:"Dashboard",        sub:"UML Maintainability Analysis Portal" },
    analysis:   { title:"New Analysis",     sub:"Upload designs and enter metrics" },
    result:     { title:"Analysis Results", sub:"Detailed maintainability comparison" },
    reports:    { title:"Reports Archive",  sub:"Previous project reports" },
    pdfpreview: { title:"PDF Report",       sub:"Academic formatted report preview" },
    feedback:   { title:"Feedback",         sub:"Share your experience" },
  };

  const handleGenerate = (data) => {
    setAnalysisData(data);
    const baseAvg = computeWeightedAvg(data.baselineScores, data.weights);
    const patternAvgs = data.patterns.map(p => computeWeightedAvg(p.scores, data.weights));
    const bestAvg = Math.max(...patternAvgs);
    const improvement = ((bestAvg-baseAvg)/(baseAvg||1))*100;
    setProjects(prev => [{
      title: `Analysis ${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}`,
      date: new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
      baselineAvg: baseAvg,
      bestAvg,
      improvement,
      patternNames: data.patterns.map(p=>p.name||"Pattern"),
    }, ...prev]);
    setPage("result");
  };

  const handleSetPage = (p) => {
    if (p==="analysis") setAnalysisData(null);
    setPage(p);
  };

  const info = titles[page] || titles.landing;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}/>
      <Sidebar page={page} setPage={handleSetPage} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <Topbar title={info.title} sub={info.sub} left={sw}/>
      <main style={{
        marginLeft: sw,
        paddingTop: 96,
        paddingBottom: 48,
        paddingLeft: 32,
        paddingRight: 32,
        transition:"margin-left 0.3s cubic-bezier(0.2, 0, 0, 1)",
        minHeight:"100vh",
      }}>
        {page==="landing"    && <LandingPage    setPage={handleSetPage} projects={projects}/>}
        {page==="analysis"   && <NewAnalysisPage onGenerate={handleGenerate}/>}
        {page==="result"     && <ResultPage      data={analysisData} onClear={()=>{setAnalysisData(null);setPage("landing");}}/>}
        {page==="reports"    && <ReportsPage     projects={projects} setPage={setPage}/>}
        {page==="pdfpreview" && <PDFPreviewPage  data={analysisData}/>}
        {page==="feedback"   && <FeedbackPage/>}
      </main>
    </>
  );
}

// Note: ReportsPage and FeedbackPage components remain the same with updated styling
// They follow the same design system but are omitted for brevity