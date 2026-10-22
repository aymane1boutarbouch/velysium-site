"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import SplitHeading from "./SplitHeading";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSolutionName, setSelectedSolutionName] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Listen for demo request events from modal
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ solutionName: string; inquiryText: string }>;
      setSelectedSolutionName(ev.detail.solutionName);
      setMessage(ev.detail.inquiryText);
      setTimeout(() => document.getElementById("contact-name")?.focus(), 300);
    };
    window.addEventListener("velysium:request-demo", handler);
    return () => window.removeEventListener("velysium:request-demo", handler);
  }, []);

  // Clip-path wipe on enter + bg colour shift
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 92%",
        onEnter: () => {
          gsap.fromTo(
            sectionRef.current,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "power4.inOut",
            }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Velysium — Message de ${name}`);
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:contact@velysium-projects.me?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 0,
    backgroundColor: "transparent",
    fontSize: "0.9375rem",
    color: "var(--warm-white)",
    fontFamily: "Inter, sans-serif",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.25s",
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        padding: "clamp(64px, 8vw, 140px) clamp(16px, 4vw, 80px)",
        backgroundColor: "var(--ink)",
        color: "var(--warm-white)",
        clipPath: "inset(0 0 100% 0)", // starts clipped
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(40px, 6vw, 100px)",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div>
          <p className="section-label" style={{ marginBottom: 20, color: "var(--ash)" }}>
            Contact
          </p>

          <SplitHeading
            as="h2"
            text="Construisons quelque chose de réel."
            italic
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 0.95,
              color: "var(--warm-white)",
              marginBottom: 36,
            }}
          />

          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "var(--ash)",
              fontWeight: 300,
              maxWidth: "36ch",
              marginBottom: 40,
            }}
          >
            Applications desktop métiers, automatisation comptable, agents IA souverains,
            audit cyber — nous livrons du code qui tourne, pas des prototypes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Email", value: "contact@velysium-projects.me", href: "mailto:contact@velysium-projects.me" },
              { label: "Location", value: "Casablanca, Maroc", href: null },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "baseline",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  paddingBottom: 14,
                }}
              >
                <span className="section-label" style={{ color: "var(--ash)", minWidth: 72 }}>
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="draw-underline"
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--warm-white)",
                      textDecoration: "none",
                      fontWeight: 300,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {item.value}
                    <ArrowUpRight size={12} strokeWidth={1.5} />
                  </a>
                ) : (
                  <span style={{ fontSize: "0.875rem", color: "var(--trace)", fontWeight: 300 }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          {sent ? (
            <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", gap: 16 }}>
              <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ash)", letterSpacing: "0.1em" }}>
                Message en file
              </span>
              <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "var(--warm-white)", fontWeight: 400 }}>
                On revient vers vous.
              </p>
            </div>
          ) : (
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              {selectedSolutionName && (
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={14} style={{ color: "var(--trace)" }} />
                    <span style={{ fontSize: "0.8125rem", color: "var(--warm-white)", fontWeight: 300 }}>
                      Demande pour : <strong style={{ fontWeight: 500 }}>{selectedSolutionName}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedSolutionName(null); setMessage(""); }}
                    style={{ background: "transparent", border: "none", color: "var(--ash)", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label htmlFor="contact-name" className="section-label" style={{ color: "var(--ash)", marginBottom: 4 }}>
                  Nom
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  style={{ ...inputStyle, borderBottomColor: name ? "var(--warm-white)" : "rgba(255,255,255,0.12)" }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--warm-white)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = name ? "var(--warm-white)" : "rgba(255,255,255,0.12)"; }}
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label htmlFor="contact-email" className="section-label" style={{ color: "var(--ash)", marginBottom: 4 }}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  style={{ ...inputStyle, borderBottomColor: email ? "var(--warm-white)" : "rgba(255,255,255,0.12)" }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--warm-white)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = email ? "var(--warm-white)" : "rgba(255,255,255,0.12)"; }}
                />
              </div>

              {/* Message */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label htmlFor="contact-message" className="section-label" style={{ color: "var(--ash)", marginBottom: 4 }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre besoin."
                  rows={4}
                  style={{ ...inputStyle, resize: "none", borderBottomColor: message ? "var(--warm-white)" : "rgba(255,255,255,0.12)" }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--warm-white)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = message ? "var(--warm-white)" : "rgba(255,255,255,0.12)"; }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 3,
                  backgroundColor: "transparent",
                  color: "var(--warm-white)",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono', monospace",
                  cursor: "pointer",
                  transition: "border-color 0.25s, background-color 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                Envoyer <ArrowUpRight size={14} strokeWidth={1.5} />
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
