'use client';

import { useEffect, useState } from 'react';
import { colorNameEN, colorNameTH, hexToRgb, toneAndMood } from '../lib/color';

function buildPrompt(hex, department, subject) {
  const { r, g, b } = hexToRgb(hex);
  return `Color: ${colorNameEN(hex)}\nHEX: ${hex.toUpperCase()}  RGB: ${r} / ${g} / ${b}\n\nDepartment: ${department.name}\nSubject: ${subject.label}\n\nStyle: ${department.style.join(', ')}\nShapes: ${department.shapes.join(', ')}\nObjects: ${department.objects.slice(0, 4).join(', ')}`;
}

function ImageCard({ hex, department, subject, index }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setImage(null); setError(null); setLoading(false); }, [hex, department.id, subject.label]);

  const requestImage = async () => {
    setError(null); setImage(null); setLoading(true);
    try {
      const response = await fetch('/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hex, department: department.name, subject: subject.label, style: department.style, shapes: department.shapes, objects: department.objects }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.image) throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างภาพ');
      setImage(data.image);
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  };

  const usage = `นำสี${colorNameTH(hex)}ไปใช้กับงาน ${subject.label} ในสไตล์ ${department.style[index % department.style.length]} เพื่อให้ตรงกับบริบทของ${department.name}`;
  return <article className="gcard"><div className="gcard-visual">
    {image ? <img className="gcard-img" src={image} alt={`${subject.label} concept`} /> : loading ? <div className="img-status img-loading"><div className="loading-dot-row"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></div></div> : error ? <div className="img-status img-error"><p>สร้างภาพไม่สำเร็จ: {error}</p><button type="button" className="img-retry-btn" onClick={requestImage}>ลองใหม่</button></div> : <div className="img-status"><p>สร้างภาพ AI สำหรับหัวข้อนี้</p><button type="button" className="img-retry-btn" onClick={requestImage}>✨ สร้างภาพ AI</button></div>}
  </div><div className="gcard-body"><p className="gcard-type">{department.name}</p><p className="gcard-title">{subject.label}</p><p className="gcard-desc">แนวคิดงาน {subject.label} ที่ใช้สี{colorNameTH(hex)}เป็นสีนำ</p><div className="gcard-usage">{usage}</div><button className="gcard-prompt-toggle" onClick={() => setOpen(!open)}>{open ? 'ซ่อน image prompt' : 'ดู image prompt >'}</button>{open && <pre className="gcard-prompt show">{buildPrompt(hex, department, subject)}</pre>}</div></article>;
}

export default function GuideResults({ guide, department }) {
  if (!guide) return <div className="empty-state"><p className="display" style={{ margin: '0 0 10px' }}>ยังไม่มี Visual Guide</p><p>เลือกสี สาขาวิชา และ Color Focus (ถ้าต้องการ) ทางซ้าย แล้วกด <b>✨ สร้าง Visual Guide</b> เพื่อสร้างแนวทางการใช้สีสำหรับงานของคุณ</p></div>;
  const hex = guide.color; const colorName = colorNameTH(hex); const { r, g, b } = hexToRgb(hex); const { tone, mood } = toneAndMood(hex);
  return <><div className="hero-card"><div className="hero-swatch" style={{ background: hex }} /><div className="hero-text"><p className="hero-eq">สี <span className="hex">{hex.toUpperCase()}</span> ({colorName}) <span className="plus">+ </span>สาขา {department.name}</p><h1 className="hero-title">{colorName}<span className="plus"> สำหรับงาน </span>{department.name}</h1><p className="hero-desc">{department.tagline} — Visual Guide นี้สร้างขึ้นเฉพาะสำหรับสี {hex.toUpperCase()} และสาขานี้</p></div></div>
    <div className="section-heading"><h2>Color Analysis</h2></div><div className="analysis-card"><div className="analysis-cell"><p className="a-label">Color</p><p className="a-value">{colorName}</p></div><div className="analysis-cell"><p className="a-label">HEX</p><p className="a-value mono">{hex.toUpperCase()}</p></div><div className="analysis-cell"><p className="a-label">RGB</p><p className="a-value mono">{r} / {g} / {b}</p></div><div className="analysis-cell"><p className="a-label">Tone · Mood</p><p className="a-value" style={{ fontSize: 13 }}>{tone}<br />{mood}</p></div></div>
    <div className="section-heading"><h2>Visual Style — {department.name}</h2></div><div className="tag-row">{department.style.map((item) => <span className="tag on" style={{ background: hex }} key={item}>{item}</span>)}</div>
    <div className="section-heading"><h2>Visual Guide Gallery</h2><span className="count">{department.subjects.length} รายการ</span></div><div className="gallery-grid">{department.subjects.map((subject, index) => <ImageCard key={subject.label} hex={hex} department={department} subject={subject} index={index} />)}</div>
    <div className="twocol"><div className="info-card"><h3>รูปทรงที่เข้ากับสาขานี้</h3><div className="chip-list">{department.shapes.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div><div className="info-card"><h3>วัตถุที่มักปรากฏในงาน</h3><div className="chip-list">{department.objects.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div></div>
  </>;
}
