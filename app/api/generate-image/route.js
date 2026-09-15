import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const hexPattern = /^#[0-9A-Fa-f]{6}$/;
const clean = (value, length) => typeof value === 'string' ? value.replace(/[\r\n<>`"{}]/g, ' ').trim().slice(0, length) : '';
const cleanList = (value, length = 8) => Array.isArray(value) ? value.slice(0, length).map((item) => clean(item, 60)).filter(Boolean) : [];

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'ยังไม่ได้ตั้งค่า OPENAI_API_KEY บนเซิร์ฟเวอร์' }, { status: 500 });
    const body = await request.json();
    const hex = clean(body.hex, 7), department = clean(body.department, 80), subject = clean(body.subject, 80);
    if (!hexPattern.test(hex) || !department || !subject) return NextResponse.json({ error: 'ข้อมูลสี สาขา หรือหัวข้อไม่ถูกต้อง' }, { status: 400 });

    const style = cleanList(body.style), shapes = cleanList(body.shapes), objects = cleanList(body.objects);
    const prompt = [
      `Create a polished professional design concept visual for the field of "${department}".`,
      `The subject must clearly depict: ${subject}.`,
      `Use exactly ${hex.toUpperCase()} as the dominant color across the image.`,
      style.length && `Visual style: ${style.join(', ')}.`,
      shapes.length && `Incorporate forms: ${shapes.join(', ')}.`,
      objects.length && `Relevant elements: ${objects.join(', ')}.`,
      'Avoid unrelated generic imagery.',
    ].filter(Boolean).join(' ');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55_000);
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.IMAGE_MODEL || 'gpt-image-1', prompt, size: process.env.IMAGE_SIZE || '1024x1024', n: 1, output_format: 'png' }), signal: controller.signal });
    } finally { clearTimeout(timeout); }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerError = clean(payload?.error?.message, 240);
      return NextResponse.json({ error: providerError || 'ไม่สามารถสร้างภาพได้ในขณะนี้' }, { status: response.status >= 400 && response.status < 500 ? response.status : 502 });
    }
    const first = payload.data?.[0];
    const image = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url;
    if (!image) return NextResponse.json({ error: 'ไม่ได้รับข้อมูลภาพจาก AI API' }, { status: 502 });
    return NextResponse.json({ image });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'การสร้างภาพใช้เวลานานเกินไป กรุณาลองใหม่' : 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
