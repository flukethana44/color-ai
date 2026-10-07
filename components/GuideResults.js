'use client';

import { useCallback, useEffect, useState } from 'react';
import { analyzeColor, colorNameEN, colorNameTH, hexToRgb, toneAndMood } from '../lib/color';

const variations = [
  'editorial hero shot with a clear focal point', 'top-down flat lay with carefully arranged objects',
  'close-up macro detail showing texture and material', 'wide environmental scene showing context and scale',
  'dynamic diagonal composition with strong movement', 'minimal geometric composition with generous negative space',
  'human-centered scene with a visible interaction', 'technical diagram-like composition with labeled visual structure',
  'layered collage combining foreground, middle ground, and background', 'low-angle perspective emphasizing height and depth',
  'symmetrical frontal composition with balanced proportions', 'asymmetrical composition using intentional visual tension',
  'isometric view with clean dimensional forms', 'before-and-after comparison showing a clear transformation',
  'material study with three distinct surface treatments', 'night scene using controlled practical lighting',
  'daylight scene with soft natural shadows', 'prototype presentation on a clean studio table',
  'immersive first-person viewpoint from inside the experience', 'poster-like composition with a bold central silhouette',
];

function buildPrompt(hex, department, subject, analysis) {
  const { r, g, b } = hexToRgb(hex);
  return `Color: ${colorNameEN(hex)}\nHEX: ${hex.toUpperCase()}  RGB: ${r} / ${g} / ${b}\nColor role: ${analysis.role}\nTemperature: ${analysis.temperature}\nBackground: ${analysis.background}\nContrast: ${analysis.contrast}\n\nDepartment: ${department.name}\nSubject: ${subject.label}\n\nPriority focus (top 4): ${department.subjects.slice(0, 4).map((item) => item.label).join(', ')}\nStyle: ${department.style.slice(0, 4).join(', ')}\nShapes: ${department.shapes.slice(0, 4).join(', ')}\nObjects: ${department.objects.slice(0, 4).join(', ')}`;
}

function buildUsage(hex, department, subject, index, analysis) {
  const style = department.style[index % department.style.length];
  const shape = department.shapes[index % department.shapes.length];
  const object = department.objects[index % department.objects.length];
  const variation = variations[index % variations.length];
  const roleGuidance = {
    'Accent Color': `ใช้สี${colorNameTH(hex)}เป็นสี Accent เพื่อดึงสายตาไปยังจุดสำคัญ โดยวางบนพื้น${analysis.background}`,
    'Secondary Color': `ใช้สี${colorNameTH(hex)}เป็นสีรองเพื่อแบ่งลำดับชั้นของงาน และปล่อยให้สีหลักที่เป็นกลางคุมภาพรวม`,
    'Background Color': `ใช้สี${colorNameTH(hex)}เป็นพื้นหลังเพื่อสร้างบรรยากาศ แล้วใช้ตัวอักษรหรือวัตถุสีเข้มให้อ่านชัด`,
    'Primary Color': `ใช้สี${colorNameTH(hex)}เป็นสีหลักเพื่อกำหนดอารมณ์ของงาน พร้อมใช้สีเป็นกลางช่วยถ่วงน้ำหนัก`,
  }[analysis.role];
  const subjectGuidance = {
    Painting: 'เน้นน้ำหนักสีและร่องรอยฝีแปรง', Drawing: 'ใช้สีเพื่อเน้นเส้นนำสายตาและพื้นที่ว่าง', Sculpture: 'ให้สีตัดกับผิววัสดุและเงาตกกระทบ',
    Interior: 'ใช้สีแบ่งโซนและกำหนดบรรยากาศของพื้นที่', Room: 'ใช้สีสร้างจุดเด่นให้ผนังหรือเฟอร์นิเจอร์ชิ้นสำคัญ', Furniture: 'ใช้สีเน้นรูปทรงและจุดสัมผัสของชิ้นงาน',
    House: 'ใช้สีเน้นมวลอาคารและความสัมพันธ์กับบริบทโดยรอบ', Building: 'ใช้สีสร้างจุดสังเกตบนเปลือกอาคาร', 'City Planning': 'ใช้สีแยกประเภทพื้นที่และช่วยให้แผนผังอ่านง่าย',
    'Road Network': 'ใช้สีเน้นเส้นทางหลักและลำดับความสำคัญของการสัญจร', Logo: 'ใช้สีสร้างความจำง่ายและลำดับการมองเห็นของเครื่องหมาย', Branding: 'กำหนดสีเป็นกฎหลักของระบบอัตลักษณ์',
    Packaging: 'ใช้สีดึงความสนใจบนชั้นวางและแยกสินค้าจากคู่แข่ง', UI: 'ใช้สีเป็นสถานะหรือปุ่มสำคัญโดยรักษาความอ่านง่าย', Website: 'ใช้สีสร้างลำดับชั้นของปุ่ม ลิงก์ และส่วนเนื้อหา',
  }[subject.label] || 'ใช้สีเพื่อกำหนดลำดับการมองเห็นและบรรยากาศของงาน';
  return `${roleGuidance} สำหรับ ${subject.label}: ${subjectGuidance} จับคู่กับสไตล์ ${style} และ${shape} โดยใช้${object} จัดวางแบบ${variation} ให้สอดคล้องกับ${department.tagline}`;
}

