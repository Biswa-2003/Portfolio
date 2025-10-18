// app/api/contact/route.js
export const runtime = "nodejs";

import nodemailer from "nodemailer";

/* ---------- Simple in-memory rate limiter ---------- */
const BUCKET = new Map(); // key: ip -> { count, resetAt }
const LIMIT = 5;          // 5 messages
const WINDOW_MS = 60_000; // per minute

/* ---------- Helpers ---------- */
const { MAIL_FROM, MAIL_TO, MAIL_APP_PASSWORD } = process.env;

function requireEnv() {
  const missing = [];
  if (!MAIL_FROM) missing.push("MAIL_FROM");
  if (!MAIL_APP_PASSWORD) missing.push("MAIL_APP_PASSWORD");
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(", ")}`);
  }
}

function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(v) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(String(v).toLowerCase());
}

/* ---------- Route ---------- */
export async function POST(req) {
  try {
    requireEnv();

    const { name, email, message, hp, tts } = await req.json();

    // Honeypot
    if (hp && String(hp).trim() !== "") {
      return Response.json({ ok: false, error: "Blocked." }, { status: 400 });
    }
    // Time-to-submit guard
    if (typeof tts === "number" && tts < 800) {
      return Response.json({ ok: false, error: "Too fast." }, { status: 400 });
    }

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "All fields are required." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return Response.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }
    if (message.length > 2000) {
      return Response.json(
        { ok: false, error: "Message too long." },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = getClientIp(req);
    const now = Date.now();
    const b = BUCKET.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
    if (now > b.resetAt) {
      b.count = 0;
      b.resetAt = now + WINDOW_MS;
    }
    b.count += 1;
    BUCKET.set(ip, b);
    if (b.count > LIMIT) {
      return Response.json(
        { ok: false, error: "Too many requests. Try later." },
        { status: 429 }
      );
    }

    // Transport (Gmail SMTP with App Password)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: MAIL_FROM,
        pass: MAIL_APP_PASSWORD,
      },
    });

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>IP:</strong> ${escapeHTML(ip)}</p>
        <p><strong>Submitted in:</strong> ${Number(tts || 0)} ms</p>
        <hr/>
        <p>${escapeHTML(message).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${MAIL_FROM}>`,
      to: MAIL_TO || MAIL_FROM,
      replyTo: email,
      subject: `New message from ${name}`,
      html,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("CONTACT_API_ERROR:", err);
    return Response.json(
      { ok: false, error: "Failed to send. Try again later." },
      { status: 500 }
    );
  }
}
