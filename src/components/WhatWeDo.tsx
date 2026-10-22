"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitHeading from "./SplitHeading";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    number: "I",
    title: "Engineering",
    lines: [
      "Applications desktop haute performance et moteurs OCR déployés en local.",
      "Vos données comptables et sensibles ne quittent jamais vos ordinateurs.",
    ],
    solutions: ["Velysium Accounting Invoices", "Velysium HR & Attestation Suite"],
  },
  {
    number: "II",
    title: "Enterprise",
    lines: [
      "Solutions taillées pour les cabinets d'expertise comptable, fiduciaires et directions juridiques marocaines.",
      "Conformité intégrale au PCGM et au Code du Travail.",
    ],
    solutions: ["Velysium Accounting Invoices", "Velysium Corporate Legal Suite"],
  },
  {
    number: "III",
    title: "Intelligence",
    lines: [
      "Flottes d'agents IA autonomes entraînés sur vos flux métiers. Audit d'exposition cyber sur 285+ vecteurs.",
      "Souveraineté absolue — zéro fuite vers des LLM publics.",
    ],
    solutions: ["Velysium Enterprise AI Workforce", "Velysium Cyber Exposure & Audit"],
  },
];

const stats = [
  { value: "5", label: "Applications Métiers" },
  { value: "100%", label: "Données Souveraines" },
  { value: "330+", label: "Workflows Prêts" },
  { value: "285+", label: "Vecteurs d'Audit" },
];

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clip-path wipe into this section from bottom
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 95%",
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

      // Staggered pillar reveal
      pillarsRef.current.forEach((pillar, i) => {
        if (!pillar) return;
        const lines = pillar.querySelectorAll(".pillar-line");
        gsap.set(lines, { y: 30, opacity: 0 });
        ScrollTrigger.create({
          trigger: pillar,
          start: "top 82%",
          onEnter: () => {
            gsap.to(lines, {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.9,
              ease: "power4.out",
              delay: i * 0.1,
            });
          },
          once: true,
        });
      });

      // Stats count-up on enter
      const statEls = statsRef.current?.querySelectorAll(".stat-num");
      if (statEls) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              statsRef.current,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power4.out",
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      style={{
        padding: "clamp(64px, 8vw, 140px) clamp(16px, 4vw, 80px)",
        backgroundColor: "var(--sand)",
        borderTop: "1px solid var(--rule)",
        clipPath: "inset(0 0 100% 0)", // starts clipped
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "clamp(48px, 6vw, 80px)" }}>
        <p className="section-label" style={{ marginBottom: 16 }}>
          Notre Approche
        </p>
        <SplitHeading
          as="h2"
          text="Trois piliers. Une discipline."
          italic
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            lineHeight: 1.05,
            maxWidth: "20ch",
          }}
        />
      </div>

      {/* Pillars grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(32px, 4vw, 60px)",
        }}
      >
        {pillars.map((pillar, i) => (
          <div
            key={pillar.number}
            ref={(el) => { if (el) pillarsRef.current[i] = el; }}
            style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <span
              className="pillar-line font-mono"
              style={{ fontSize: "0.75rem", color: "var(--trace)", letterSpacing: "0.12em" }}
            >
              {pillar.number}
            </span>

            <h3
              className="pillar-line"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.015em",
                color: "var(--ink)",
                lineHeight: 1.1,
              }}
            >
              {pillar.title}
            </h3>

            <div className="pillar-line" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {pillar.lines.map((line, li) => (
                <p
                  key={li}
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    color: "var(--ash)",
                    fontWeight: 300,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="pillar-line" style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              <span className="section-label" style={{ marginBottom: 6 }}>Solutions</span>
              {pillar.solutions.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--ash)",
                    fontWeight: 300,
                    paddingLeft: 12,
                    borderLeft: "1px solid var(--rule)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div
        ref={statsRef}
        style={{
          marginTop: "clamp(60px, 8vw, 100px)",
          paddingTop: "clamp(32px, 4vw, 48px)",
          borderTop: "1px solid var(--rule)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 24,
          opacity: 0,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              className="stat-num"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span className="section-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
