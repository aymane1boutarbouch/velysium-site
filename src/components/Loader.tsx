"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CHARS = "VELYSIUM".split("");

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Wipe the loader up with clip-path
        gsap.to(wrapRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.0,
          ease: "power4.inOut",
          onComplete: () => {
            if (wrapRef.current) wrapRef.current.style.display = "none";
            onComplete();
          },
        });
      },
    });

    // Chars reveal
    tl.to(
      charsRef.current.filter(Boolean),
      {
        y: 0,
        opacity: 1,
        stagger: 0.055,
        duration: 0.7,
        ease: "power3.out",
      },
      0
    );

    // Line expands
    tl.to(
      lineRef.current,
      { width: "40%", duration: 1.2, ease: "power3.out" },
      0.3
    );

    // Count fades in
    tl.to(countRef.current, { opacity: 1, duration: 0.4 }, 0.3);

    // Count ticks 0 → 100
    const countObj = { val: 0 };
    tl.to(
      countObj,
      {
        val: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = Math.round(countObj.val)
              .toString()
              .padStart(3, "0");
        },
      },
      0.3
    );

    // Pause at 100 briefly
    tl.to({}, { duration: 0.3 });
  }, [onComplete]);

  return (
    <div
      id="site-loader"
      ref={wrapRef}
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div id="loader-wordmark">
        {CHARS.map((ch, i) => (
          <span
            key={i}
            className="loader-char"
            ref={(el) => { charsRef.current[i] = el; }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div id="loader-line" ref={lineRef} />
      <span id="loader-count" ref={countRef}>000</span>
    </div>
  );
}
