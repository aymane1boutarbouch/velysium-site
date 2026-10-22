"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Approche", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  // Magnetic CTA on mount
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;

    const handleMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.4, ease: "power2.out" });
    };
    const handleLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    btn.addEventListener("mousemove", handleMove);
    btn.addEventListener("mouseleave", handleLeave);
    return () => {
      btn.removeEventListener("mousemove", handleMove);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: "0 clamp(24px, 5vw, 80px)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: scrolled ? "rgba(250, 248, 244, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
        transition: "background-color 0.5s, border-color 0.5s, backdrop-filter 0.5s",
      }}
    >
      {/* Official Velysium Brand Logo */}
      <a
        href="#"
        id="nav-brand-link"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
        }}
      >
        <img
          id="nav-logo-mark"
          src="/assets/mark.svg"
          alt="Velysium Emblem"
          style={{ width: 32, height: 25, objectFit: "contain" }}
        />
        <img
          src="/assets/wordmark.svg"
          alt="Velysium"
          style={{ height: 15, width: "auto", objectFit: "contain" }}
        />
      </a>

      {/* Links */}
      <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}

        {/* Magnetic CTA */}
        <a
          ref={ctaRef}
          href="#contact"
          className="magnetic-btn"
          style={{
            padding: "8px 20px",
            border: "1px solid var(--ink)",
            borderRadius: 3,
            fontSize: "0.8125rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
            fontFamily: "'Space Mono', monospace",
            backgroundColor: "transparent",
            transition: "background 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ink)";
            (e.currentTarget as HTMLElement).style.color = "var(--warm-white)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--ink)";
          }}
        >
          Démo
        </a>
      </nav>
    </motion.header>
  );
}
