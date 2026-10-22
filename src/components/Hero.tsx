"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // grid bg — slowest
  const layer2Ref = useRef<HTMLDivElement>(null); // year/label — medium
  const layer3Ref = useRef<HTMLDivElement>(null); // headline — normal
  const layer4Ref = useRef<HTMLDivElement>(null); // sub tags — fastest
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const labelY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const subY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const gridYSpring = useSpring(gridY, { stiffness: 60, damping: 22 });
  const labelYSpring = useSpring(labelY, { stiffness: 70, damping: 24 });

  // Mouse-follow tilt on hero container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateX: -ny * 6,
        rotateY: nx * 6,
        transformPerspective: 1200,
        ease: "power2.out",
        duration: 0.8,
      });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Split heading words for GSAP reveal
  useEffect(() => {
    if (!ready) return;
    const words = document.querySelectorAll(".hero-word");
    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        stagger: 0.07,
        duration: 1.0,
        ease: "power4.out",
        delay: 0.1,
      }
    );
    gsap.fromTo(
      ".hero-sub",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.9,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        delay: 0.3,
      }
    );
  }, [ready]);

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(16px, 4vw, 80px)",
        paddingTop: "clamp(88px, 12vh, 120px)",
        paddingBottom: "clamp(48px, 6vw, 96px)",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--warm-white)",
      }}
    >
      {/* Layer 1: Grid bg — slowest parallax */}
      <motion.div
        ref={layer1Ref}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          y: gridYSpring,
          backgroundImage:
            "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)",
          backgroundSize: "clamp(44px, 6vw, 80px) clamp(44px, 6vw, 80px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Layer 2: Corner year label — hidden on small mobile to avoid collision */}
      <motion.div
        ref={layer2Ref}
        className="hidden sm:flex"
        style={{
          position: "absolute",
          top: 80,
          right: "clamp(24px, 5vw, 80px)",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          y: labelYSpring,
          opacity: opacityOut,
          zIndex: 2,
        }}
      >
        <span className="section-label">Est. 2024</span>
        <span className="section-label">Casablanca, MA</span>
      </motion.div>

      {/* Layer 3: Headline — natural scroll (tilt container) */}
      <motion.div
        ref={(el) => {
          (layer3Ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        style={{ position: "relative", zIndex: 3, opacity: opacityOut }}
      >
        {/* Badge */}
        <div className="hero-sub" style={{ marginBottom: "clamp(16px, 3vw, 32px)", opacity: 0 }}>
          <span className="pill" style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>
            Applications Métiers · Souveraineté Locale · Maroc
          </span>
        </div>

        {/* Main heading — split words */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2.5rem, 8.5vw, 9.5rem)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            fontWeight: 400,
            maxWidth: "18ch",
            overflow: "hidden",
          }}
        >
          {["Software", "that", "actually", "ships."].map((word, i) => (
            <span key={i} className="split-line">
              <span
                className="hero-word split-word"
                style={{
                  opacity: 0,
                  display: "inline-block",
                  fontStyle: i === 2 ? "italic" : "normal",
                  color: i === 2 ? "var(--ash)" : "var(--ink)",
                  marginRight: "0.22em",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub row */}
        <div
          style={{
            marginTop: "clamp(24px, 4vw, 40px)",
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(20px, 4vw, 80px)",
            flexWrap: "wrap",
          }}
        >
          <p
            className="hero-sub"
            style={{
              maxWidth: "38ch",
              fontSize: "clamp(0.875rem, 1.4vw, 1.0625rem)",
              lineHeight: 1.65,
              color: "var(--ash)",
              fontWeight: 300,
              opacity: 0,
            }}
          >
            Velysium conçoit des applications desktop, des agents IA et de
            l'automatisation comptable pour les entreprises marocaines.
            Du code qui tourne — pas des maquettes.
          </p>

          {/* Layer 4: Stats tags — fastest parallax via motion */}
          <motion.div
            ref={layer4Ref}
            className="border-l-0 sm:border-l border-[var(--rule)] pl-0 sm:pl-6"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              y: subY,
            }}
          >
            {[
              "5 Solutions Entreprise",
              "On-Premise — Zéro Cloud Forcé",
              "Comptabilité · RH · Juridique · IA · Cyber",
            ].map((item) => (
              <span
                key={item}
                className="hero-sub font-mono"
                style={{
                  fontSize: "clamp(0.6875rem, 1.1vw, 0.75rem)",
                  color: "var(--ash)",
                  letterSpacing: "0.06em",
                  opacity: 0,
                }}
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        className="hidden md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 3,
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 52, backgroundColor: "var(--trace)" }}
        />
        <span className="section-label" style={{ fontSize: "0.575rem" }}>
          scroll
        </span>
      </motion.div>
    </motion.section>
  );
}
