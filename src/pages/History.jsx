import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { TxRow } from "../components/ui/TxRow";
import { TopBar } from "../components/layout/TopBar";

export function History({ state }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const filtered = state.transactions.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (q && !(tx.title || "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const types = ["all", "send", "receive", "ticket", "tip", "split", "reward"];

  return (
    <div className="fw-fade-in">
      <TopBar title="Transaction History" subtitle="Every payment across your football wallet, in one place." />
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--chalk-dim)" }} />
            <input className="fw-input fw-focus" style={{ paddingLeft: 34 }} placeholder="Search transactions" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {types.map((t) => (
              <button key={t} className="fw-btn fw-btn-sm fw-focus" style={{
                background: filter === t ? "var(--kit-gold)" : "transparent",
                color: filter === t ? "#16210F" : "var(--touchline)", border: "1px solid var(--pitch-line)",
              }} onClick={() => setFilter(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Filter} title="No matching transactions" subtitle="Try a different filter or search term." />
        ) : filtered.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      </Card>
    </div>
  );
}
