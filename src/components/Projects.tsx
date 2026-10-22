"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { velysiumSolutions, VelysiumSolution } from "@/data/solutions";
import SolutionModal from "./SolutionModal";
import SplitHeading from "./SplitHeading";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CARD_WIDTH = 560; // px
const CARD_GAP = 32; // px
const PADDING = 80; // side padding

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [selectedSolution, setSelectedSolution] = useState<VelysiumSolution | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = track.querySelectorAll<HTMLElement>(".project-card");
    const totalCards = cards.length;

    // Main horizontal scroll pin (dynamic scroll distance based on track scrollWidth)
    const ctx = gsap.context(() => {
      const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance() + 150}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Slide track horizontally
      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      // Each card: scale + fade in/out as it crosses viewport center
      cards.forEach((card, i) => {
        const enterStart = i / totalCards;
        const exitStart = (i + 0.65) / totalCards;

        tl.fromTo(
          card,
          { scale: 0.86, opacity: 0.4 },
          { scale: 1, opacity: 1, ease: "power2.out" },
          enterStart
        );
        tl.to(card, { scale: 0.92, opacity: 0.5, ease: "power2.in" }, exitStart);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleRequestDemo = (solution: VelysiumSolution) => {
    setSelectedSolution(null);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("velysium:request-demo", {
          detail: { solutionName: solution.name, inquiryText: solution.demoInquiryText },
        })
      );
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="solutions"
        className="h-scroll-section"
        style={{
          height: "100vh",
          backgroundColor: "var(--warm-white)",
          overflow: "hidden",
        }}
      >
        {/* Section header */}
        <div
          ref={headingRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "clamp(72px, 8vw, 110px) clamp(16px, 4vw, 80px) 0",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <p className="section-label" style={{ marginBottom: "clamp(8px, 1.5vw, 14px)" }}>
            Solutions & Applications Métiers
          </p>
          <SplitHeading
            as="h2"
            text="Applications conçues pour opérer."
            italic
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              lineHeight: 1.08,
            }}
          />
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="h-scroll-track"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            paddingLeft: "clamp(16px, 4vw, 80px)",
            paddingRight: "clamp(16px, 4vw, 80px)",
            paddingTop: "clamp(140px, 20vh, 220px)",
            paddingBottom: "clamp(20px, 4vh, 40px)",
            gap: "clamp(16px, 3vw, 32px)",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {velysiumSolutions.map((sol, i) => (
            <ProjectCard
              key={sol.id}
              solution={sol}
              index={i}
              onSelect={() => setSelectedSolution(sol)}
            />
          ))}
        </div>
      </section>

      <SolutionModal
        solution={selectedSolution}
        onClose={() => setSelectedSolution(null)}
        onRequestDemo={handleRequestDemo}
      />
    </>
  );
}

function ProjectCard({
  solution,
  index,
  onSelect,
}: {
  solution: VelysiumSolution;
  index: number;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // 3D tilt on hover
  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(inner, {
        rotateX: -ny * 9,
        rotateY: nx * 9,
        transformPerspective: 900,
        ease: "power2.out",
        duration: 0.5,
      });
    };
    const onLeave = () => {
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.35)",
      });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const accent = [
    "#b07d4a", // accounting
    "#4a7db0", // HR
    "#7d4ab0", // legal
    "#4ab07d", // AI
    "#b04a4a", // cyber
  ][index % 5];

  return (
    <div
      ref={cardRef}
      className="project-card tilt-card"
      style={{
        width: "min(560px, calc(100vw - 36px))",
        maxWidth: 560,
        flexShrink: 0,
      }}
    >
      <div
        ref={innerRef}
        className="project-card-inner"
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        style={{
          height: "100%",
          padding: "clamp(20px, 3.5vw, 40px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 3,
          transformStyle: "preserve-3d",
          transition: "border-color 0.35s",
        }}
      >
        {/* Top area */}
        <div>
          {/* Accent dot + index */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "clamp(16px, 2.5vw, 28px)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: accent,
                flexShrink: 0,
              }}
            />
            <span className="font-mono" style={{ fontSize: "0.6875rem", color: "var(--ash)", letterSpacing: "0.1em" }}>
              {solution.index}
            </span>
            <span
              className="pill"
              style={{
                fontSize: "0.575rem",
                borderColor: "rgba(15,13,10,0.12)",
                color: "var(--ash)",
              }}
            >
              {solution.category}
            </span>
          </div>

          {/* Name */}
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.4rem, 3.2vw, 2.1rem)",
              fontWeight: 400,
              color: "var(--ink)",
              letterSpacing: "-0.018em",
              lineHeight: 1.15,
              marginBottom: "clamp(8px, 1.5vw, 14px)",
            }}
          >
            {solution.name}
          </h3>

          {/* Tagline */}
          <p
            style={{
              fontSize: "clamp(0.8125rem, 1.2vw, 0.9rem)",
              lineHeight: 1.58,
              color: "var(--ash)",
              fontWeight: 300,
              maxWidth: "44ch",
            }}
          >
            {solution.tagline}
          </p>
        </div>

        {/* Tags & metrics */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: "clamp(14px, 2vw, 22px)",
            }}
          >
            {solution.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="pill" style={{ fontSize: "0.575rem" }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Metrics row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(8px, 2vw, 16px)",
              paddingTop: "clamp(12px, 2vw, 20px)",
              borderTop: "1px solid var(--rule)",
              marginBottom: "clamp(12px, 2vw, 20px)",
            }}
          >
            {solution.metrics.slice(0, 3).map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                    fontWeight: 400,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </span>
                <span className="section-label" style={{ fontSize: "clamp(0.5rem, 0.9vw, 0.55rem)" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--ink)",
              borderBottom: "1px solid var(--ink)",
              paddingBottom: 2,
              transition: "gap 0.3s",
            }}
          >
            Voir la fiche
            <ArrowRight size={13} strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </div>
  );
}
