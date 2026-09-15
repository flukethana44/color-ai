'use client';

import { useState } from 'react';
import { DEPARTMENTS } from '../lib/departments';
import ColorControls from '../components/ColorControls';
import CameraFocus from '../components/CameraFocus';
import GuideResults from '../components/GuideResults';

export default function Home() {
  const [color, setColor] = useState('#35A853');
  const [departmentId, setDepartmentId] = useState('multimedia');
  const [guide, setGuide] = useState(null);
  const department = DEPARTMENTS.find((item) => item.id === departmentId);
  const stale = guide && (guide.color !== color || guide.departmentId !== departmentId);
  return <main style={{ '--accent': color, '--accent-soft': `${color}22`, '--accent-soft2': `${color}11` }}>
    <header className="topbar"><div className="wordmark">AI COLOR <span>GUIDE</span></div><div className="subtitle">เลือกสี เลือกสาขา และสร้าง Visual Guide ที่ใช้สีนั้นเป็นสีหลักของงาน</div></header>
    <div className="layout"><aside className="controls">
      <ColorControls color={color} onChange={setColor} />
      <div className="step-label spaced"><span className="step-num">2</span>เลือกสาขาวิชา</div><div className="step-title">Department</div>
      <div className="dept-list">{DEPARTMENTS.map((item) => <button key={item.id} className={`dept-btn ${item.id === departmentId ? 'active' : ''}`} onClick={() => setDepartmentId(item.id)}><span className="dept-icon">✦</span><span className="dept-name">{item.name}</span></button>)}</div>
      <CameraFocus color={color} />
      {stale && <div className="stale-note show"><span className="dot" />การเลือกเปลี่ยนไป — กด Generate ใหม่เพื่ออัปเดต Visual Guide</div>}
      <button className="generate-btn" onClick={() => setGuide({ color, departmentId })}>✨ สร้าง Visual Guide</button>
    </aside><section className="result"><GuideResults guide={guide} department={department} /></section></div>
  </main>;
}
