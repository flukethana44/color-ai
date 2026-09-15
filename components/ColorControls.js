'use client';

import { useEffect, useRef, useState } from 'react';
import { hexToHsv, hexToRgb, hsvToHex } from '../lib/color';

const PALETTES = [['Vibrant', ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA']], ['Cool', ['#1E88E5', '#3949AB', '#00ACC1', '#5E35B1', '#00838F']], ['Warm', ['#E53935', '#FB8C00', '#F4511E', '#FDD835', '#D84315']], ['Natural', ['#6D4C41', '#8D6E63', '#33691E', '#558B2F', '#A1887F']]];

export default function ColorControls({ color, onChange }) {
  const canvasRef = useRef(null); const [hsv, setHsv] = useState(() => hexToHsv(color)); const [draftHex, setDraftHex] = useState(color);
  const paint = (value) => { const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return; const image = ctx.createImageData(200, 200); for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) { const dx = x - 100, dy = y - 100, distance = Math.hypot(dx, dy); const i = (y * 200 + x) * 4; if (distance > 100) { image.data[i + 3] = 0; continue; } const hex = hsvToHex((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, distance, value); const rgb = hexToRgb(hex); image.data.set([rgb.r, rgb.g, rgb.b, 255], i); } ctx.putImageData(image, 0, 0); };
  useEffect(() => paint(hsv.v), [hsv.v]);
  useEffect(() => { const next = hexToHsv(color); setHsv(next); setDraftHex(color); paint(next.v); }, [color]);
  const selectWheel = (event) => { const rect = canvasRef.current.getBoundingClientRect(); const dx = (event.clientX - rect.left) * 200 / rect.width - 100, dy = (event.clientY - rect.top) * 200 / rect.height - 100; const distance = Math.min(100, Math.hypot(dx, dy)); const next = { h: (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, s: distance, v: hsv.v }; setHsv(next); onChange(hsvToHex(next.h, next.s, next.v)); };
  const rgb = hexToRgb(color);
  return <><div className="step-label"><span className="step-num">1</span>เลือกสี</div><div className="step-title">Color</div>
    <div className="selected-color-row"><div className="selected-color-swatch" style={{ background: color }} /><div><p className="selected-color-label">Selected Color</p><p className="selected-color-hex mono">{color.toUpperCase()}</p></div></div>
    <div className="colorwheel-wrap"><canvas ref={canvasRef} className="colorwheel-canvas" width="200" height="200" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); selectWheel(e); }} onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && selectWheel(e)} /><div className="wheel-marker" style={{ left: `${100 + Math.cos(hsv.h * Math.PI / 180) * hsv.s}px`, top: `${100 + Math.sin(hsv.h * Math.PI / 180) * hsv.s}px` }} /></div>
    <div className="value-slider-row"><label htmlFor="brightness">Brightness</label><input id="brightness" type="range" min="15" max="100" value={Math.round(hsv.v)} onChange={(e) => { const next = { ...hsv, v: Number(e.target.value) }; setHsv(next); onChange(hsvToHex(next.h, next.s, next.v)); }} /></div>
    <p className="subsection-title">Color Palette</p><div className="palette-list">{PALETTES.map(([name, colors]) => <div className="palette-row" key={name}><span className="palette-name">{name}</span><span className="palette-dots">{colors.map((item) => <button key={item} aria-label={item} className="palette-dot" style={{ background: item }} onClick={() => onChange(item)} />)}</span></div>)}</div>
    <div className="custom-color-row"><input type="color" value={color} onChange={(e) => onChange(e.target.value)} aria-label="เลือกสีเอง" /><div style={{ flex: 1 }}><label>กำหนดสีเอง (HEX)</label><br /><input type="text" className="mono" value={draftHex} maxLength="7" onChange={(e) => setDraftHex(e.target.value)} onBlur={(e) => { const value = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`; if (/^#[0-9a-fA-F]{6}$/.test(value)) onChange(value); else setDraftHex(color); }} /></div></div>
    <div className="rgb-row">{[['R', rgb.r], ['G', rgb.g], ['B', rgb.b]].map(([label, value]) => <div className="rgb-field" key={label}><span className="rgb-label">{label}</span><span className="rgb-val">{value}</span></div>)}</div></>;
}
