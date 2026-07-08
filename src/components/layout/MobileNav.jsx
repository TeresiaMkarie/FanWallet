import { NAV_ITEMS } from "../../data/navigation";

export function MobileNav({ view, setView }) {
  const items = NAV_ITEMS.slice(0, 5);
  return (
    <div className="fw-mobile-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--pitch-deep)",
      borderTop: "1px solid var(--pitch-line)", display: "none", zIndex: 90,
      padding: "6px 4px calc(6px + env(safe-area-inset-bottom))",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {items.map((item) => (
          <button key={item.id} onClick={() => setView(item.id)} className="fw-focus" style={{
            background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: view === item.id ? "var(--kit-gold)" : "var(--chalk-dim)", padding: 6, cursor: "pointer",
          }}>
            <item.icon size={18} />
            <span style={{ fontSize: 9.5, fontWeight: 700 }}>{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <style>{`@media (max-width: 900px) { .fw-mobile-nav { display: block !important; } }`}</style>
    </div>
  );
}
