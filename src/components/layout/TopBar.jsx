export function TopBar({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 className="fw-display" style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
