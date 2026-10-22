"use client";

import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--ink)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "clamp(24px, 4vw, 40px) clamp(16px, 4vw, 80px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "1.0625rem",
          color: "var(--warm-white)",
        }}
      >
        Velysium
      </span>

      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <a
          href="mailto:contact@velysium-projects.me"
          className="draw-underline"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ash)",
            textDecoration: "none",
            fontFamily: "'Space Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.25s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--warm-white)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ash)")}
        >
          contact@velysium-projects.me <ArrowUpRight size={11} strokeWidth={1.5} />
        </a>

        <span
          className="font-mono"
          style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}
        >
          © 2025 Velysium
        </span>
      </div>
    </footer>
  );
}
