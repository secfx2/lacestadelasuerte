// Mini gráfica de línea (SVG puro)
export default function Sparkline({ values = [], height = 48, color = 'var(--lime)' }) {
  const w = 200;
  const h = height;
  if (values.length < 2) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="chart" preserveAspectRatio="none" style={{ height }}>
        <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 5" />
      </svg>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, 4 + (1 - (v - min) / span) * (h - 8)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L${w},${h} L0,${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="spk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spk)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} />
    </svg>
  );
}
