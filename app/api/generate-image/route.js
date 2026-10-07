import { NextResponse } from 'next/server';
import { colorNameEN } from '../../../lib/color';

export const runtime = 'nodejs';
export const maxDuration = 60;

const hexPattern = /^#[0-9A-Fa-f]{6}$/;
const clean = (value, length) => typeof value === 'string' ? value.replace(/[\r\n<>`"{}]/g, ' ').trim().slice(0, length) : '';
const cleanList = (value, length = 8) => Array.isArray(value) ? value.slice(0, length).map((item) => clean(item, 60)).filter(Boolean) : [];
const isPlaceholder = (value) => !value || /your[-_ ]?(key|token)|ใส่|ที่นี่|here/i.test(value);
const escapeXml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const COLOR_NAME_MAP = {
  'deep navy': '#0F172A',
  navy: '#0F172A',
  charcoal: '#1F2937',
  'muted grey': '#5C6874',
  'soft neutral grey': '#E5E7EB',
  'off-white': '#F5F5F4',
  'warm grey': '#A39A8A',
  'neutral grey': '#7B7E82',
  'light grey': '#D1D5DB',
  ivory: '#F6F1E8',
  white: '#FFFFFF',
  black: '#111111',
  'soft blue': '#A5D8FF',
  'dark blue': '#111827',
  'forest green': '#1F4D3A',
  'earth brown': '#6B4F3D',
  olive: '#6F7D4D',
};

function normalizeColor(value, fallback = '#101827') {
  if (!value) return fallback;
  const cleaned = String(value).trim();
  if (hexPattern.test(cleaned)) return cleaned.toUpperCase();
  const match = COLOR_NAME_MAP[cleaned.toLowerCase()];
  if (match) return match;
  if (cleaned.startsWith('#') && /^#[0-9A-Fa-f]{3,8}$/.test(cleaned)) {
    const hex = cleaned.replace('#', '');
    return `#${hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex}`.toUpperCase();
  }
  const fallbackMatch = COLOR_NAME_MAP[fallback.toLowerCase()];
  return fallbackMatch || fallback;
}

function buildLocalArtwork({ hex, department, subject, colorRole, colorTemperature, backgroundColor, style, shapes }) {
  const accent = normalizeColor(hex, '#FF0036').toUpperCase();
  const bg1 = normalizeColor(backgroundColor, '#0F172A');
  const bg2 = bg1 === '#F5F5F4' || bg1 === '#E5E7EB' || bg1 === '#F6F1E8' ? '#111827' : '#1F2937';
  const subjectText = escapeXml(subject || 'Concept');
  const deptText = escapeXml(department || 'Creative');
  const roleText = escapeXml(colorRole || 'Primary Color');
  const tempText = escapeXml(colorTemperature || 'Balanced');
  const styleText = escapeXml((style && style[0]) || 'Modern');
  const shapeText = escapeXml((shapes && shapes[0]) || 'Geometric');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="${accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
        <filter id="blurGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
      </defs>

      <rect width="768" height="768" fill="url(#bg)"/>
      <circle cx="630" cy="150" r="190" fill="url(#glow)" filter="url(#blurGlow)"/>
      <circle cx="190" cy="640" r="200" fill="#FFFFFF" opacity="0.08"/>
      <path d="M0 620 C120 550, 210 700, 360 620 S620 520, 768 630 L768 768 L0 768 Z" fill="#FFFFFF" opacity="0.04"/>

      <g filter="url(#softShadow)">
        <rect x="95" y="110" width="592" height="560" rx="36" fill="#FFFFFF" opacity="0.04" stroke="#FFFFFF" stroke-opacity="0.14"/>
        <rect x="120" y="170" width="290" height="290" rx="42" fill="${accent}" opacity="0.96"/>
        <path d="M450 200 L585 200 L585 420 L450 420 Z" fill="#FFFFFF" opacity="0.10"/>
        <path d="M446 250 L600 250" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="18" stroke-linecap="round"/>
        <path d="M446 290 L570 290" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="18" stroke-linecap="round"/>
        <path d="M446 330 L595 330" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="18" stroke-linecap="round"/>
        <rect x="445" y="380" width="120" height="120" rx="24" fill="#FFFFFF" opacity="0.12"/>
        <rect x="150" y="495" width="150" height="16" rx="8" fill="#FFFFFF" opacity="0.9"/>
        <rect x="150" y="530" width="210" height="16" rx="8" fill="#FFFFFF" opacity="0.65"/>
        <rect x="150" y="565" width="165" height="16" rx="8" fill="#FFFFFF" opacity="0.4"/>
        <path d="M450 475 C495 430, 560 440, 600 500 L600 530 L450 530 Z" fill="#FFFFFF" opacity="0.14"/>
      </g>

      <text x="120" y="628" fill="#FFFFFF" font-size="40" font-family="Arial, sans-serif" font-weight="700">${subjectText}</text>
      <text x="120" y="664" fill="#FFFFFF" font-size="20" font-family="Arial, sans-serif" opacity="0.8">${deptText} • ${roleText}</text>
      <text x="120" y="692" fill="#FFFFFF" font-size="16" font-family="Arial, sans-serif" opacity="0.6">${styleText} • ${tempText} • ${shapeText}</text>
      <text x="120" y="718" fill="${accent}" font-size="20" font-family="Arial, sans-serif" font-weight="700">${accent}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function requestHuggingFace(prompt, signal) {
  const model = process.env.HF_IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell';
  const response = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: model.toLowerCase().includes('schnell') ? 4 : 28 } }),
    signal,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(clean(payload?.error, 240) || 'Hugging Face ไม่สามารถสร้างภาพได้ในขณะนี้');
  }
  const contentType = response.headers.get('content-type') || 'image/png';
  const image = Buffer.from(await response.arrayBuffer()).toString('base64');
  return `data:${contentType};base64,${image}`;
}

