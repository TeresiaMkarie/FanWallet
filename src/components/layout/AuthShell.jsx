import { Wallet, ChevronLeft } from "lucide-react";
import { Card } from "../ui/Card";

export function AuthShell({ children, title, subtitle, back }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div className="fw-fade-in" style={{ width: 420, maxWidth: "100%", position: "relative" }}>
        <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={back} style={{ marginBottom: 18 }}>
          <ChevronLeft size={14} /> Back
        </button>
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--kit-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={15} color="#16210F" />
            </div>
            <span className="fw-display" style={{ fontSize: 16, fontWeight: 800 }}>FAN WALLET</span>
          </div>
          <h2 className="fw-display" style={{ fontSize: 28, fontWeight: 800, margin: "14px 0 4px" }}>{title}</h2>
          <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", marginBottom: 24 }}>{subtitle}</p>
          {children}
        </Card>
      </div>
    </div>
  );
}
