"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: "top top",
          end: "bottom bottom",
          scrub: 0,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="scroll-progress"
      ref={barRef}
      style={{ width: "100%" }}
    />
  );
}