async function requestOpenAI(prompt, signal) {
  const response = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.IMAGE_MODEL || 'gpt-image-1', prompt, size: process.env.IMAGE_SIZE || '1024x1024', n: 1, output_format: 'png' }), signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(clean(payload?.error?.message, 240) || 'OpenAI ไม่สามารถสร้างภาพได้ในขณะนี้');
  const first = payload.data?.[0];
  return first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url;
}

async function requestCloudflare(prompt, signal) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/black-forest-labs/flux-1-schnell';
  if (!/^@[\w.-]+(?:\/[\w.-]+)+$/.test(model)) {
    throw new Error('CLOUDFLARE_AI_MODEL มีรูปแบบไม่ถูกต้อง');
  }
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
    signal,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const apiError = Array.isArray(payload.errors) ? payload.errors.map((item) => item.message).filter(Boolean).join('; ') : '';
    throw new Error(clean(apiError || payload.error?.message || payload.message, 240) || 'Cloudflare Workers AI ไม่สามารถสร้างภาพได้ในขณะนี้');
  }

  const image = payload.result?.image || payload.result?.data?.[0]?.b64_json;
  if (typeof image !== 'string' || !image) {
    throw new Error('Cloudflare Workers AI ไม่ได้ส่งข้อมูลภาพกลับมา');
  }
  return image.startsWith('data:') ? image : `data:image/jpeg;charset=utf-8;base64,${image}`;
}

async function requestModelArk(prompt, signal) {
  const baseUrl = (process.env.MODELARK_BASE_URL || 'https://ark.ap-southeast-1.bytepluses.com/api/v3').replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MODELARK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.MODELARK_IMAGE_MODEL || 'seedream-4-0-250828',
      prompt,
      response_format: 'url',
      size: process.env.MODELARK_IMAGE_SIZE || '2K',
    }),
    signal,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(clean(payload?.error?.message || payload?.message, 240) || 'ModelArk ไม่สามารถสร้างภาพได้ในขณะนี้');
  }
  const first = payload.data?.[0];
  if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
  return first?.url;
}

