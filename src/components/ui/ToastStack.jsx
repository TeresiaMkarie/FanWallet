import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ToastStack({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 18, right: 18, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, maxWidth: 340 }}>
      {toasts.map((t) => (
        <div key={t.id} className="fw-fade-in" style={{
          background: "var(--pitch-panel)", border: `1px solid ${t.kind === "error" ? "var(--red-card)" : "var(--pitch-line)"}`,
          borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)", fontSize: 13.5, fontWeight: 600,
        }}>
          {t.kind === "error" ? <AlertTriangle size={16} color="var(--red-card)" /> : <CheckCircle2 size={16} color="var(--pitch-accent)" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
