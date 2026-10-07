'use client';

import { useEffect, useRef, useState } from 'react';

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

export default function CameraFocus({ onColorExtracted }) {
  const video = useRef(null), file = useRef(null), [stream, setStream] = useState(null), [image, setImage] = useState(null), [message, setMessage] = useState('ระบบจะค้นหาบริเวณในภาพที่มีสีใกล้เคียงกับ Selected Color');
  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  const sampleFocusColor = (event) => {
    const source = event.currentTarget;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = source.naturalWidth || source.videoWidth;
    const height = source.naturalHeight || source.videoHeight;
    const sampleWidth = Math.max(1, Math.floor(width * 0.3));
    const sampleHeight = Math.max(1, Math.floor(height * 0.3));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    context.drawImage(source, (width - sampleWidth) / 2, (height - sampleHeight) / 2, sampleWidth, sampleHeight, 0, 0, sampleWidth, sampleHeight);
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    let red = 0, green = 0, blue = 0, count = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 128) continue;
      red += pixels[index]; green += pixels[index + 1]; blue += pixels[index + 2]; count += 1;
    }
    if (!count) return;
    const hex = rgbToHex(Math.round(red / count), Math.round(green / count), Math.round(blue / count));
    onColorExtracted(hex);
    setMessage(`โฟกัสสีตรงกลางภาพ: ${hex.toUpperCase()}`);
  };
  const openCamera = async () => { try { const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }); setStream(next); video.current.srcObject = next; setMessage('กล้องพร้อมแล้ว — กด “ถ่ายภาพ” เพื่อเลือกภาพ'); } catch { setMessage('ไม่สามารถเปิดกล้องได้ โปรดอนุญาตสิทธิ์กล้องและเปิดผ่าน HTTPS'); } };
  const capture = () => { const canvas = document.createElement('canvas'); canvas.width = video.current.videoWidth; canvas.height = video.current.videoHeight; canvas.getContext('2d').drawImage(video.current, 0, 0); setImage(canvas.toDataURL()); stream?.getTracks().forEach((track) => track.stop()); setStream(null); setMessage('กำลังอ่านสีจากจุดโฟกัสตรงกลางภาพ...'); };
  const clearImage = () => {
    if (image?.startsWith('blob:')) URL.revokeObjectURL(image);
    setImage(null);
    if (file.current) file.current.value = '';
    onColorExtracted(null);
    setMessage('ระบบจะค้นหาบริเวณในภาพที่มีสีใกล้เคียงกับ Selected Color');
  };
  return <><div className="step-label spaced"><span className="step-num">03</span>Color Focus</div><div className="step-title">Camera Color Focus</div><div className="focus-canvas-wrap">{stream && <video ref={video} autoPlay playsInline muted />} {image && <img src={image} alt="Selected color focus" onLoad={sampleFocusColor} />} {!stream && !image && <div className="focus-empty">ยังไม่มีภาพ — เปิดกล้อง ถ่ายภาพ หรือเลือกรูป</div>} {(stream || image) && <div className="focus-target" aria-hidden="true"><span /></div>}</div><div className="focus-btn-row"><button className="focus-btn" onClick={openCamera}>📷 เปิดกล้อง</button><button className="focus-btn" disabled={!stream} onClick={capture}>📸 ถ่ายภาพ</button><button className="focus-btn" onClick={() => file.current.click()}>🖼️ เลือกรูป</button>{image && <button className="focus-btn" onClick={clearImage}>🗑️ ลบรูป</button>}<input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const selected = e.target.files?.[0]; if (selected) { if (image?.startsWith('blob:')) URL.revokeObjectURL(image); setImage(URL.createObjectURL(selected)); setMessage('กำลังอ่านสีจากจุดโฟกัสตรงกลางภาพ...'); } }} /></div><div className="focus-status">{message}</div></>;
}
