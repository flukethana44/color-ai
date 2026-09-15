'use client';

import { useEffect, useRef, useState } from 'react';

export default function CameraFocus() {
  const video = useRef(null), file = useRef(null), [stream, setStream] = useState(null), [image, setImage] = useState(null), [message, setMessage] = useState('ระบบจะค้นหาบริเวณในภาพที่มีสีใกล้เคียงกับ Selected Color');
  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  const openCamera = async () => { try { const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }); setStream(next); video.current.srcObject = next; setMessage('กล้องพร้อมแล้ว — กด “ถ่ายภาพ” เพื่อเลือกภาพ'); } catch { setMessage('ไม่สามารถเปิดกล้องได้ โปรดอนุญาตสิทธิ์กล้องและเปิดผ่าน HTTPS'); } };
  const capture = () => { const canvas = document.createElement('canvas'); canvas.width = video.current.videoWidth; canvas.height = video.current.videoHeight; canvas.getContext('2d').drawImage(video.current, 0, 0); setImage(canvas.toDataURL()); stream?.getTracks().forEach((track) => track.stop()); setStream(null); setMessage('เลือกภาพแล้ว — พร้อมใช้เป็น Color Focus'); };
  const clearImage = () => {
    if (image?.startsWith('blob:')) URL.revokeObjectURL(image);
    setImage(null);
    if (file.current) file.current.value = '';
    setMessage('ระบบจะค้นหาบริเวณในภาพที่มีสีใกล้เคียงกับ Selected Color');
  };
  return <><div className="step-label spaced"><span className="step-num">3</span>Color Focus</div><div className="step-title">Camera Color Focus</div><div className="focus-canvas-wrap">{stream && <video ref={video} autoPlay playsInline muted />} {image && <img src={image} alt="Selected color focus" />} {!stream && !image && <div className="focus-empty">ยังไม่มีภาพ — เปิดกล้อง ถ่ายภาพ หรือเลือกรูป</div>}</div><div className="focus-btn-row"><button className="focus-btn" onClick={openCamera}>📷 เปิดกล้อง</button><button className="focus-btn" disabled={!stream} onClick={capture}>📸 ถ่ายภาพ</button><button className="focus-btn" onClick={() => file.current.click()}>🖼️ เลือกรูป</button>{image && <button className="focus-btn" onClick={clearImage}>🗑️ ลบรูป</button>}<input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const selected = e.target.files?.[0]; if (selected) { if (image?.startsWith('blob:')) URL.revokeObjectURL(image); setImage(URL.createObjectURL(selected)); setMessage('เลือกรูปแล้ว — พร้อมใช้เป็น Color Focus'); } }} /></div><div className="focus-status">{message}</div></>;
}
