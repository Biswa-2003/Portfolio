// app/components/ContactForm.jsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState({ type: "idle", msg: "" });
  const [pending, setPending] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (pending) return;

    // ✅ Save the element before any await to avoid event pooling issues
    const formEl = e.currentTarget;

    const form = new FormData(formEl);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    // Honeypot + time to submit
    const hp = String(form.get("company") || "");
    const tts = Date.now() - startedAt.current;

    if (!name || !email || !message) {
      setStatus({ type: "error", msg: "Please fill out all fields." });
      return;
    }

    setPending(true);
    setStatus({ type: "loading", msg: "Sending…" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, hp, tts }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send. Try again later.");
      }

      // ✅ Use saved element to reset
      formEl.reset();
      startedAt.current = Date.now();
      setStatus({ type: "success", msg: "Thanks! I’ll get back to you soon." });
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="row g-3">
        <div className="col-sm-6">
          <label htmlFor="c_name" className="form-label small">Your Name</label>
          <input
            id="c_name"
            name="name"
            className="form-control f2-input"
            placeholder="Enter your name"
            disabled={pending}
            required
          />
        </div>

        <div className="col-sm-6">
          <label htmlFor="c_email" className="form-label small">Your Email</label>
          <input
            id="c_email"
            name="email"
            type="email"
            className="form-control f2-input"
            placeholder="Enter your email"
            disabled={pending}
            required
          />
        </div>

        <div className="col-12">
          <label htmlFor="c_msg" className="form-label small">Message</label>
          <textarea
            id="c_msg"
            name="message"
            rows={5}
            className="form-control f2-input"
            placeholder="Write your message"
            disabled={pending}
            required
          />
        </div>

        {/* Honeypot (keep empty) */}
        <div aria-hidden="true" className="visually-hidden">
          <label htmlFor="c_company">Company</label>
          <input id="c_company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="col-12 d-flex align-items-center gap-3">
          <button type="submit" className="f2-btn px-4 py-2 ms-auto" disabled={pending}>
            {pending ? "Sending…" : "Submit Now"}
          </button>

          {status.type !== "idle" && (
            <span
              className={`small ${
                status.type === "error" ? "text-danger"
                  : status.type === "success" ? "text-success"
                  : "text-muted"
              }`}
              role="status"
              aria-live="polite"
            >
              {status.msg}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
