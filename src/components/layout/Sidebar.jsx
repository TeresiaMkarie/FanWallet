import { Wallet, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../data/navigation";
import { PitchDivider } from "../ui/PitchDivider";

export function Sidebar({ view, setView, user, onLogout }) {
  return (
    <>
      <aside className="fw-scroll" style={{
        width: 232, flexShrink: 0, borderRight: "1px solid var(--pitch-line)", padding: 18,
        display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--kit-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={15} color="#16210F" />
          </div>
          <span className="fw-display" style={{ fontSize: 16, fontWeight: 800 }}>FAN WALLET</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className={`fw-nav-item fw-focus ${view === item.id ? "active" : ""}`} tabIndex={0}
              onClick={() => setView(item.id)} onKeyDown={(e) => e.key === "Enter" && setView(item.id)}>
              <item.icon size={16} /> {item.label}
            </div>
          ))}
        </div>
        <PitchDivider thin style={{ margin: "12px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--pitch-line)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
            {(user?.name || "F").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "var(--chalk-dim)" }}>Fan account</div>
          </div>
          <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={onLogout} aria-label="Log out"><LogOut size={14} /></button>
        </div>
      </aside>
      <style>{`
        @media (max-width: 900px) {
          .fw-shell-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}
