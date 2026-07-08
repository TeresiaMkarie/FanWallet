import { Sparkles } from "lucide-react";

export function EmptyState({ icon, title, subtitle, action }) {
  const Icon = icon || Sparkles;
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--chalk-dim)" }}>
      <Icon size={30} style={{ marginBottom: 12, opacity: 0.6 }} />
      <div style={{ fontWeight: 700, color: "var(--touchline)", marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, marginBottom: action ? 16 : 0 }}>{subtitle}</div>}
      {action}
    </div>
  );
}
