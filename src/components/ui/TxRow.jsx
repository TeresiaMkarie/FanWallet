import { TX_META } from "../../data/transactions";
import { fmtUSDT, fmtDate } from "../../lib/format";
import { StatusBadge } from "./StatusBadge";

export function TxRow({ tx }) {
  const meta = TX_META[tx.type] || TX_META.send;
  const Icon = meta.icon;
  const negative = tx.type === "send" || tx.type === "ticket" || tx.type === "tip" || tx.type === "split";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: "1px solid var(--pitch-line)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--overlay-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={17} color={meta.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.title || meta.label}</div>
        <div style={{ fontSize: 12, color: "var(--chalk-dim)" }}>{fmtDate(tx.date)}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="fw-mono" style={{ fontWeight: 700, fontSize: 13.5, color: negative ? "var(--red-card)" : "var(--pitch-accent)" }}>
          {negative ? "−" : "+"}{fmtUSDT(Math.abs(tx.amount))} <span style={{ fontSize: 11, opacity: 0.7 }}>USD₮</span>
        </div>
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
}
