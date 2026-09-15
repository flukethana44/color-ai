export function hexToRgb(hex) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}

export function rgbToHex(r, g, b) {
  const part = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function hexToHsv(hex) {
  let { r, g, b } = hexToRgb(hex); r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = delta === 0 ? 0 : max === r ? 60 * (((g - b) / delta) % 6) : max === g ? 60 * ((b - r) / delta + 2) : 60 * ((r - g) / delta + 4);
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 };
}

export function hsvToHex(h, s, v) {
  s /= 100; v /= 100; const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function hsl(hex) {
  let { r, g, b } = hexToRgb(hex); r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0, s = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = 60 * (max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4); if (h < 0) h += 360; }
  return { h, s: s * 100, l: l * 100 };
}

export function colorNameTH(hex) { const { h, s, l } = hsl(hex); const name = s < 12 ? (l > 85 ? 'ขาว' : l < 15 ? 'ดำ' : 'เทา') : h < 15 || h >= 345 ? 'แดง' : h < 45 ? 'ส้ม' : h < 70 ? 'เหลือง' : h < 170 ? 'เขียว' : h < 200 ? 'ฟ้าอมเขียว' : h < 255 ? 'น้ำเงิน' : h < 290 ? 'ม่วง' : 'ชมพู'; return s >= 12 && l > 75 ? `${name}อ่อน` : s >= 12 && l < 35 ? `${name}เข้ม` : s > 70 ? `${name}สดใส` : name; }
export function colorNameEN(hex) { const { h, s, l } = hsl(hex); return s < 12 ? (l > 85 ? 'White' : l < 15 ? 'Black' : 'Grey') : h < 15 || h >= 345 ? 'Red' : h < 45 ? 'Orange' : h < 70 ? 'Yellow' : h < 170 ? 'Green' : h < 200 ? 'Teal' : h < 255 ? 'Blue' : h < 290 ? 'Purple' : 'Pink'; }
export function toneAndMood(hex) { const { h, s, l } = hsl(hex); const tone = `${l > 72 ? 'Soft' : l < 32 ? 'Deep' : 'Balanced'} / ${s > 65 ? 'Vivid' : s < 25 ? 'Muted' : 'Fresh'}`; const mood = h < 15 || h >= 345 ? 'Bold / Energetic / Urgent' : h < 70 ? 'Warm / Friendly / Playful' : h < 170 ? 'Natural / Friendly / Digital' : h < 255 ? 'Calm / Clean / Trustworthy' : 'Creative / Imaginative'; return { tone, mood }; }
