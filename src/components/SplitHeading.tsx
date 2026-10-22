"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SplitHeading — wraps heading text into masked word spans,
 * then GSAP-animates them translateY(110%) → 0 on ScrollTrigger enter.
 */
export default function SplitHeading({
  as: Tag = "h2",
  text,
  italic,
  style,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  text: string;
  italic?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const wrapRef = useRef<HTMLElement>(null);

  const words = text.split(" ");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const wordEls = el.querySelectorAll<HTMLElement>(".sh-word");
    gsap.set(wordEls, { y: "110%", opacity: 0 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => {
          gsap.to(wordEls, {
            y: "0%",
            opacity: 1,
            stagger: 0.055,
            duration: 1.0,
            ease: "power4.out",
          });
        },
        once: true,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={wrapRef} style={style} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="split-line"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <span
            className="sh-word split-word"
            style={{
              display: "inline-block",
              fontStyle: italic && i === words.length - 1 ? "italic" : "normal",
              color:
                italic && i === words.length - 1 ? "var(--ash)" : "inherit",
              marginRight: "0.22em",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
