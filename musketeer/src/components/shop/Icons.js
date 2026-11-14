/* Minimal 1px-stroke icon set. Square line caps to match the brand. */
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "square", "aria-hidden": true, focusable: "false" };

export const IconClose = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...base} {...p}><path d="M2.5 2.5l11 11M13.5 2.5l-11 11" /></svg>
);
export const IconMenu = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...base} {...p}><path d="M2 6.5h16M2 13.5h16" /></svg>
);
export const IconSearch = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...base} {...p}><circle cx="7.75" cy="7.75" r="5.75" /><path d="M12 12l4.5 4.5" /></svg>
);
export const IconBag = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...base} {...p}><path d="M2.5 5.5h13v11h-13z" /><path d="M6 5.5V4a3 3 0 0 1 6 0v1.5" /></svg>
);
export const IconUser = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...base} {...p}><circle cx="9" cy="6" r="3.25" /><path d="M2.5 16.5c.8-3.3 3.3-5 6.5-5s5.7 1.7 6.5 5" /></svg>
);
export const IconPlus = ({ size = 12, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" {...base} {...p}><path d="M6 1v10M1 6h10" /></svg>
);
export const IconMinus = ({ size = 12, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" {...base} {...p}><path d="M1 6h10" /></svg>
);
export const IconArrow = ({ size = 14, dir = "right", ...p }) => {
  const r = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ transform: `rotate(${r}deg)` }} {...base} {...p}><path d="M1 7h11M8 3l4 4-4 4" /></svg>
  );
};
export const IconChevron = ({ size = 10, dir = "down", ...p }) => {
  const r = { down: 0, up: 180, left: 90, right: -90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ transform: `rotate(${r}deg)` }} {...base} {...p}><path d="M1.5 3.5L5 7l3.5-3.5" /></svg>
  );
};
export const IconGrid = ({ cols = 2, size = 14, ...p }) => {
  const cells = [];
  const gap = 2;
  const w = (size - gap * (cols - 1)) / cols;
  for (let i = 0; i < cols; i++) cells.push(<rect key={i} x={i * (w + gap)} y="0.5" width={w} height={size - 1} />);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="currentColor" aria-hidden="true" focusable="false" {...p}>{cells}</svg>
  );
};
export const IconZoom = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...base} {...p}><circle cx="7" cy="7" r="5" /><path d="M10.6 10.6L14.5 14.5M7 4.8v4.4M4.8 7h4.4" /></svg>
);
export const IconStar = ({ size = 18, filled = false, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...base} strokeLinejoin="miter" fill={filled ? "currentColor" : "none"} {...p}>
    <path d="M9 1.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L1.8 7.1l5-.7z" />
  </svg>
);