async function requestPollinations(prompt, signal) {
  // Return the hosted image URL so the browser loads the result directly.
  // This avoids buffering large generated images through the Next.js server.
  void signal;
  const compactPrompt = prompt.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').slice(0, 700);
  const seed = Math.floor(Math.random() * 1_000_000_000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(compactPrompt)}?model=flux&width=768&height=768&seed=${seed}&nologo=true`;
}

function localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor, style, shapes }) {
  return buildLocalArtwork({ hex, department, subject, colorRole, colorTemperature, backgroundColor, style, shapes });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const hex = clean(body.hex, 7), department = clean(body.department, 80), subject = clean(body.subject, 80), variation = clean(body.variation, 160), colorRole = clean(body.colorRole, 40), colorTemperature = clean(body.colorTemperature, 30), backgroundColor = clean(body.backgroundColor, 100), contrastGuidance = clean(body.contrastGuidance, 120);
    const variationIndex = Number.isInteger(body.variationIndex) ? body.variationIndex : 1;
    if (!hexPattern.test(hex) || !department || !subject) return NextResponse.json({ error: 'ข้อมูลสี สาขา หรือหัวข้อไม่ถูกต้อง' }, { status: 400 });

    const style = cleanList(body.style), shapes = cleanList(body.shapes), objects = cleanList(body.objects);
    if (body.fallbackOnly === true) {
      return NextResponse.json({
        image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }),
        fallback: true,
      });
    }

    const subjectDirections = {
      House: 'Show one complete house exterior with a clearly readable roof, walls, windows, entrance, and surrounding site. Use an architectural visualization, not an abstract close-up.',
      Building: 'Show one complete building exterior with its overall massing, floors, windows, and relationship to the ground. Keep the building as the unmistakable focal point.',
      'Floor Plan': 'Show a complete, crisp 2D architectural floor plan from a strict top-down orthographic view, with room divisions, walls, doors, windows, and simple furniture symbols. Keep the entire plan in frame; no perspective, close-up, or photorealistic wall texture.',
      Facade: 'Show the full front elevation of a building facade, straight-on, with a clear window rhythm, material changes, and visible building edges. Do not crop into an abstract wall close-up.',
      'City Planning': 'Show a legible top-down urban master plan with a connected street network, distinct blocks, and clearly separated land-use zones. Keep the full plan visible and map-like.',
      'Master Plan': 'Show a complete top-down site master plan with paths, building footprints, green spaces, and clear spatial zones. Keep it orthographic and map-like, not a perspective city render.',
      'Road Network': 'Show a clear top-down transport plan with connected roads, intersections, and a visible hierarchy of routes. Keep the whole network in frame and avoid perspective views.',
      'Public Space': 'Show a recognizable public plaza or park at human scale, with paths, planting, seating, and people for scale. Make the public space the clear subject.',
    };
    const subjectDirection = subjectDirections[subject] || `Create a clearly recognizable image of "${subject}" as the single main subject.`;
    const accentPlacements = {
      'Floor Plan': 'Fill a few plan zones or the primary circulation path with this color while keeping walls and other rooms white or gray.',
      Facade: 'Use it on a large, clearly painted facade panel or vertical fins; do not substitute it with wood, tan, or beige cladding.',
      House: 'Use it on a prominent painted entrance, roof section, or facade panel.',
      Building: 'Use it on a prominent painted facade panel while keeping the remaining building surfaces neutral.',
      'City Planning': 'Use it to fill selected land-use zones or mark the primary route.',
      'Master Plan': 'Use it to fill selected site zones or paths.',
      'Road Network': 'Use it to mark the primary route with a bold line against neutral surrounding blocks.',
    }[subject] || 'Apply it to one clearly defined focal element.';
    const requestedColor = `${colorNameEN(hex).toLowerCase()} (${hex.toUpperCase()})`;
    const colorDirection = colorRole === 'Accent Color'
      ? `Use vivid, saturated ${requestedColor} as an unmistakable accent, clearly visible at thumbnail size and not reduced to a pale tint or material color. ${accentPlacements} Keep other surfaces neutral white, gray, or navy.`
      : `Use ${requestedColor} as the ${colorRole || 'Primary Color'} and make its role visually obvious.`;
    const structuredSubjects = ['Floor Plan', 'City Planning', 'Master Plan', 'Road Network'];
    const variationDirection = structuredSubjects.includes(subject)
      ? 'Use a complete, legible orthographic composition; do not apply close-up, perspective, or flat-lay camera variations.'
      : `Composition variation ${variationIndex}: ${variation || 'use a clear, subject-appropriate composition'}. Keep the subject unmistakable.`;
    const prompt = [
      `Create a polished, realistic design concept image for ${department}.`,
      `Main subject: ${subject}. ${subjectDirection}`,
      colorDirection,
      `Color temperature: ${colorTemperature || 'Balanced'}. Supporting background: ${backgroundColor || 'neutral grey'}. ${contrastGuidance || 'Maintain clear contrast.'}`,
      variationDirection,
      style.length && `Visual style: ${style.join(', ')}.`,
      shapes.length && `Use this supporting form only if it reinforces the subject: ${shapes.join(', ')}.`,
      objects.length && `Include this relevant object only if it reinforces the subject: ${objects.join(', ')}.`,
      'Prioritize a sharp, readable subject and coherent real-world structure. Avoid blur, unrelated objects, decorative mockups, and abstract imagery that obscures the subject.',
    ].filter(Boolean).join(' ');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55_000);
    const provider = (process.env.IMAGE_PROVIDER || 'local').toLowerCase();
    if (provider === 'local') {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }) });
    }
    if (provider === 'pollinations') {
      try {
        const image = await requestPollinations(prompt, controller.signal);
        return NextResponse.json({ image });
      } catch (error) {
        return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: error.message || 'ใช้ภาพ fallback เนื่องจาก provider ภายนอกถูกปฏิเสธ' });
      } finally {
        clearTimeout(timeout);
      }
    }
    if (provider === 'huggingface' && isPlaceholder(process.env.HF_TOKEN)) {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: 'HF_TOKEN ยังไม่ได้ตั้งค่า จึงใช้ภาพ fallback แทน' });
    }
    if (provider === 'openai' && isPlaceholder(process.env.OPENAI_API_KEY)) {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: 'OPENAI_API_KEY ยังไม่ได้ตั้งค่า จึงใช้ภาพ fallback แทน' });
    }
    if (provider === 'modelark' && isPlaceholder(process.env.MODELARK_API_KEY)) {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: 'ยังไม่ได้ตั้งค่า MODELARK_API_KEY จึงใช้ภาพสำรองแทน' });
    }
    if (provider === 'cloudflare' && (isPlaceholder(process.env.CLOUDFLARE_ACCOUNT_ID) || isPlaceholder(process.env.CLOUDFLARE_API_TOKEN))) {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: 'ยังไม่ได้ตั้งค่า CLOUDFLARE_ACCOUNT_ID หรือ CLOUDFLARE_API_TOKEN จึงใช้ภาพสำรองแทน' });
    }
    try {
      if (!['huggingface', 'openai', 'modelark', 'cloudflare'].includes(provider)) {
        return NextResponse.json({ error: `ไม่รู้จัก IMAGE_PROVIDER: ${provider}` }, { status: 400 });
      }
      const image = provider === 'huggingface'
        ? await requestHuggingFace(prompt, controller.signal)
        : provider === 'openai'
          ? await requestOpenAI(prompt, controller.signal)
          : provider === 'modelark'
            ? await requestModelArk(prompt, controller.signal)
            : await requestCloudflare(prompt, controller.signal);
      if (!image) return NextResponse.json({ error: 'ไม่ได้รับข้อมูลภาพจาก AI API' }, { status: 502 });
      return NextResponse.json({ image });
    } catch (error) {
      return NextResponse.json({ image: localFallbackImage({ hex, department, subject, colorRole, colorTemperature, backgroundColor: backgroundColor || '#101827', style, shapes }), warning: error.message || 'ไม่สามารถสร้างภาพจาก AI provider ได้ จึงใช้ภาพ fallback แทน' });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'การสร้างภาพใช้เวลานานเกินไป กรุณาลองใหม่' : 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