function ImageCard({ hex, department, subject, index, analysis }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [open, setOpen] = useState(false);

  const requestImage = useCallback(async (fallbackOnly = false) => {
    setError(null); setImage(null); setIsFallback(false); setLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hex,
          department: department.name,
          subject: subject.label,
          style: [department.style[index % department.style.length]],
          shapes: [department.shapes[index % department.shapes.length]],
          objects: [department.objects[index % department.objects.length]],
          variation: variations[index % variations.length],
          variationIndex: index + 1,
          colorRole: analysis.role,
          colorTemperature: analysis.temperature,
          backgroundColor: analysis.background,
          contrastGuidance: analysis.contrast,
          ...(fallbackOnly && { fallbackOnly: true }),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างภาพ');
      if (data.warning) throw new Error(data.warning);
      if (!data.image) throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างภาพ');
      setImage(data.image);
      setIsFallback(data.fallback === true);
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }, [analysis.background, analysis.contrast, analysis.role, analysis.temperature, department.id, department.name, department.objects, department.shapes, department.style, hex, index, subject.label]);

  useEffect(() => {
    setImage(null);
    setError(null);
    setIsFallback(false);
    setLoading(false);
  }, [hex, department.id, subject.label]);

  const usage = buildUsage(hex, department, subject, index, analysis);
  return <article className="gcard"><div className="gcard-visual">
    {image ? <><img className="gcard-img" src={image} alt={`${subject.label} concept`} onError={() => { if (!isFallback) requestImage(true); }} />{isFallback && <div className="img-fallback-actions"><span className="img-fallback-label">ภาพสำรอง · ไม่ใช่ภาพ AI</span><button type="button" className="img-retry-btn" onClick={() => requestImage()}>ลองสร้างภาพ AI อีกครั้ง</button></div>}</> : loading ? <div className="img-status img-loading"><div className="loading-dot-row"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></div></div> : error ? <div className="img-status img-error"><p>สร้างภาพไม่สำเร็จ: {error}</p><button type="button" className="img-retry-btn" onClick={requestImage}>ลองใหม่</button></div> : <div className="img-status"><p>สร้างภาพ AI สำหรับหัวข้อนี้</p><button type="button" className="img-retry-btn" onClick={requestImage}>✨ สร้างภาพ AI</button></div>}
  </div><div className="gcard-body"><p className="gcard-type">{department.name}</p><p className="gcard-title">{subject.label}</p><p className="gcard-desc">{analysis.role} · {analysis.temperature} · {analysis.brightness} · {analysis.saturation}</p><div className="gcard-usage">{usage}</div><button className="gcard-prompt-toggle" onClick={() => setOpen(!open)}>{open ? 'ซ่อน image prompt' : 'ดู image prompt >'}</button>{open && <pre className="gcard-prompt show">{buildPrompt(hex, department, subject, analysis)}</pre>}</div></article>;
}

