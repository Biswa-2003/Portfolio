export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const BUCKET = new Map();
const LIMIT = 5;
const WINDOW_MS = 60_000;

function escapeHTML(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).toLowerCase());
}

export async function POST(req) {
  try {
    const { MAIL_FROM, MAIL_TO, MAIL_APP_PASSWORD } = process.env;

    // Minimal env guards
    if (!MAIL_FROM || !MAIL_APP_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: 'MAIL_FROM or MAIL_APP_PASSWORD missing on server.' },
        { status: 500 }
      );
    }

    const { name, email, message, hp, tts } = await req.json();

    // Bot & validation
    if (hp && String(hp).trim() !== '') {
      return NextResponse.json({ ok: false, error: 'Blocked.' }, { status: 400 });
    }
    if (typeof tts === 'number' && tts < 800) {
      return NextResponse.json({ ok: false, error: 'Too fast.' }, { status: 400 });
    }
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'All fields required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
    }

    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const b = BUCKET.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
    if (now > b.resetAt) { b.count = 0; b.resetAt = now + WINDOW_MS; }
    b.count += 1; BUCKET.set(ip, b);
    if (b.count > LIMIT) {
      return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429 });
    }

    // --- Gmail SMTP (option A: port 465 / secure) ---
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // TLS on connect
      auth: {
        user: MAIL_FROM,            // MUST be the same account you created the app password for
        pass: MAIL_APP_PASSWORD,    // 16-char app password (no spaces)
      },
    });

    // If your network blocks 465, use option B (uncomment and comment option A):
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 587,
    //   secure: false,          // STARTTLS
    //   requireTLS: true,
    //   auth: { user: MAIL_FROM, pass: MAIL_APP_PASSWORD },
    // });

    // Helpful during setup: fail fast if auth is wrong
    await transporter.verify().catch((e) => {
      // Surface a concise reason to the logs
      console.error('SMTP_VERIFY_FAILED:', e?.code, e?.responseCode, e?.response);
      throw e;
    });

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;margin:0">${escapeHTML(message)}</pre>
      </div>
    `;

    await transporter.sendMail({
      from: `"Portfolio" <${MAIL_FROM}>`,      // from must match the auth user for Gmail
      to: MAIL_TO || MAIL_FROM,
      subject: `New message from ${name}`,
      html,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('CONTACT_API_ERROR:', err);
    // Don’t leak raw Gmail messages to client
    return NextResponse.json(
      { ok: false, error: 'Email send failed. Check SMTP credentials/logins.' },
      { status: 500 }
    );
  }
}
