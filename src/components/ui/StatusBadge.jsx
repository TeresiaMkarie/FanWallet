import { CheckCircle2, Trophy, Loader2, AlertTriangle } from "lucide-react";

export function StatusBadge({ status }) {
  const map = {
    completed: ["fw-badge-green", <CheckCircle2 size={11} key="i" />],
    won: ["fw-badge-green", <Trophy size={11} key="i" />],
    pending: ["fw-badge-gold", <Loader2 size={11} className="fw-pulse-dot" key="i" />],
    failed: ["fw-badge-red", <AlertTriangle size={11} key="i" />],
  };
  const [cls, icon] = map[status] || ["fw-badge-grey", null];
  return <span className={`fw-badge ${cls}`}>{icon}{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}
