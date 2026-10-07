'use client';

import { useEffect, useRef, useState } from 'react';
import { DEPARTMENTS } from '../lib/departments';
import ColorControls from '../components/ColorControls';
import CameraFocus from '../components/CameraFocus';
import GuideResults from '../components/GuideResults';
import { hexToRgb } from '../lib/color';

const COLOR_HISTORY_KEY = 'ai-color-guide-color-history';
const COLOR_HISTORY_LIMIT = 8;

function getContrastText(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.179 ? '#20251F' : '#FFFFFF';
}

export default function Home() {
  const [color, setColor] = useState('#ffffff');
  const [focusColor, setFocusColor] = useState(null);
  const [departmentId, setDepartmentId] = useState('multimedia');
  const [guide, setGuide] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [historyReady, setHistoryReady] = useState(false);
  const colorHistoryRef = useRef([]);
  const lastRecordedColor = useRef(null);
  const department = DEPARTMENTS.find((item) => item.id === departmentId);
  const activeColor = focusColor || color;
  const stale = guide && (guide.color !== activeColor || guide.departmentId !== departmentId);
  const generateGuide = () => setGuide({ color: activeColor, departmentId });

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(COLOR_HISTORY_KEY) || '[]');
      const validHistory = Array.isArray(stored)
        ? stored.filter((item) => typeof item === 'string' && /^#[0-9a-fA-F]{6}$/.test(item)).map((item) => item.toUpperCase()).slice(0, COLOR_HISTORY_LIMIT)
        : [];
      colorHistoryRef.current = validHistory;
      setColorHistory(validHistory);
    } catch (error) {
      console.error('Could not load color selection history.', error);
    }
    lastRecordedColor.current = activeColor.toUpperCase();
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    const normalizedColor = activeColor.toUpperCase();
    if (!historyReady || lastRecordedColor.current === normalizedColor) return undefined;
    const timer = window.setTimeout(() => {
      lastRecordedColor.current = normalizedColor;
      const nextHistory = [normalizedColor, ...colorHistoryRef.current.filter((item) => item !== normalizedColor)].slice(0, COLOR_HISTORY_LIMIT);
      colorHistoryRef.current = nextHistory;
      setColorHistory(nextHistory);
      try {
        window.localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(nextHistory));
      } catch (error) {
        console.error('Could not save color selection history.', error);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activeColor, historyReady]);

  const clearColorHistory = () => {
    colorHistoryRef.current = [];
    setColorHistory([]);
    try {
      window.localStorage.removeItem(COLOR_HISTORY_KEY);
    } catch (error) {
      console.error('Could not clear color selection history.', error);
    }
  };

  return <main style={{ '--accent': activeColor, '--accent-soft': `${activeColor}22`, '--accent-soft2': `${activeColor}11` }}>
    <header className="topbar"><div className="brand-copy"><div className="wordmark">AI COLOR <span>GUIDE</span></div><div className="subtitle">เลือกสี แล้วให้ AI สร้างแนวทางการออกแบบ</div></div><div className="header-logo-wrap"><img className="header-logo" src="/multimedia-technology-logo.png" alt="Multimedia Technology" /><span className="header-logo-accent" aria-hidden="true" /></div></header>
    <div className="layout"><aside className="controls">
      <ColorControls color={color} onChange={setColor} />
      <section className="color-history" aria-label="ประวัติการเลือกสี">
        <div className="color-history-heading"><p className="subsection-title">ประวัติสี</p>{colorHistory.length > 0 && <button type="button" className="clear-history-btn" onClick={clearColorHistory}>ล้าง</button>}</div>
        {colorHistory.length > 0
          ? <div className="color-history-list">{colorHistory.map((item) => <button key={item} type="button" className={`color-history-swatch ${item === activeColor.toUpperCase() ? 'active' : ''}`} style={{ backgroundColor: item }} title={item} aria-label={`เลือกสี ${item}`} onClick={() => { setFocusColor(null); setColor(item); }} />)}</div>
          : <p className="color-history-empty">สีที่เลือกจะปรากฏที่นี่</p>}
      </section>
      <div className="step-label spaced"><span className="step-num">02</span>เลือกสาขาวิชา</div><div className="step-title">Department</div>
      <div className="dept-list">{DEPARTMENTS.map((item) => <button key={item.id} className={`dept-btn ${item.id === departmentId ? 'active' : ''}`} onClick={() => setDepartmentId(item.id)}><span className="dept-icon">✦</span><span className="dept-name">{item.name}</span></button>)}</div>
      <CameraFocus onColorExtracted={setFocusColor} />
      {stale && <div className="stale-note show"><span className="dot" />การเลือกเปลี่ยนไป — Visual Guide ที่แสดงยังอ้างอิงการเลือกก่อนหน้า</div>}
    </aside><section className="result"><GuideResults guide={guide} department={department} onGenerate={generateGuide} generateColor={activeColor} generateTextColor={getContrastText(activeColor)} /></section></div>
  </main>;
}
