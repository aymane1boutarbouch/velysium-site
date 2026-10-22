"use client";

import { useState, useCallback, useEffect } from "react";
import Nav from "@/components/Nav";
import VelysiumIntro from "@/components/VelysiumIntro";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import WhatWeDo from "@/components/WhatWeDo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [heroReady, setHeroReady] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Intro plays once per session (skippable, persisted in sessionStorage)
  useEffect(() => {
    try {
      const hasSeenIntro = sessionStorage.getItem("velysium_intro_seen");
      if (hasSeenIntro) {
        setShowIntro(false);
        setHeroReady(true);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem("velysium_intro_seen", "true");
    } catch {
      // fallback
    }
    setHeroReady(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 800);
  }, []);

  return (
    <>
      {showIntro && <VelysiumIntro onComplete={handleIntroComplete} />}
      <Nav />
      <main>
        <Hero ready={heroReady} />
        <Marquee />
        <Projects />
        <WhatWeDo />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
