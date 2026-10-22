"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Package,
  Layers,
} from "lucide-react";
import { VelysiumSolution } from "@/data/solutions";

interface SolutionModalProps {
  solution: VelysiumSolution | null;
  onClose: () => void;
  onRequestDemo: (solution: VelysiumSolution) => void;
}

export default function SolutionModal({
  solution,
  onClose,
  onRequestDemo,
}: SolutionModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press & prevent background scroll
  useEffect(() => {
    if (!solution) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [solution, onClose]);

  return (
    <AnimatePresence>
      {solution && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-solution-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(12px, 3vw, 32px)",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 13, 10, 0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 960,
              maxHeight: "92vh",
              backgroundColor: "var(--warm-white)",
              border: "1px solid var(--rule)",
              borderRadius: 4,
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1001,
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px clamp(20px, 4vw, 36px)",
                borderBottom: "1px solid var(--rule)",
                backgroundColor: "var(--warm-white)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--ink)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {solution.index} / {solution.category}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "var(--trace)",
                  }}
                />
                <span
                  className="pill"
                  style={{
                    backgroundColor: "var(--sand)",
                    borderColor: "var(--rule)",
                    color: "var(--ink)",
                    fontSize: "0.625rem",
                  }}
                >
                  Licence Entreprise B2B
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la présentation"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ash)",
                  padding: "6px 10px",
                  borderRadius: 4,
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--ink)";
                  e.currentTarget.style.backgroundColor = "var(--sand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ash)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="font-mono" style={{ fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
                  ESC
                </span>
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              style={{
                padding: "clamp(24px, 4vw, 44px) clamp(20px, 4vw, 36px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 36,
              }}
            >
              {/* Header Title & Tagline */}
              <div>
                <h2
                  id="modal-solution-title"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  {solution.name}
                </h2>
                <p
                  style={{
                    fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                    lineHeight: 1.55,
                    color: "var(--ash)",
                    fontWeight: 300,
                    maxWidth: "75ch",
                  }}
                >
                  {solution.tagline}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  padding: 20,
                  backgroundColor: "var(--sand)",
                  border: "1px solid var(--rule)",
                  borderRadius: 3,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Building2 size={18} style={{ color: "var(--ink)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span className="section-label" style={{ fontSize: "0.625rem", display: "block", marginBottom: 3 }}>
                      Entreprises Cibles
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 400, lineHeight: 1.4 }}>
                      {solution.targetAudience}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Laptop size={18} style={{ color: "var(--ink)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span className="section-label" style={{ fontSize: "0.625rem", display: "block", marginBottom: 3 }}>
                      Mode de Déploiement
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 400, lineHeight: 1.4 }}>
                      {solution.deploymentType}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <ShieldCheck size={18} style={{ color: "var(--ink)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span className="section-label" style={{ fontSize: "0.625rem", display: "block", marginBottom: 3 }}>
                      Sécurité & Confidentialité
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 400, lineHeight: 1.4 }}>
                      {solution.securityGuarantee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem Solved (Layach Tayslah) */}
              <div
                style={{
                  padding: "24px clamp(16px, 3vw, 28px)",
                  backgroundColor: "#fffdf9",
                  border: "1px solid var(--rule)",
                  borderLeft: "4px solid var(--ink)",
                  borderRadius: 2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <AlertCircle size={18} style={{ color: "var(--ink)" }} />
                  <span className="section-label" style={{ color: "var(--ink)", fontWeight: 600 }}>
                    {solution.problemSolved.heading}
                  </span>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--ash)", lineHeight: 1.6, marginBottom: 16 }}>
                  {solution.problemSolved.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {solution.problemSolved.bulletPoints.map((point, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        style={{
                          color: "var(--ink)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          lineHeight: 1.4,
                        }}
                      >
                        ·
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.5, fontWeight: 300 }}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution Overview */}
              <div>
                <span className="section-label" style={{ marginBottom: 12, display: "block" }}>
                  {solution.solutionOverview.heading}
                </span>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "var(--ink)",
                    fontWeight: 300,
                  }}
                >
                  {solution.solutionOverview.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <span className="section-label" style={{ marginBottom: 18, display: "block" }}>
                  Fonctionnalités & Capacités Opérationnelles
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 16,
                  }}
                >
                  {solution.features.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 18,
                        backgroundColor: "var(--sand)",
                        border: "1px solid var(--rule)",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Layers size={14} style={{ color: "var(--ash)" }} />
                        <h4
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "var(--ink)",
                          }}
                        >
                          {feature.title}
                        </h4>
                      </div>
                      <p style={{ fontSize: "0.825rem", color: "var(--ash)", lineHeight: 1.55, fontWeight: 300 }}>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics & ROI */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <TrendingUp size={16} style={{ color: "var(--ink)" }} />
                  <span className="section-label">Impact Chiffré & Retour sur Investissement</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16,
                  }}
                >
                  {solution.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "20px 22px",
                        backgroundColor: "var(--ink)",
                        color: "var(--warm-white)",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontSize: "2.4rem",
                          fontWeight: 400,
                          lineHeight: 1,
                          color: "var(--warm-white)",
                        }}
                      >
                        {metric.value}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--trace)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {metric.label}
                      </span>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--ash)",
                          lineHeight: 1.45,
                          marginTop: 4,
                          fontWeight: 300,
                        }}
                      >
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow in 3 steps */}
              <div>
                <span className="section-label" style={{ marginBottom: 18, display: "block" }}>
                  Mise en Pratique dans Votre Entreprise
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {solution.workflow.map((step) => (
                    <div
                      key={step.step}
                      style={{
                        padding: 18,
                        borderTop: "2px solid var(--ink)",
                        backgroundColor: "transparent",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{ fontSize: "0.75rem", color: "var(--ash)", letterSpacing: "0.12em" }}
                      >
                        ÉTAPE {step.step}
                      </span>
                      <h4 style={{ fontSize: "0.9375rem", color: "var(--ink)", fontWeight: 500 }}>
                        {step.title}
                      </h4>
                      <p style={{ fontSize: "0.825rem", color: "var(--ash)", lineHeight: 1.55, fontWeight: 300 }}>
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div
                style={{
                  padding: "20px 24px",
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--sand)",
                  borderRadius: 3,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Package size={16} style={{ color: "var(--ink)" }} />
                  <span className="section-label" style={{ color: "var(--ink)" }}>
                    Ce qui est inclus dans la Licence
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {solution.deliverables.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CheckCircle2 size={16} style={{ color: "var(--ink)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 300 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div
              style={{
                padding: "18px clamp(20px, 4vw, 36px)",
                borderTop: "1px solid var(--rule)",
                backgroundColor: "var(--warm-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="font-mono" style={{ fontSize: "0.6875rem", color: "var(--ash)", letterSpacing: "0.06em" }}>
                  Intéressé par cette application ?
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 400 }}>
                  Démonstration personnalisée & proposition tarifaire
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  id="btn-fermer-modal"
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "10px 18px",
                    border: "1px solid var(--rule)",
                    borderRadius: 3,
                    backgroundColor: "transparent",
                    color: "var(--ash)",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.04em",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.borderColor = "var(--ink)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ash)";
                    e.currentTarget.style.borderColor = "var(--rule)";
                  }}
                >
                  Fermer
                </button>

                <button
                  id="btn-demander-demo"
                  type="button"
                  onClick={() => onRequestDemo(solution)}
                  style={{
                    padding: "10px 22px",
                    border: "1px solid var(--ink)",
                    borderRadius: 3,
                    backgroundColor: "var(--ink)",
                    color: "var(--warm-white)",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#24201c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--ink)";
                  }}
                >
                  Demander une Démo <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