export default function GuideResults({ guide, department, onGenerate, generateColor, generateTextColor }) {
  if (!guide) return <div className="empty-state"><div className="empty-icon" aria-hidden="true">✦</div><h1 className="display">สร้าง Visual Guide ของคุณ</h1><p>เลือกสีและประเภทงาน แล้วให้ AI<br className="desktop-break" /> สร้างแนวทางการใช้สีสำหรับงานของคุณ</p><button type="button" className="empty-generate-btn" style={{ '--button-color': generateColor, '--button-text-color': generateTextColor }} onClick={onGenerate}>✨ สร้าง Visual Guide</button></div>;
  const hex = guide.color; const colorName = colorNameTH(hex); const { r, g, b } = hexToRgb(hex); const { tone, mood } = toneAndMood(hex); const analysis = analyzeColor(hex);
  return <><div className="guide-actions"><button type="button" className="empty-generate-btn" style={{ '--button-color': generateColor, '--button-text-color': generateTextColor }} onClick={onGenerate}>✨ สร้าง Visual Guide</button></div><div className="hero-card"><div className="hero-swatch" style={{ background: hex }} /><div className="hero-text"><p className="hero-eq">สี <span className="hex">{hex.toUpperCase()}</span> ({colorName}) <span className="plus">+ </span>สาขา {department.name}</p><h1 className="hero-title">{colorName}<span className="plus"> สำหรับงาน </span>{department.name}</h1><p className="hero-desc">{department.tagline} — Visual Guide นี้สร้างขึ้นเฉพาะสำหรับสี {hex.toUpperCase()} และสาขานี้</p></div></div>
    <div className="section-heading"><h2>Color Analysis</h2></div><div className="analysis-card"><div className="analysis-cell"><p className="a-label">Color</p><p className="a-value">{colorName}</p></div><div className="analysis-cell"><p className="a-label">HEX</p><p className="a-value mono">{hex.toUpperCase()}</p></div><div className="analysis-cell"><p className="a-label">RGB</p><p className="a-value mono">{r} / {g} / {b}</p></div><div className="analysis-cell"><p className="a-label">Role</p><p className="a-value">{analysis.role}</p></div><div className="analysis-cell"><p className="a-label">Hue · Temperature</p><p className="a-value" style={{ fontSize: 13 }}>{analysis.hue}° · {analysis.temperature}<br />{analysis.brightness} · {analysis.saturation}</p></div></div>
    <div className="section-heading"><h2>Visual Style — {department.name}</h2></div><div className="tag-row">{department.style.map((item) => <span className="tag on" style={{ background: hex }} key={item}>{item}</span>)}</div>
    <div className="section-heading"><h2>Color-fit Categories</h2><span className="count">แนะนำจากคุณสมบัติสี</span></div><div className="tag-row category-row">{analysis.suggestedCategories.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
    <div className="section-heading"><h2>Visual Guide Gallery</h2><span className="count">{department.subjects.length} รายการ</span></div><div className="gallery-grid">{department.subjects.map((subject, index) => <ImageCard key={subject.label} hex={hex} department={department} subject={subject} index={index} analysis={analysis} />)}</div>
    <div className="twocol"><div className="info-card"><h3>รูปทรงที่เข้ากับสาขานี้</h3><div className="chip-list">{department.shapes.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div><div className="info-card"><h3>วัตถุที่มักปรากฏในงาน</h3><div className="chip-list">{department.objects.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div></div>
  </>;
}
