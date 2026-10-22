"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ringX = mx;
    let ringY = my;

    // Fast dot follows mouse exactly
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    };

    // Lagging ring follows with spring
    let rafId: number;
    const tick = () => {
      ringX += (mx - ringX) * 0.12;
      ringY += (my - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // Hover class on interactive elements
    const onEnter = () => document.body.classList.add("cursor-hover");
    const onLeave = () => document.body.classList.remove("cursor-hover");

    window.addEventListener("mousemove", onMove);

    const addListeners = () => {
      document
        .querySelectorAll("a, button, [role='button'], .magnetic-btn, input, textarea, select, label, .project-card")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    addListeners();
    // Re-run after 1.5s for dynamically rendered elements
    const t = setTimeout(addListeners, 1500);

    // Magnetic buttons
    const onMagneticMove = (e: MouseEvent) => {
      const target = (e.currentTarget as HTMLElement);
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      gsap.to(target, {
        x: dx * 0.35,
        y: dy * 0.35,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMagneticLeave = (e: MouseEvent) => {
      gsap.to(e.currentTarget as HTMLElement, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const bindMagnetic = () => {
      document.querySelectorAll(".magnetic-btn").forEach((btn) => {
        btn.addEventListener("mousemove", onMagneticMove as EventListener);
        btn.addEventListener("mouseleave", onMagneticLeave as EventListener);
      });
    };
    bindMagnetic();
    const t2 = setTimeout(bindMagnetic, 1500);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t);
      clearTimeout(t2);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
