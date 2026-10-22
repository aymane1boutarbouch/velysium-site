"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface VelysiumIntroProps {
  onComplete: () => void;
}

// ─────────────────────────────────────────────────────────────
// R3F SCENE: Speed Streaks Tunnel + 200 Shards Convergence
// ─────────────────────────────────────────────────────────────

interface SceneProps {
  timelineState: React.MutableRefObject<{
    cameraZ: number;
    tunnelOpacity: number;
    tunnelSpeed: number;
    inkDotScale: number;
    inkDotOpacity: number;
    shardsProgress: number;
    shardsOpacity: number;
    cameraShake: number;
    shockwaveScale: number;
    shockwaveOpacity: number;
  }>;
}

function CinematicThreeScene({ timelineState }: SceneProps) {
  const { camera, size } = useThree();

  // 1. Tunnel speed streaks (120 thin lines via LineSegments)
  const streakCount = 120;
  const streaksMeshRef = useRef<THREE.LineSegments>(null);

  const streaksObject = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const colorObj = new THREE.Color();
    const streakPalette = ["#121348", "#191760", "#2563eb", "#7c3aed", "#8a53f9", "#3b82f6"];

    for (let i = 0; i < streakCount; i++) {
      const angle = (i / streakCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const radius = 3 + Math.random() * 14;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 80;
      const length = 4 + Math.random() * 14;

      positions.push(x, y, z - length);
      positions.push(x, y, z);

      colorObj.set(streakPalette[i % streakPalette.length]);
      colors.push(colorObj.r, colorObj.g, colorObj.b);
      colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      linewidth: 1.5,
    });

    return new THREE.LineSegments(geometry, material);
  }, []);

  // 2. 200 Shards (Geometric 3D crystalline facets)
  const shardCount = 200;
  const shardsMeshRef = useRef<THREE.InstancedMesh>(null);

  const shardsData = useMemo(() => {
    const items = [];
    // Colors from logo
    const palette = [
      new THREE.Color("#121348"), // navy
      new THREE.Color("#191760"), // indigo
      new THREE.Color("#2563eb"), // royal
      new THREE.Color("#7c3aed"), // violet
      new THREE.Color("#8a53f9"), // electric
      new THREE.Color("#3b82f6"), // cyan
      new THREE.Color("#c084fc"), // sparkle highlight
    ];

    for (let i = 0; i < shardCount; i++) {
      // Initial scattered position in 3D volume
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const u = Math.random();
      const theta = Math.acos(costheta);
      const r = 16 + Math.cbrt(u) * 22; // sphere shell around camera

      const x0 = r * Math.sin(theta) * Math.cos(phi);
      const y0 = r * Math.sin(theta) * Math.sin(phi);
      const z0 = (Math.random() - 0.5) * 35;

      // Target position along the V-chevron shape
      // V coordinates in 3D space: apex at (0, -3.5, 0), top wings at (-7, 4.5, 0) and (7, 4.5, 0)
      const isLeft = i % 2 === 0;
      const t = Math.random(); // 0 at apex, 1 at wing tips
      const wingX = isLeft ? -7 * t : 7 * t;
      const wingY = -3.5 + 8 * t;
      // Add slight facet thickness/jitter so shards form the faceted ribbon
      const x1 = wingX + (Math.random() - 0.5) * 1.4;
      const y1 = wingY + (Math.random() - 0.5) * 1.2;
      const z1 = (Math.random() - 0.5) * 0.8;

      // Random rotation velocities
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );

      const color = palette[i % palette.length];

      items.push({ x0, y0, z0, x1, y1, z1, rotSpeed, color });
    }
    return items;
  }, []);

  // Initialize instanced mesh colors
  useEffect(() => {
    if (!shardsMeshRef.current) return;
    shardsData.forEach((d, i) => {
      shardsMeshRef.current!.setColorAt(i, d.color);
    });
    shardsMeshRef.current.instanceColor!.needsUpdate = true;
  }, [shardsData]);

  // Ink dot mesh ref
  const inkDotRef = useRef<THREE.Mesh>(null);
  // Shockwave ring ref
  const shockwaveRef = useRef<THREE.Mesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Per-frame animation loop driven by GSAP timelineState
  useFrame((state, delta) => {
    const s = timelineState.current;

    // 1. Camera positioning + shake
    let shakeX = 0;
    let shakeY = 0;
    if (s.cameraShake > 0.001) {
      shakeX = (Math.random() - 0.5) * s.cameraShake;
      shakeY = (Math.random() - 0.5) * s.cameraShake;
    }
    const aspect = size.width / Math.max(1, size.height);
    const portraitMultiplier = aspect < 1 ? Math.min(1.85, 1 / Math.max(0.45, aspect)) : 1;
    camera.position.set(shakeX, shakeY, s.cameraZ * portraitMultiplier);
    camera.lookAt(0, 0, 0);

    // 2. Tunnel speed streaks motion
    if (streaksMeshRef.current) {
      const mat = streaksMeshRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = s.tunnelOpacity;
      streaksMeshRef.current.position.z += s.tunnelSpeed * delta * 50;
      if (streaksMeshRef.current.position.z > 50) {
        streaksMeshRef.current.position.z = -30;
      }
    }

    // 3. Ink dot
    if (inkDotRef.current) {
      inkDotRef.current.scale.setScalar(s.inkDotScale);
      const mat = inkDotRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = s.inkDotOpacity;
    }

    // 4. 200 Shards convergence
    if (shardsMeshRef.current) {
      const p = s.shardsProgress;
      const shardsMat = shardsMeshRef.current.material as THREE.MeshStandardMaterial;
      shardsMat.opacity = s.shardsOpacity;
      shardsMeshRef.current.visible = s.shardsOpacity > 0.01;

      if (shardsMeshRef.current.visible) {
        for (let i = 0; i < shardCount; i++) {
          const d = shardsData[i];
          // Lerp position with easing
          const currX = THREE.MathUtils.lerp(d.x0, d.x1, p);
          const currY = THREE.MathUtils.lerp(d.y0, d.y1, p);
          const currZ = THREE.MathUtils.lerp(d.z0, d.z1, p);

          dummy.position.set(currX, currY, currZ);

          // Rotate fast during flight, lock rotation as p -> 1
          const spinFactor = 1 - p;
          dummy.rotation.x = state.clock.elapsedTime * d.rotSpeed.x * spinFactor;
          dummy.rotation.y = state.clock.elapsedTime * d.rotSpeed.y * spinFactor;
          dummy.rotation.z = state.clock.elapsedTime * d.rotSpeed.z * spinFactor;

          const sScale = p > 0.95 ? 0.95 : THREE.MathUtils.lerp(0.5, 0.9, p);
          dummy.scale.setScalar(sScale);
          dummy.updateMatrix();

          shardsMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
        shardsMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // 5. Shockwave ring
    if (shockwaveRef.current) {
      shockwaveRef.current.scale.set(s.shockwaveScale, s.shockwaveScale, 1);
      const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = s.shockwaveOpacity;
      shockwaveRef.current.visible = s.shockwaveOpacity > 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 15]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-10, -10, 10]} intensity={1.0} color="#c084fc" />

      {/* 1. TUNNEL SPEED STREAKS */}
      <primitive ref={streaksMeshRef} object={streaksObject} />

      {/* 2. DARK-INK DOT */}
      <mesh ref={inkDotRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial color="#121348" transparent opacity={1} />
      </mesh>

      {/* 3. 200 CONVERGING SHARDS (Tetrahedrons / Prisms) */}
      <instancedMesh
        ref={shardsMeshRef}
        args={[undefined, undefined, shardCount]}
      >
        <tetrahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          roughness={0.25}
          metalness={0.4}
          transparent
          opacity={0}
        />
      </instancedMesh>

      {/* 4. SHOCKWAVE RING */}
      <mesh ref={shockwaveRef} position={[0, 0, 0]}>
        <ringGeometry args={[1.8, 2.3, 64]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN INTRO COMPONENT (GSAP Orchestrator)
// ─────────────────────────────────────────────────────────────

export default function VelysiumIntro({ onComplete }: VelysiumIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [skipped, setSkipped] = useState(false);

  // Mutable state bridging GSAP -> Three.js render loop
  const threeState = useRef({
    cameraZ: 40,
    tunnelOpacity: 0,
    tunnelSpeed: 1,
    inkDotScale: 1,
    inkDotOpacity: 1,
    shardsProgress: 0,
    shardsOpacity: 0,
    cameraShake: 0,
    shockwaveScale: 0.1,
    shockwaveOpacity: 0,
  });

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";
    const win = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
    win.__lenis?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        handleFinish();
      },
    });
    tlRef.current = tl;
    (window as unknown as { __velysiumIntroTl?: gsap.core.Timeline }).__velysiumIntroTl = tl;

    const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";
    const easeInOut = "power4.inOut";

    const isMobile = window.innerWidth < 768;
    const baseLockupScale = Math.min(1, Math.max(0.42, (window.innerWidth - 32) / 660));

    // Initial setup
    tl.set("#intro-2d-stage", { opacity: 0 });
    tl.set("#intro-lockup-group", { scale: baseLockupScale });
    tl.set("#intro-mark-svg", { scale: 0.75, opacity: 0 });
    tl.set(".intro-v-facet", { opacity: 0 });
    tl.set("#intro-sparkle-group", { opacity: 0, scale: 0, transformOrigin: "center center" });
    tl.set(".wordmark-char", { y: "115%", opacity: 0 });
    tl.set("#flash-overlay", { opacity: 0 });

    // ─────────────────────────────────────────────────────────────
    // SCENE 1 (0.0s – 1.5s): Dark-ink dot + Camera rushes through speed streaks
    // ─────────────────────────────────────────────────────────────
    // Ink dot pulses slightly
    tl.to(
      threeState.current,
      {
        inkDotScale: 1.8,
        duration: 0.45,
        ease: "power2.out",
      },
      0
    );

    // Speed streaks fade in and rush forward
    tl.to(
      threeState.current,
      {
        tunnelOpacity: 0.85,
        tunnelSpeed: 4.5,
        duration: 0.6,
        ease: "power2.in",
      },
      0.2
    );

    // Camera rushes forward from z=40 to z=8
    tl.to(
      threeState.current,
      {
        cameraZ: 8,
        duration: 1.3,
        ease: "power3.inOut",
      },
      0.2
    );

    // Ink dot expands and dissolves into the vortex
    tl.to(
      threeState.current,
      {
        inkDotScale: 25,
        inkDotOpacity: 0,
        duration: 0.6,
        ease: "power2.in",
      },
      0.9
    );

    // ─────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────
    // SCENE 2 (1.5s – 3.0s): Lines converge, 200 shards slam into V mark, shake & flash
    // ─────────────────────────────────────────────────────────────
    // Speed streaks converge and slow down
    tl.to(
      threeState.current,
      {
        tunnelOpacity: 0.25,
        tunnelSpeed: 1.2,
        duration: 0.5,
        ease: easeOut,
      },
      1.35
    );
    tl.to(
      threeState.current,
      {
        tunnelOpacity: 0,
        duration: 0.35,
      },
      1.85
    );

    // Shards appear and accelerate inward (0 -> 1 progress)
    tl.to(
      threeState.current,
      {
        shardsOpacity: 1,
        duration: 0.2,
      },
      1.3
    );

    tl.to(
      threeState.current,
      {
        shardsProgress: 1,
        cameraZ: 14,
        duration: 1.2,
        ease: "power3.in",
      },
      1.3
    );

    // t=2.5s: SLAM! Shards impact into the V mark!
    // Flash to white
    tl.to(
      "#flash-overlay",
      {
        opacity: 0.85,
        duration: 0.08,
        ease: "power1.out",
      },
      2.5
    );
    tl.to(
      "#flash-overlay",
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      2.58
    );

    // Camera shake (decaying spring)
    tl.to(
      threeState.current,
      {
        cameraShake: 0.95,
        duration: 0.05,
      },
      2.5
    );
    tl.to(
      threeState.current,
      {
        cameraShake: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      2.55
    );

    // Shockwave ring expansion
    tl.to(
      threeState.current,
      {
        shockwaveScale: 5.5,
        shockwaveOpacity: 0.85,
        duration: 0.1,
      },
      2.5
    );
    tl.to(
      threeState.current,
      {
        shockwaveOpacity: 0,
        duration: 0.55,
        ease: "power2.out",
      },
      2.6
    );

    // Switch from 3D shards to crisp 2D vector V mark
    tl.set(threeState.current, { shardsOpacity: 0 }, 2.55);
    tl.set("#intro-2d-stage", { opacity: 1 }, 2.55);
    tl.set(".intro-v-facet", { opacity: 1 }, 2.55);

    tl.fromTo(
      "#intro-mark-svg",
      { scale: 1.25, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.0)" },
      2.55
    );

    // ─────────────────────────────────────────────────────────────
    // SCENE 3 (3.0s – 4.5s): Sparkle pops, wordmark slides in through mask, light sweep
    // ─────────────────────────────────────────────────────────────
    // Sparkle pops on top of V apex
    tl.set("#intro-sparkle-group", { opacity: 1, scale: 1 }, 3.0);
    tl.fromTo(
      "#intro-sparkle-star",
      { scale: 0, opacity: 0, rotate: -45, transformOrigin: "137px 27px" },
      { scale: 1.35, opacity: 1, rotate: 0, duration: 0.35, ease: "back.out(2.4)" },
      3.0
    );
    tl.to("#intro-sparkle-star", { scale: 1, duration: 0.2, ease: easeOut }, 3.35);

    // Sparkle aura pulse
    tl.fromTo(
      "#intro-sparkle-glow",
      { scale: 0.3, opacity: 0, transformOrigin: "137px 27px" },
      { scale: 1.6, opacity: 0.9, duration: 0.35, ease: "power2.out" },
      3.05
    );
    tl.to("#intro-sparkle-glow", { scale: 1, opacity: 0.5, duration: 0.25, ease: easeOut }, 3.4);

    // Mark slides left into lockup position
    tl.to(
      "#intro-mark-container",
      {
        x: -215,
        duration: 0.65,
        ease: easeOut,
      },
      3.15
    );

    // Wordmark container appears beside the mark
    tl.set("#intro-wordmark-container", { opacity: 1 }, 3.2);

    // Wordmark letters slide in through mask letter by letter
    tl.to(
      ".wordmark-char",
      {
        y: "0%",
        opacity: 1,
        stagger: 0.04,
        duration: 0.55,
        ease: easeOut,
      },
      3.25
    );

    // Light sweep crosses the complete lockup
    tl.fromTo(
      "#intro-light-sweep",
      { x: "-120%", opacity: 0 },
      { x: "240%", opacity: 0.85, duration: 0.65, ease: "power2.inOut" },
      3.8
    );

    // ─────────────────────────────────────────────────────────────
    // SCENE 4 (4.5s – 6.0s): Camera pulls back, mark shrinks to navbar, curtains split, hero rises
    // ─────────────────────────────────────────────────────────────
    // Canvas fades out
    tl.to(
      "#intro-canvas-container",
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      4.45
    );

    // Camera pulls back fast
    tl.to(
      "#intro-lockup-group",
      {
        scale: baseLockupScale * 0.85,
        duration: 0.25,
        ease: "power2.in",
      },
      4.5
    );

    // Lockup shrinks and flies into navbar logo target
    const targetX = -window.innerWidth / 2 + (isMobile ? 54 : 110);
    const targetY = -window.innerHeight / 2 + 32;
    tl.to(
      "#intro-lockup-group",
      {
        scale: baseLockupScale * (isMobile ? 0.24 : 0.18),
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 0.7,
        ease: easeInOut,
      },
      4.6
    );

    // Screen splits like curtains
    tl.to(
      leftCurtainRef.current,
      {
        x: "-100%",
        duration: 0.8,
        ease: easeInOut,
      },
      4.6
    );
    tl.to(
      rightCurtainRef.current,
      {
        x: "100%",
        duration: 0.8,
        ease: easeInOut,
      },
      4.6
    );

    // Hero rises as curtains open
    tl.fromTo(
      "#hero",
      { y: 60, opacity: 0.4 },
      { y: 0, opacity: 1, duration: 0.8, ease: easeOut },
      4.65
    );

    // Clean finish
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          handleFinish();
        },
      },
      5.65
    );

    // Listen for ESC key
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      tl.kill();
      unlockScroll();
    };
  }, []);

  const unlockScroll = () => {
    document.body.style.overflow = "";
    const win = window as unknown as { __lenis?: { start: () => void } };
    win.__lenis?.start();
  };

  const handleFinish = () => {
    unlockScroll();
    onComplete();
  };

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    if (tlRef.current) tlRef.current.kill();
    unlockScroll();
    const container = containerRef.current;
    if (container) {
      gsap.to(container, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          container.style.display = "none";
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      id="velysium-intro-root"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "transparent",
        pointerEvents: "auto",
      }}
    >
      {/* LEFT CURTAIN PANEL (Off-white #F7F6F2 background) */}
      <div
        ref={leftCurtainRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#F7F6F2",
          zIndex: 2,
        }}
      />

      {/* RIGHT CURTAIN PANEL (Off-white #F7F6F2 background) */}
      <div
        ref={rightCurtainRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          backgroundColor: "#F7F6F2",
          zIndex: 2,
        }}
      />

      {/* WHITE FLASH OVERLAY */}
      <div
        id="flash-overlay"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          zIndex: 25,
          pointerEvents: "none",
          opacity: 0,
        }}
      />

      {/* SKIP BUTTON */}
      <button
        onClick={handleSkip}
        type="button"
        style={{
          position: "fixed",
          top: "clamp(14px, 3vh, 24px)",
          right: "clamp(14px, 4vw, 28px)",
          zIndex: 50,
          padding: "6px 14px",
          background: "rgba(247, 246, 242, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(18, 19, 72, 0.2)",
          borderRadius: 100,
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#121348",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#121348";
          e.currentTarget.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(247, 246, 242, 0.85)";
          e.currentTarget.style.color = "#121348";
        }}
      >
        Passer <span className="hidden sm:inline" style={{ opacity: 0.5, fontSize: "0.6rem" }}>[Esc]</span>
      </button>

      {/* 3D R3F CANVAS (Speed streaks + 200 Shards) */}
      <div
        id="intro-canvas-container"
        style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}
      >
        <Canvas
          camera={{ position: [0, 0, 40], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <CinematicThreeScene timelineState={threeState} />
        </Canvas>
      </div>

      {/* 2D LOGO STAGE (Traced V mark + Wordmark letters mask reveal) */}
      <div
        id="intro-2d-stage"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <div
          id="intro-lockup-group"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 800,
            height: 220,
          }}
        >
          {/* Light sweep sheen */}
          <div
            id="intro-light-sweep"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "35%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent)",
              transform: "skewX(-25deg)",
              pointerEvents: "none",
              zIndex: 30,
              opacity: 0,
            }}
          />

          {/* THE V MARK (Traced SVG with 10 Facet Paths) */}
          <div
            id="intro-mark-container"
            style={{
              width: 160,
              height: 126,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 22,
            }}
          >
            <svg
              id="intro-mark-svg"
              viewBox="0 0 280 220"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="v-g-out-left-outer" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#8a53f9"/><stop offset="45%" stopColor="#5f31e3"/><stop offset="100%" stopColor="#241598"/>
                </linearGradient>
                <linearGradient id="v-g-out-left-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b219e"/><stop offset="50%" stopColor="#1d1372"/><stop offset="100%" stopColor="#0f0c4f"/>
                </linearGradient>
                <linearGradient id="v-g-in-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#aa6efc"/><stop offset="50%" stopColor="#6937e6"/><stop offset="100%" stopColor="#2d1aa8"/>
                </linearGradient>
                <linearGradient id="v-g-center-valley" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1470"/><stop offset="50%" stopColor="#110d54"/><stop offset="100%" stopColor="#0b0838"/>
                </linearGradient>
                <linearGradient id="v-g-in-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5693fc"/><stop offset="40%" stopColor="#3c76f5"/><stop offset="85%" stopColor="#204ecb"/><stop offset="100%" stopColor="#1638a8"/>
                </linearGradient>
                <linearGradient id="v-g-in-right-rib" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3155d4"/><stop offset="50%" stopColor="#1b2b98"/><stop offset="100%" stopColor="#101862"/>
                </linearGradient>
                <linearGradient id="v-g-center-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e1878"/><stop offset="60%" stopColor="#120e58"/><stop offset="100%" stopColor="#0a083a"/>
                </linearGradient>
                <linearGradient id="v-g-out-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c982fe"/><stop offset="45%" stopColor="#9a4df8"/><stop offset="80%" stopColor="#6a2be0"/><stop offset="100%" stopColor="#3c16a8"/>
                </linearGradient>
                <linearGradient id="v-g-out-right-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7e39eb"/><stop offset="50%" stopColor="#461fa8"/><stop offset="100%" stopColor="#1b0a6e"/>
                </linearGradient>
                <linearGradient id="v-g-apex-tip" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1d1575"/><stop offset="50%" stopColor="#100b4a"/><stop offset="100%" stopColor="#080530"/>
                </linearGradient>
                <radialGradient id="v-g-sparkle-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f5ecff" stopOpacity="0.95"/><stop offset="30%" stopColor="#d4b0fd" stopOpacity="0.85"/><stop offset="65%" stopColor="#9f65fb" stopOpacity="0.5"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="v-g-sparkle-star" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff"/><stop offset="30%" stopColor="#ecd6ff"/><stop offset="70%" stopColor="#ae7dfc"/><stop offset="100%" stopColor="#8047f8"/>
                </linearGradient>
              </defs>

              <g id="intro-mark-v-group">
                <path className="intro-v-facet" d="M 2 34 L 18 34 L 137 206 L 137 215 L 2 34 Z" fill="url(#v-g-out-left-outer)"/>
                <path className="intro-v-facet" d="M 18 34 L 37 34 L 137 178 L 137 206 Z" fill="url(#v-g-out-left-bevel)"/>
                <path className="intro-v-facet" d="M 45 34 L 62 34 L 137 142 L 118 152 Z" fill="url(#v-g-in-left-main)"/>
                <path className="intro-v-facet" d="M 62 34 L 81 34 L 137 114 L 137 142 Z" fill="url(#v-g-center-valley)"/>
                <path className="intro-v-facet" d="M 193 34 L 212 34 L 149 146 L 137 114 Z" fill="url(#v-g-in-right-main)"/>
                <path className="intro-v-facet" d="M 212 34 L 229 34 L 160 162 L 149 146 Z" fill="url(#v-g-in-right-rib)"/>
                <path className="intro-v-facet" d="M 137 114 L 149 146 L 160 162 L 137 182 L 118 152 L 137 142 Z" fill="url(#v-g-center-bottom)"/>
                <path className="intro-v-facet" d="M 237 34 L 256 34 L 137 206 L 137 178 Z" fill="url(#v-g-out-right-bevel)"/>
                <path className="intro-v-facet" d="M 256 34 L 272 34 L 137 215 L 137 206 Z" fill="url(#v-g-out-right-main)"/>
                <path className="intro-v-facet" d="M 131 204 L 137 215 L 143 204 L 137 180 Z" fill="url(#v-g-apex-tip)"/>
              </g>

              {/* SPARKLE (Pops at 3.0s) */}
              <g id="intro-sparkle-group">
                <circle id="intro-sparkle-glow" cx="137" cy="27" r="28" fill="url(#v-g-sparkle-glow)"/>
                <path
                  id="intro-sparkle-star"
                  d="M 137 2 Q 137 27 165 27 Q 137 27 137 52 Q 137 27 109 27 Q 137 27 137 2 Z"
                  fill="url(#v-g-sparkle-star)"
                />
              </g>
            </svg>
          </div>

          {/* THE WORDMARK (Mask reveal: V E L Y S I U M) */}
          <div
            id="intro-wordmark-container"
            style={{
              position: "absolute",
              left: "calc(50% - 60px)",
              top: "50%",
              transform: "translateY(-50%)",
              width: 400,
              height: 48,
              opacity: 0,
              display: "flex",
              alignItems: "center",
              overflow: "hidden", // Letter mask
            }}
          >
            <svg viewBox="0 0 622 70" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="wm-g" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#121348"/>
                  <stop offset="50%" stopColor="#191760"/>
                  <stop offset="100%" stopColor="#131248"/>
                </linearGradient>
              </defs>
              <g fill="url(#wm-g)">
                {/* V */}
                <g className="wordmark-char" transform="translate(2, 4)">
                  <path d="M 0 1 L 18 1 L 40 50 L 61 1 L 79 1 L 49 60 L 30 60 Z"/>
                </g>
                {/* E */}
                <g className="wordmark-char" transform="translate(98, 4)">
                  <rect x="0" y="1" width="59" height="12" rx="1.5"/>
                  <rect x="0" y="25" width="59" height="12" rx="1.5"/>
                  <rect x="0" y="48" width="59" height="12" rx="1.5"/>
                </g>
                {/* L */}
                <g className="wordmark-char" transform="translate(178, 4)">
                  <path d="M 0 1 L 16 1 L 16 47 L 55 47 L 55 60 L 0 60 Z"/>
                </g>
                {/* Y */}
                <g className="wordmark-char" transform="translate(240, 4)">
                  <path d="M 0 1 L 18 1 L 37 28 L 56 1 L 74 1 L 46 37 L 46 60 L 29 60 L 29 37 Z"/>
                </g>
                {/* S */}
                <g className="wordmark-char" transform="translate(328, 3)">
                  <path d="M 26 1 C 46 -1 70 2 75 14 L 59 18 C 56 12 43 11 30 12 C 18 13 15 18 16 23 C 18 30 32 31 50 34 C 69 37 76 43 75 52 C 73 62 52 62 28 61 C 7 60 1 50 0 43 L 16 41 C 17 46 27 50 38 50 C 51 50 58 46 57 39 C 56 34 44 32 29 30 C 11 28 -1 22 0 12 C 2 2 15 1 26 1 Z"/>
                </g>
                {/* I */}
                <g className="wordmark-char" transform="translate(416, 4)">
                  <rect x="0" y="1" width="15" height="59" rx="1"/>
                </g>
                {/* U */}
                <g className="wordmark-char" transform="translate(454, 4)">
                  <path d="M 0 1 L 16 1 L 16 40 C 16 48 22 51 33 51 C 44 51 50 48 50 40 L 50 1 L 66 1 L 66 41 C 66 56 51 62 33 62 C 15 62 0 56 0 41 Z"/>
                </g>
                {/* M */}
                <g className="wordmark-char" transform="translate(540, 4)">
                  <path d="M 0 1 L 17 1 L 39 38 L 61 1 L 78 1 L 78 60 L 62 60 L 62 19 L 43 51 L 35 51 L 16 19 L 16 60 L 0 60 Z"/>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
