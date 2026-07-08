import { useMemo } from "react";
import { pseudoQR } from "../../lib/format";

export function QRBlock({ seed, size = 160 }) {
  const cells = useMemo(() => pseudoQR(seed || "fanwallet"), [seed]);
  const n = 11;
  return (
    <div style={{ width: size, height: size, background: "var(--touchline)", borderRadius: 12, padding: 10, display: "flex" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, width: "100%", height: "100%", borderRadius: 4, overflow: "hidden" }}>
        {cells.map((on, i) => (
          <div key={i} style={{ background: on ? "var(--pitch-night)" : "var(--touchline)" }} />
        ))}
      </div>
    </div>
  );
}
