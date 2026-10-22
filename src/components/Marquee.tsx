"use client";

const ITEMS = [
  "Velysium",
  "Enterprise Software",
  "OCR Comptabilité",
  "Attestations RH",
  "Droit des Affaires",
  "IA Souveraine",
  "Cybersécurité",
  "On-Premise",
  "Casablanca",
  "Maroc",
];

const SEP = "·";

export default function Marquee() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div
      style={{
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        backgroundColor: "var(--sand)",
        overflow: "hidden",
        padding: "14px 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="marquee-inner">
        {[0, 1].map((set) => (
          <div
            key={set}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              flexShrink: 0,
            }}
          >
            {repeated.map((item, i) => (
              <span
                key={`${set}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 20,
                  paddingRight: 20,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: i % 2 === 0 ? "var(--ink)" : "var(--ash)",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
                <span style={{ color: "var(--trace)", fontSize: "0.5rem" }}>{SEP}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
