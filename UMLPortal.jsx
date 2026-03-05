import { useState, useCallback, useRef, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

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

  .input-field {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--gray200);
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--gray800);
    background: var(--white);
    outline: none;
    transition: all 0.2s;
    box-shadow: var(--shadow-xs);
  }
  .input-field:hover {
    border-color: var(--gray400);
  }
  .input-field:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 4px rgba(59,130,246,0.15);
  }

  .card {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid var(--gray200);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
  }

  .card:hover {
    box-shadow: var(--shadow-md);
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
    transition: all 0.25s ease;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .upload-zone:hover {
    border-color: var(--blue);
    background: var(--ice);
  }
  .upload-zone.dragging {
    border-color: var(--blue);
    background: var(--ice);
    transform: scale(1.02);
  }
  .upload-zone.has-file {
    border-style: solid;
    border-color: var(--blue);
    background: var(--ice);
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fileToBase64 = (file) => new Promise((res,rej) => {
  const r = new FileReader();
  r.readAsDataURL(file);
  r.onload = () => res(r.result);
  r.onerror = rej;
});

const computeWeightedAvg = (scores, weights) => {
  const wSum = Object.values(weights).reduce((a,b)=>a+b,0);
  const wScore = METRIC_KEYS.reduce((s,k) => s + (+scores[k]||0)*weights[k], 0);
  return wScore / wSum;
};

const ImproveBadge = ({ value }) => (
  <span className={`badge ${value > 0 ? 'badge-success' : 'badge-danger'}`}>
    {value > 0 ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
  </span>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, collapsed, setCollapsed }) => {
  const items = [
    { id:"landing", label:"Dashboard", icon: Ico.dash },
    { id:"analysis", label:"New Analysis", icon: Ico.search },
  ];

  const active = (id) => page === id || (page === "result" && id === "analysis");

  return (
    <aside style={{
      width: collapsed ? 72 : 260,
      minHeight:"100vh",
      background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 100%)`,
      position:"fixed", 
      top:0, 
      left:0, 
      zIndex:200,
      display:"flex", 
      flexDirection:"column",
      transition:"width 0.3s cubic-bezier(0.2, 0, 0, 1)",
      boxShadow:"4px 0 20px rgba(0,0,0,0.08)",
    }}>
      {/* Logo area */}
      <div onClick={()=>setCollapsed(!collapsed)} style={{
        padding: collapsed ? "20px 14px" : "28px 24px",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        display:"flex", 
        alignItems:"center", 
        gap:12,
        cursor:"pointer",
      }}>
        <div style={{
          width: 40, 
          height: 40, 
          borderRadius: 12,
          background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
          display:"flex", 
          alignItems:"center", 
          justifyContent:"center",
          flexShrink:0,
          boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        {!collapsed && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ fontSize:16, fontWeight:700, color:"white", lineHeight:1.3 }}>UML Portal</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>ANALYSIS SUITE</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"20px 12px" }}>
        {items.map(({id,label,icon}) => (
          <button 
            key={id} 
            className={`nav-item ${active(id) ? 'active' : ''}`} 
            onClick={() => setPage(id)}
            style={{ 
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "12px" : "12px 16px"
            }}
          >
            <span style={{ opacity: active(id) ? 1 : 0.7 }}>{icon}</span>
            {!collapsed && <span style={{ fontSize:14 }}>{label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div style={{ 
          padding:"20px 24px", 
          borderTop:"1px solid rgba(255,255,255,0.06)",
          fontSize:11,
          color:"rgba(255,255,255,0.3)",
          fontWeight:500,
          letterSpacing:"0.3px"
        }}>
          ACADEMIC RESEARCH v2.0
        </div>
      )}
    </aside>
  );
};

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
const Topbar = ({ title, sub, left }) => (
  <header style={{
    position:"fixed", 
    top:0, 
    left:left, 
    right:0, 
    height:72,
    background:"rgba(255,255,255,0.9)",
    backdropFilter:"blur(12px)",
    borderBottom:`1px solid ${C.gray200}`,
    display:"flex", 
    alignItems:"center", 
    justifyContent:"space-between",
    padding:"0 32px", 
    zIndex:190,
    transition:"left 0.3s cubic-bezier(0.2, 0, 0, 1)",
  }}>
    <div>
      <h1 style={{ 
        fontSize:20, 
        fontWeight:700, 
        color:C.navy, 
        margin:0,
        lineHeight:1.3,
        letterSpacing:"-0.01em"
      }}>
        {title}
      </h1>
      {sub && (
        <p style={{ 
          fontSize:13, 
          color:C.gray400, 
          marginTop:4,
          fontWeight:400 
        }}>
          {sub}
        </p>
      )}
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ 
          width:8, 
          height:8, 
          borderRadius:"50%", 
          background:C.success,
          boxShadow:`0 0 0 2px ${C.success}20`
        }} />
        <span style={{ fontSize:13, color:C.gray600, fontWeight:500 }}>System Active</span>
      </div>
      <div style={{
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
        boxShadow:"0 4px 12px rgba(59,130,246,0.3)",
        cursor:"pointer",
      }}>
        R
      </div>
    </div>
  </header>
);

// ─── CARD ────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, className="" }) => (
  <div className={`card ${className}`} style={style}>
    {children}
  </div>
);

// ─── SECTION TITLE ───────────────────────────────────────────────────────────
const ST = ({ label, sub, badge }) => (
  <div style={{ marginBottom:24 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
      <h2 style={{ 
        fontSize:18, 
        fontWeight:700, 
        color:C.navy, 
        margin:0,
        letterSpacing:"-0.02em"
      }}>
        {label}
      </h2>
      {badge && (
        <span className="badge badge-info" style={{ fontSize:12 }}>
          {badge}
        </span>
      )}
    </div>
    {sub && (
      <p style={{ 
        fontSize:14, 
        color:C.gray400, 
        marginTop:6,
        lineHeight:1.5
      }}>
        {sub}
      </p>
    )}
  </div>
);

// ─── METRIC INPUT ────────────────────────────────────────────────────────────
const MetricInput = ({ label, value, onChange, error }) => (
  <div style={{ marginBottom:16 }}>
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
    <input 
      className="input-field" 
      type="number" 
      min={0} 
      max={10} 
      step={0.1}
      value={value} 
      onChange={e=>onChange(e.target.value)} 
      placeholder="0.0 – 10.0"
      style={{ 
        borderColor: error ? C.danger : undefined
      }}
    />
    {error && (
      <span style={{ fontSize:11, color:C.danger, marginTop:4, display:"block" }}>
        {error}
      </span>
    )}
  </div>
);

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────
const UploadZone = ({ file, onFile, accentColor=C.blue, compact=false }) => {
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const ref = useRef();

  useEffect(()=>{
    if (!file || !file.type?.includes("image")) { setPreview(null); return; }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return ()=>URL.revokeObjectURL(u);
  }, [file]);

  const drop = useCallback(e=>{
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0]; if(f) onFile(f);
  }, [onFile]);

  return (
    <div 
      className={`upload-zone ${drag?"dragging":""} ${file?"has-file":""}`}
      style={{ 
        borderColor: file ? accentColor : drag ? accentColor : undefined,
        minHeight: compact ? 120 : 140
      }}
      onClick={()=>ref.current.click()}
      onDrop={drop} 
      onDragOver={e=>{e.preventDefault();setDrag(true);}} 
      onDragLeave={()=>setDrag(false)}
    >
      <input 
        ref={ref} 
        type="file" 
        accept="image/*,.pdf" 
        style={{display:"none"}} 
        onChange={e=>onFile(e.target.files[0]||null)}
      />
      {file ? (
        <>
          {preview ? (
            <img 
              src={preview} 
              alt="" 
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
          <div style={{ fontSize:11, color:C.gray400 }}>
            {(file.size/1024).toFixed(1)} KB
          </div>
          <button 
            className="btn-danger" 
            onClick={e=>{e.stopPropagation();onFile(null);}} 
            style={{ marginTop:8 }}
          >
            {Ico.trash} Remove
          </button>
        </>
      ) : (
        <>
          <div style={{ color:accentColor, opacity:0.6 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:C.gray600 }}>
            Drop or click to browse
          </div>
          <div style={{ fontSize:11, color:C.gray400 }}>
            PNG, JPG, PDF up to 10MB
          </div>
        </>
      )}
    </div>
  );
};

// ─── WEIGHT SLIDER ───────────────────────────────────────────────────────────
const WeightSlider = ({ label, value, onChange }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
      <label style={{ 
        fontSize:12, 
        fontWeight:600, 
        color:C.gray400,
        letterSpacing:"-0.01em"
      }}>
        {label}
      </label>
      <span style={{ 
        fontSize:14, 
        fontWeight:700, 
        color:C.blue,
        background:C.ice,
        padding:"2px 8px",
        borderRadius:12
      }}>
        {value.toFixed(1)}×
      </span>
    </div>
    <input 
      type="range" 
      min={0.1} 
      max={2.0} 
      step={0.1} 
      value={value} 
      onChange={e=>onChange(+e.target.value)}
      style={{ 
        width:"100%", 
        background:`linear-gradient(90deg, ${C.blue} 0%, ${C.blue} ${(value-0.1)/1.9*100}%, ${C.gray200} ${(value-0.1)/1.9*100}%, ${C.gray200} 100%)` 
      }}
    />
  </div>
);

// ─── PATTERN CARD (for New Analysis) ─────────────────────────────────────────
const PatternCard = ({ pattern, index, onUpdate, onRemove, weights, errors={} }) => {
  const accent = PALETTE[(index+1) % PALETTE.length];
  const [expand, setExpand] = useState(true);

  return (
    <div className="animate-scale" style={{
      borderRadius:16,
      border:`1px solid ${expand ? accent+'30' : C.gray200}`,
      overflow:"hidden",
      background:"white",
      boxShadow: expand ? `0 8px 20px ${accent}10` : "var(--shadow-xs)",
      transition:"all 0.3s ease",
    }}>
      {/* Header */}
      <div style={{
        display:"flex", 
        alignItems:"center", 
        gap:16, 
        padding:"16px 20px",
        background: expand ? `linear-gradient(90deg, ${accent}08, transparent)` : "white",
        borderBottom: expand ? `1px solid ${accent}20` : "none",
        cursor:"pointer",
      }} onClick={()=>setExpand(!expand)}>
        <div style={{
          width:36, 
          height:36, 
          borderRadius:10,
          background:`linear-gradient(135deg, ${accent}20, ${accent}08)`,
          border:`1px solid ${accent}40`,
          display:"flex", 
          alignItems:"center", 
          justifyContent:"center",
          fontSize:14, 
          fontWeight:800, 
          color:accent,
        }}>P{index+1}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.navy }}>
            {pattern.name || `Pattern Design ${index+1}`}
          </div>
          <div style={{ fontSize:12, color:C.gray400 }}>
            {pattern.file ? `✓ ${pattern.file.name}` : "No file uploaded"}
            {" · "}
            {METRIC_KEYS.some(k=>pattern.scores[k]!=="") ? "Metrics entered" : "No metrics yet"}
          </div>
        </div>
        <button className="btn-danger" onClick={e=>{e.stopPropagation();onRemove();}}>
          {Ico.trash}
        </button>
        <div style={{ 
          color:C.gray400, 
          transition:"transform 0.2s", 
          transform:expand ? "rotate(90deg)" : "rotate(0deg)"
        }}>
          {Ico.chevron}
        </div>
      </div>

      {expand && (
        <div style={{ padding:"20px 20px 24px" }} className="animate-fade">
          <div style={{ 
            display:"grid", 
            gridTemplateColumns:"1fr 1fr", 
            gap:24, 
            marginBottom:20 
          }}>
            <div>
              <div style={{ marginBottom:16 }}>
                <label style={{ 
                  fontSize:12, 
                  fontWeight:600, 
                  color:C.gray400, 
                  marginBottom:6,
                  display:"block",
                  letterSpacing:"-0.01em"
                }}>
                  Pattern Name
                </label>
                <input 
                  className="input-field" 
                  type="text"
                  value={pattern.name}
                  onChange={e=>onUpdate({name:e.target.value})}
                  placeholder="e.g. Singleton, Observer…"
                  style={{ borderColor: accent+'60' }}
                />
              </div>
              <div>
                <label style={{ 
                  fontSize:12, 
                  fontWeight:600, 
                  color:C.gray400, 
                  marginBottom:6,
                  display:"block",
                  letterSpacing:"-0.01em"
                }}>
                  UML Diagram
                </label>
                <UploadZone 
                  file={pattern.file} 
                  onFile={f=>onUpdate({file:f})} 
                  accentColor={accent} 
                  compact
                />
                {errors[`file_${pattern.id}`] && (
                  <p style={{color:C.danger,fontSize:11,marginTop:4}}>
                    {errors[`file_${pattern.id}`]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div style={{
                background:`${accent}10`,
                borderRadius:10,
                padding:"10px 14px",
                marginBottom:14,
                fontSize:12,
                fontWeight:700,
                color:accent,
                display:"flex",
                alignItems:"center",
                gap:8,
              }}>
                <span style={{ 
                  width:8, 
                  height:8, 
                  borderRadius:2, 
                  background:accent, 
                  display:"inline-block" 
                }}/>
                Maintainability Scores
              </div>
              {METRIC_KEYS.map((k,i) => (
                <MetricInput 
                  key={k} 
                  label={METRIC_LABELS[i]}
                  value={pattern.scores[k]}
                  onChange={v=>onUpdate({scores:{...pattern.scores,[k]:v}})}
                  error={errors[`score_${pattern.id}_${k}`]}
                />
              ))}
            </div>
          </div>

          {METRIC_KEYS.every(k=>pattern.scores[k]!=="") && (
            <div className="animate-fade" style={{
              padding:"14px 18px",
              borderRadius:10,
              background:`${accent}08`,
              border:`1px solid ${accent}30`,
              display:"flex",
              alignItems:"center",
              gap:20,
            }}>
              <span style={{ fontSize:13, fontWeight:600, color:C.gray600 }}>
                Weighted Score:
              </span>
              <span style={{ 
                fontSize:24, 
                fontWeight:800, 
                color:accent,
                letterSpacing:"-0.02em"
              }}>
                {computeWeightedAvg(pattern.scores, weights).toFixed(2)}
              </span>
              <span style={{ fontSize:12, color:C.gray400 }}>/ 10.0</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── GENERATE CONCLUSION ─────────────────────────────────────────────────────
const genConclusion = (baseline, patterns, weights) => {
  const bAvg = computeWeightedAvg(baseline, weights);
  const best = patterns.reduce((b,p) => {
    const s = computeWeightedAvg(p.scores, weights);
    return s > computeWeightedAvg(b.scores, weights) ? p : b;
  }, patterns[0]);
  const bestAvg = computeWeightedAvg(best.scores, weights);
  const imp = ((bestAvg - bAvg)/(bAvg||1))*100;
  const pNames = patterns.map(p=>p.name||"Pattern Design").join(", ");
  return imp>0
    ? `Among the ${patterns.length} pattern-based design(s) evaluated (${pNames}), the "${best.name||"best"}" design achieved the highest maintainability score of ${bestAvg.toFixed(2)}, representing a ${imp.toFixed(1)}% improvement over the patternless baseline (${bAvg.toFixed(2)}). The use of design patterns significantly enhances structural quality by reducing coupling and increasing modularity and extensibility.`
    : `The analysis of ${patterns.length} pattern design(s) against the patternless baseline reveals limited gains. The best-performing design "${best.name||"Pattern"}" scored ${bestAvg.toFixed(2)} vs the baseline ${bAvg.toFixed(2)}. Consider revisiting the pattern selection or application methodology to better align with the system's maintainability requirements.`;
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ setPage, projects }) => (
  <div className="animate-slide-up">
    {/* Hero */}
    <div style={{
      borderRadius:20,
      padding:"48px 48px",
      marginBottom:32,
      background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
      position:"relative",
      overflow:"hidden",
    }}>
      <div style={{
        position:"absolute",
        top:-100,
        right:-100,
        width:400,
        height:400,
        borderRadius:"50%",
        background:"rgba(96,165,250,0.1)",
        filter:"blur(60px)"
      }}/>
      <div style={{
        position:"absolute",
        bottom:-80,
        left:-80,
        width:300,
        height:300,
        borderRadius:"50%",
        background:"rgba(16,185,129,0.1)",
        filter:"blur(60px)"
      }}/>
      <div style={{ position:"relative", maxWidth:600 }}>
        <div style={{ 
          fontSize:12, 
          color:"rgba(255,255,255,0.5)", 
          letterSpacing:"0.3px", 
          textTransform:"uppercase",
          marginBottom:16,
          fontWeight:600
        }}>
          Academic Research Platform
        </div>
        <h1 style={{ 
          fontSize:40, 
          fontWeight:800, 
          color:"white", 
          lineHeight:1.2,
          margin:"0 0 16px",
          letterSpacing:"-0.02em"
        }}>
          UML Maintainability
          <span style={{ 
            display:"block",
            background:"linear-gradient(135deg, #60a5fa, #10b981)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text"
          }}>
            Analysis Portal
          </span>
        </h1>
        <p style={{ 
          color:"rgba(255,255,255,0.7)", 
          fontSize:16, 
          lineHeight:1.6,
          margin:"0 0 32px",
          fontWeight:400
        }}>
          Compare patternless UML designs against multiple pattern-based architectures 
          with weighted maintainability scoring and academic-grade reporting.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <button 
            className="btn-primary" 
            onClick={()=>setPage("analysis")} 
            style={{ padding:"12px 24px", fontSize:15 }}
          >
            {Ico.search} Start New Analysis
          </button>
        </div>
      </div>
    </div>

    {/* Info Cards */}
    <div style={{ 
      display:"grid", 
      gridTemplateColumns:"repeat(auto-fit, minmax(320px,1fr))", 
      gap:24,
      marginBottom:32
    }}>
      <Card className="hover-lift">
        <h3 style={{ fontSize:16, fontWeight:700, color:C.navy, marginBottom:16 }}>
          Common Design Patterns
        </h3>
        <ul style={{ 
          listStyle:"none", 
          padding:0, 
          margin:0,
          display:"grid",
          gap:12
        }}>
          {[
            { name:"Singleton", desc:"Single instance guarantee" },
            { name:"Factory", desc:"Object creation abstraction" },
            { name:"Observer", desc:"State change subscription" },
            { name:"Strategy", desc:"Dynamic algorithm switching" },
            { name:"Adapter", desc:"Interface compatibility" }
          ].map((p,i) => (
            <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ 
                width:20, 
                height:20, 
                borderRadius:6, 
                background:`${PALETTE[i]}20`,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:PALETTE[i],
                fontSize:12,
                fontWeight:700
              }}>
                {i+1}
              </div>
              <div>
                <span style={{ fontWeight:700, color:C.navy }}>{p.name}</span>
                <span style={{ color:C.gray400, marginLeft:8, fontSize:13 }}>{p.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="hover-lift">
        <h3 style={{ fontSize:16, fontWeight:700, color:C.navy, marginBottom:16 }}>
          Maintainability Metrics
        </h3>
        <ul style={{ 
          listStyle:"none", 
          padding:0, 
          margin:0,
          display:"grid",
          gap:12
        }}>
          {[
            { name:"Coupling", desc:"Inter-class dependencies" },
            { name:"Cohesion", desc:"Class responsibility focus" },
            { name:"Modularity", desc:"Independent module separation" },
            { name:"Extensibility", desc:"Feature addition ease" },
            { name:"Complexity", desc:"System understanding difficulty" }
          ].map((m,i) => (
            <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ 
                width:20, 
                height:20, 
                borderRadius:6, 
                background:`${C.blue}20`,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:C.blue,
                fontSize:12,
                fontWeight:700
              }}>
                {i+1}
              </div>
              <div>
                <span style={{ fontWeight:700, color:C.navy }}>{m.name}</span>
                <span style={{ color:C.gray400, marginLeft:8, fontSize:13 }}>{m.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);

// ─── NEW ANALYSIS PAGE ────────────────────────────────────────────────────────
const NewAnalysisPage = ({ onGenerate }) => {
  const [baselineFile, setBaselineFile]   = useState(null);
  const [baselineScores, setBaselineScores] = useState(blankScores());
  const [patterns, setPatterns]           = useState([blankPattern(Date.now())]);
  const [weights, setWeights]             = useState(DEFAULT_WEIGHTS);
  const [showWeights, setShowWeights]     = useState(false);
  const [errors, setErrors]               = useState({});
  const [loading, setLoading]             = useState(false);
  const counter                           = useRef(1);

  const addPattern = () => {
    counter.current++;
    setPatterns(prev => [...prev, blankPattern(Date.now()+counter.current)]);
  };
  const removePattern = (id) => setPatterns(prev => prev.filter(p=>p.id!==id));
  const updatePattern = (id, patch) => setPatterns(prev => prev.map(p => p.id===id ? {...p,...patch} : p));

  const validate = () => {
    const errs = {};
    if (!baselineFile) errs.baselineFile = "Required";
    METRIC_KEYS.forEach(k=>{
      if (baselineScores[k]==="" || isNaN(+baselineScores[k])) errs[`bl_${k}`] = "Required";
      else if (+baselineScores[k]<0||+baselineScores[k]>10) errs[`bl_${k}`] = "0–10";
    });
    patterns.forEach(p=>{
      if (!p.file) errs[`file_${p.id}`] = "UML required";
      METRIC_KEYS.forEach(k=>{
        if (p.scores[k]===""||isNaN(+p.scores[k])) errs[`score_${p.id}_${k}`] = "Required";
        else if (+p.scores[k]<0||+p.scores[k]>10) errs[`score_${p.id}_${k}`] = "0–10";
      });
    });
    setErrors(errs);
    return Object.keys(errs).length===0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const baseImg = baselineFile ? await fileToBase64(baselineFile) : null;
      const enrichedPatterns = await Promise.all(patterns.map(async p => ({
        ...p,
        image: p.file ? await fileToBase64(p.file) : null,
      })));
      setTimeout(()=>{
        setLoading(false);
        onGenerate({ baselineScores, baselineFile, baselineImage:baseImg, patterns:enrichedPatterns, weights });
      }, 900);
    } catch(e) { setLoading(false); }
  };

  const baselineAvg = METRIC_KEYS.every(k=>baselineScores[k]!=="")
    ? computeWeightedAvg(baselineScores, weights) : null;

  return (
    <div className="animate-slide-up" style={{ maxWidth:1200, margin:"0 auto" }}>
      {/* Section A: Baseline Upload */}
      <Card style={{ marginBottom:24 }}>
        <ST 
          label="Baseline: Patternless UML"
          sub="Upload the reference design and enter maintainability metrics"
        />

        <div style={{ 
          display:"grid", 
          gridTemplateColumns:"1fr 1fr", 
          gap:32 
        }}>
          <div>
            <div style={{
              background:C.gray100,
              borderRadius:10,
              padding:"10px 16px",
              marginBottom:16,
              fontSize:13,
              fontWeight:700,
              color:C.gray800,
              display:"flex",
              alignItems:"center",
              gap:8,
            }}>
              <span style={{ 
                width:8, 
                height:8, 
                borderRadius:2, 
                background:C.gray400, 
                display:"inline-block" 
              }}/>
              Patternless UML Diagram
            </div>
            <UploadZone 
              file={baselineFile} 
              onFile={setBaselineFile} 
              accentColor={C.gray600}
            />
            {errors.baselineFile && (
              <p style={{color:C.danger,fontSize:11,marginTop:8}}>{errors.baselineFile}</p>
            )}

            {baselineAvg!==null && (
              <div className="animate-fade" style={{
                marginTop:20,
                padding:"16px 20px",
                borderRadius:12,
                background:C.gray50,
                border:`1px solid ${C.gray200}`,
                display:"flex",
                alignItems:"center",
                gap:20,
              }}>
                <div>
                  <div style={{ fontSize:12, color:C.gray400, fontWeight:500 }}>
                    Baseline Score
                  </div>
                  <div style={{ 
                    fontSize:32, 
                    fontWeight:800, 
                    color:C.navy,
                    lineHeight:1.2
                  }}>
                    {baselineAvg.toFixed(2)}
                  </div>
                </div>
                <div style={{ width:1, height:40, background:C.gray200 }}/>
                <div style={{ fontSize:13, color:C.gray400 }}>
                  out of 10.0
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{
              background:C.gray100,
              borderRadius:10,
              padding:"10px 16px",
              marginBottom:16,
              fontSize:13,
              fontWeight:700,
              color:C.gray800,
            }}>
              Baseline Maintainability Scores
            </div>
            {METRIC_KEYS.map((k,i) => (
              <MetricInput 
                key={k} 
                label={METRIC_LABELS[i]}
                value={baselineScores[k]}
                onChange={v=>setBaselineScores(prev=>({...prev,[k]:v}))}
                error={errors[`bl_${k}`]}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Section B: Pattern Designs */}
      <Card style={{ marginBottom:24 }}>
        <div style={{ 
          display:"flex", 
          alignItems:"flex-start", 
          justifyContent:"space-between", 
          marginBottom:20, 
          flexWrap:"wrap", 
          gap:12 
        }}>
          <ST 
            label="Pattern-Based Designs"
            sub="Add one or more pattern-based designs to compare"
            badge={`${patterns.length} design${patterns.length!==1?"s":""}`}
          />
          <button 
            className="btn-secondary" 
            onClick={()=>setShowWeights(!showWeights)} 
            style={{ padding:"8px 16px" }}
          >
            {Ico.settings} {showWeights ? "Hide Weights" : "Configure Weights"}
          </button>
        </div>

        {/* Formula Info */}
        <div style={{
          background:C.ice,
          borderRadius:12,
          padding:"16px 20px",
          marginBottom:24,
          display:"flex",
          gap:12,
          alignItems:"flex-start",
          border:`1px solid ${C.blue}20`
        }}>
          <div style={{ 
            background:C.blue, 
            borderRadius:8, 
            width:32, 
            height:32, 
            display:"flex", 
            alignItems:"center", 
            justifyContent:"center",
            flexShrink:0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="1" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.navy, marginBottom:4 }}>
              Maintainability Formula
            </div>
            <div style={{ fontSize:13, color:C.gray600, fontFamily:"'SF Mono', monospace" }}>
              Score = (Coupling×w₁ + Cohesion×w₂ + Modularity×w₃ + Extensibility×w₄ + Complexity×w₅) / Σwᵢ
            </div>
          </div>
        </div>

        {/* Weight Sliders */}
        {showWeights && (
          <div className="animate-scale" style={{
            background:C.gray50,
            borderRadius:12,
            padding:24,
            marginBottom:24,
            border:`1px solid ${C.gray200}`,
          }}>
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
                  onChange={v=>setWeights(prev=>({...prev,[k]:v}))}
                />
              ))}
            </div>
            <div style={{ fontSize:12, color:C.gray400, marginTop:12 }}>
              * Higher weight = greater influence on final score
            </div>
          </div>
        )}

        {/* Pattern Cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:20, marginBottom:24 }}>
          {patterns.map((p,i)=>(
            <PatternCard 
              key={p.id} 
              pattern={p} 
              index={i} 
              weights={weights} 
              errors={errors}
              onUpdate={patch=>updatePattern(p.id,patch)}
              onRemove={()=>removePattern(p.id)}
            />
          ))}
        </div>

        {/* Add Pattern Button */}
        <button 
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
            gap:8,
            transition:"all 0.2s ease",
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.background=`${C.blue}10`;
            e.currentTarget.style.borderColor=`${C.blue}80`;
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.background=`${C.blue}04`;
            e.currentTarget.style.borderColor=`${C.blue}40`;
          }}
        >
          {Ico.plus}
          Add Pattern Design
        </button>
      </Card>

      {/* Section C: Generate */}
      <Card>
        <ST 
          label="Generate Comparison" 
          sub="Run the weighted maintainability analysis across all designs"
        />
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <button 
            className="btn-primary" 
            onClick={handleGenerate} 
            disabled={loading}
            style={{ 
              padding:"14px 32px", 
              fontSize:15, 
              opacity:loading?0.7:1, 
              cursor:loading?"not-allowed":"pointer",
              minWidth:200
            }}
          >
            {loading ? (
              <>
                <span style={{ 
                  width:18, 
                  height:18, 
                  border:"2px solid rgba(255,255,255,0.3)", 
                  borderTopColor:"white", 
                  borderRadius:"50%", 
                  display:"inline-block", 
                  animation:"spin 0.9s linear infinite" 
                }}/>
                Generating...
              </>
            ) : (
              <>{Ico.trend} Generate Analysis</>
            )}
          </button>
          <div style={{ fontSize:14, color:C.gray400 }}>
            Comparing baseline vs {patterns.length} pattern design{patterns.length!==1?"s":""}
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── RESULT PAGE ──────────────────────────────────────────────────────────────
const ResultPage = ({ data, onClear }) => {
  const { baselineScores, baselineImage, patterns, weights } = data;
  const [activeTab, setActiveTab] = useState(0);

  const baseAvg    = computeWeightedAvg(baselineScores, weights);
  const patternAvgs = patterns.map(p => computeWeightedAvg(p.scores, weights));
  const bestIdx    = patternAvgs.indexOf(Math.max(...patternAvgs));
  const bestAvg    = patternAvgs[bestIdx];
  const improvement = ((bestAvg - baseAvg)/(baseAvg||1))*100;
  const conclusion = genConclusion(baselineScores, patterns, weights);

  const barData = METRIC_LABELS.map((label,i) => {
    const key = METRIC_KEYS[i];
    const row = { metric: label, Baseline: +baselineScores[key]||0 };
    patterns.forEach(p => { row[p.name||`P${patterns.indexOf(p)+1}`] = +p.scores[key]||0; });
    return row;
  });

  const radarData = METRIC_LABELS.map((label,i) => {
    const key = METRIC_KEYS[i];
    const row = { subject: label, Baseline: +baselineScores[key]||0 };
    patterns.forEach(p => { row[p.name||`P${patterns.indexOf(p)+1}`] = +p.scores[key]||0; });
    return row;
  });

  const bestPat = patterns[bestIdx];
  const pieData = METRIC_LABELS.map((l,i)=>({ name:l, value:+bestPat.scores[METRIC_KEYS[i]]||0 }));

  const PIE_COLORS_LOCAL = ["#3b82f6","#60a5fa","#10b981","#f59e0b","#ef4444"];

  const allKeys = ["Baseline", ...patterns.map((p,i)=>p.name||`Pattern ${i+1}`)];

  return (
    <div className="animate-slide-up" style={{ maxWidth:1400, margin:"0 auto" }}>
      {/* Top Summary Card */}
      <Card style={{ marginBottom:24 }}>
        <div style={{ 
          display:"flex", 
          justifyContent:"space-between", 
          alignItems:"flex-start", 
          flexWrap:"wrap", 
          gap:16, 
          marginBottom:24 
        }}>
          <div>
            <h2 style={{ 
              fontSize:24, 
              fontWeight:800, 
              color:C.navy, 
              margin:"0 0 4px",
              letterSpacing:"-0.02em"
            }}>
              Analysis Results
            </h2>
            <p style={{ fontSize:14, color:C.gray400, margin:0 }}>
              {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
              {" · "}{patterns.length} pattern design{patterns.length!==1?"s":""} compared
            </p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-primary" onClick={()=>window.print()} style={{ padding:"10px 20px" }}>
              {Ico.dl} Export PDF
            </button>
            <button className="btn-secondary" onClick={onClear} style={{ padding:"10px 20px" }}>
              New Analysis
            </button>
          </div>
        </div>

        {/* Score Tiles */}
        <div style={{ 
          display:"grid", 
          gridTemplateColumns:`repeat(${Math.min(patterns.length+2,5)},1fr)`, 
          gap:16 
        }}>
          <div className="stat-tile">
            <div style={{ fontSize:12, color:C.gray400, fontWeight:500, marginBottom:8 }}>
              Baseline
            </div>
            <div style={{ 
              fontSize:32, 
              fontWeight:800, 
              color:C.navy,
              lineHeight:1.2
            }}>
              {baseAvg.toFixed(2)}
            </div>
            <div style={{ fontSize:12, color:C.gray400 }}>Patternless</div>
          </div>

          {patterns.map((p,i)=>{
            const avg = patternAvgs[i];
            const imp = ((avg-baseAvg)/(baseAvg||1))*100;
            const isBest = i===bestIdx;
            const accent = PALETTE[(i+1)%PALETTE.length];
            return (
              <div 
                key={p.id} 
                className="stat-tile"
                style={{ 
                  background: isBest ? `linear-gradient(135deg, ${accent}08, transparent)` : undefined,
                  borderColor: isBest ? accent : undefined
                }}
              >
                {isBest && (
                  <div style={{ 
                    position:"absolute", 
                    top:12, 
                    right:12, 
                    fontSize:10, 
                    fontWeight:700, 
                    color:accent,
                    background:`${accent}15`,
                    padding:"2px 8px",
                    borderRadius:12,
                    letterSpacing:"-0.01em"
                  }}>
                    ★ BEST
                  </div>
                )}
                <div style={{ fontSize:12, color:accent, fontWeight:700, marginBottom:8 }}>
                  {p.name||`Pattern ${i+1}`}
                </div>
                <div style={{ 
                  fontSize:32, 
                  fontWeight:800, 
                  color:accent,
                  lineHeight:1.2
                }}>
                  {avg.toFixed(2)}
                </div>
                <ImproveBadge value={imp}/>
              </div>
            );
          })}

          <div className="stat-tile" style={{
            background: improvement>=0 ? "#f0fdf4" : "#fef2f2",
            borderColor: improvement>=0 ? C.success : C.danger,
          }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:8, color:improvement>=0 ? C.success : C.danger }}>
              Overall Δ
            </div>
            <div style={{ 
              fontSize:32, 
              fontWeight:800, 
              color:improvement>=0 ? C.success : C.danger,
              lineHeight:1.2
            }}>
              {improvement>=0 ? "+" : ""}{improvement.toFixed(1)}%
            </div>
            <div style={{ fontSize:12, color:C.gray400 }}>Best vs Baseline</div>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div style={{ 
        display:"grid", 
        gridTemplateColumns:"1.3fr 1fr", 
        gap:24, 
        marginBottom:24 
      }}>
        <Card>
          <ST label="Metric Comparison" sub="All designs across 5 maintainability dimensions"/>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{top:5,right:20,bottom:5,left:0}}>
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
              <Legend 
                wrapperStyle={{
                  fontFamily:"'Inter',sans-serif",
                  fontSize:12,
                  paddingTop:10
                }}
              />
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
        </Card>

        <Card>
          <ST label="Radar Profile" sub="Maintainability shape overlay"/>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.gray200}/>
              <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:C.gray600}}/>
              <PolarRadiusAxis domain={[0,10]} tick={{fontSize:10}} tickCount={5}/>
              <Radar 
                name="Baseline" 
                dataKey="Baseline" 
                stroke={C.gray400} 
                fill={C.gray400} 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              {patterns.map((p,i)=>(
                <Radar 
                  key={p.id} 
                  name={p.name||`P${i+1}`} 
                  dataKey={p.name||`P${i+1}`}
                  stroke={PALETTE[(i+1)%PALETTE.length]} 
                  fill={PALETTE[(i+1)%PALETTE.length]} 
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{fontFamily:"'Inter',sans-serif",fontSize:12}}/>
              <Tooltip 
                contentStyle={{
                  fontFamily:"'Inter',sans-serif",
                  fontSize:12,
                  borderRadius:10,
                  border:`1px solid ${C.gray200}`,
                  boxShadow:"var(--shadow-md)"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pie + Images Row */}
      <div style={{ 
        display:"grid", 
        gridTemplateColumns:"1fr 1fr", 
        gap:24, 
        marginBottom:24 
      }}>
        <Card>
          <ST label="Best Pattern Distribution" sub={`Metric breakdown for ${bestPat.name||"best design"}`}/>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                dataKey="value"
                label={({name,value})=>`${name[0]}: ${value}`} 
                labelLine={false}
              >
                {pieData.map((_,i)=>(
                  <Cell key={i} fill={PIE_COLORS_LOCAL[i%PIE_COLORS_LOCAL.length]}/>
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  fontFamily:"'Inter',sans-serif",
                  fontSize:12,
                  borderRadius:10,
                  border:`1px solid ${C.gray200}`,
                  boxShadow:"var(--shadow-md)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <ST label="UML Diagrams" sub="Uploaded design diagrams"/>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {baselineImage && (
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.gray400, marginBottom:8 }}>
                  Baseline
                </div>
                <img 
                  src={baselineImage} 
                  alt="Baseline" 
                  style={{ 
                    width:"100%", 
                    maxHeight:120, 
                    objectFit:"cover", 
                    borderRadius:10, 
                    border:`1px solid ${C.gray200}` 
                  }}
                />
              </div>
            )}
            <div style={{ 
              display:"grid", 
              gridTemplateColumns:`repeat(${Math.min(patterns.length,2)},1fr)`, 
              gap:12 
            }}>
              {patterns.map((p,i)=>p.image&&(
                <div key={p.id}>
                  <div style={{ 
                    fontSize:12, 
                    fontWeight:600, 
                    marginBottom:6, 
                    color:PALETTE[(i+1)%PALETTE.length] 
                  }}>
                    {p.name||`P${i+1}`}
                  </div>
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    style={{ 
                      width:"100%", 
                      maxHeight:100, 
                      objectFit:"cover", 
                      borderRadius:8, 
                      border:`1px solid ${PALETTE[(i+1)%PALETTE.length]}30` 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Metric Table */}
      <Card style={{ marginBottom:24 }}>
        <ST label="Detailed Metric Analysis" sub="Metric-by-metric breakdown with improvements"/>
        
        {/* Tab Buttons */}
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          {allKeys.map((k,i)=>(
            <button 
              key={k} 
              className={`tab-btn ${activeTab===i ? 'active' : ''}`} 
              onClick={()=>setActiveTab(i)}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Table */}
        <div>
          <div style={{ 
            display:"grid", 
            gridTemplateColumns:"140px 1fr 1fr auto auto", 
            gap:16,
            padding:"12px 20px",
            background:C.gray100,
            borderRadius:8,
            marginBottom:8,
            fontSize:12,
            fontWeight:700,
            color:C.gray400,
            letterSpacing:"-0.01em"
          }}>
            <div>Metric</div>
            <div>Baseline</div>
            <div>Selected</div>
            <div>Change</div>
            <div>Status</div>
          </div>

          {METRIC_LABELS.map((label,mi)=>{
            const key = METRIC_KEYS[mi];
            const bVal = +baselineScores[key]||0;
            const selVal = activeTab===0 ? bVal : +patterns[activeTab-1]?.scores[key]||0;
            const diff = selVal - bVal;
            const pct  = ((diff)/(bVal||1))*100;
            const improved = diff > 0;
            const accent = activeTab===0 ? C.gray400 : PALETTE[activeTab%PALETTE.length];
            
            return (
              <div 
                key={label} 
                style={{ 
                  display:"grid", 
                  gridTemplateColumns:"140px 1fr 1fr auto auto", 
                  gap:16,
                  alignItems:"center",
                  padding:"14px 20px",
                  borderBottom:`1px solid ${C.gray200}`,
                  transition:"background 0.15s",
                }}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{ fontWeight:600, color:C.navy }}>{label}</div>
                
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div className="metric-progress" style={{ width:80 }}>
                    <div 
                      className="metric-progress-bar" 
                      style={{ 
                        width:`${(bVal/10)*100}%`, 
                        background:C.gray400 
                      }}
                    />
                  </div>
                  <span style={{ fontSize:13, color:C.gray600, fontWeight:600 }}>
                    {bVal.toFixed(1)}
                  </span>
                </div>
                
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div className="metric-progress" style={{ width:80 }}>
                    <div 
                      className="metric-progress-bar" 
                      style={{ 
                        width:`${(selVal/10)*100}%`, 
                        background:accent 
                      }}
                    />
                  </div>
                  <span style={{ fontSize:13, color:accent, fontWeight:700 }}>
                    {selVal.toFixed(1)}
                  </span>
                </div>
                
                {activeTab===0 ? (
                  <span style={{ fontSize:12, color:C.gray400 }}>—</span>
                ) : (
                  <ImproveBadge value={pct}/>
                )}
                
                {activeTab===0 ? (
                  <span style={{ fontSize:12, color:C.gray400 }}>—</span>
                ) : (
                  <span style={{ 
                    fontSize:12, 
                    fontWeight:600, 
                    color:improved?C.success:C.danger
                  }}>
                    {improved ? "✓ Improved" : "✗ Declined"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Conclusion */}
      <Card>
        <ST label="Academic Conclusion" sub="Auto-generated interpretation of results"/>
        <div style={{
          background:`linear-gradient(135deg, ${C.blue}06, transparent)`,
          borderRadius:12,
          padding:"28px 32px",
          borderLeft:`4px solid ${C.blue}`,
        }}>
          <p style={{ 
            margin:0, 
            fontSize:15, 
            lineHeight:1.8, 
            color:C.gray800,
            fontWeight:400
          }}>
            {conclusion}
          </p>
          <div style={{ 
            marginTop:20, 
            fontSize:13, 
            color:C.gray400, 
            display:"flex", 
            gap:24, 
            flexWrap:"wrap" 
          }}>
            <span>✓ Weighted multi-metric scoring</span>
            <span>✓ {patterns.length} pattern design{patterns.length!==1?"s":""} evaluated</span>
            <span>✓ Academic-grade maintainability analysis</span>
          </div>
        </div>
      </Card>
    </div>
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