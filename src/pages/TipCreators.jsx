import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { TopBar } from "../components/layout/TopBar";
import { SEED_CREATORS } from "../data/seed";
import { fmtUSDT } from "../lib/format";

export function TipCreators({ state, addTx, toast }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("5");
  const [busy, setBusy] = useState(false);
  const presets = [2, 5, 10, 25];

  const submit = () => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0 || amt > state.balance) { toast("Enter a valid amount within your balance.", "error"); return; }
    setBusy(true);
    setTimeout(() => {
      addTx({ type: "tip", amount: amt, title: `Tip to ${selected.name}`, status: "completed" });
      setBusy(false); setSelected(null);
      toast(`Sent ${fmtUSDT(amt)} USD₮ to ${selected.name}.`);
    }, 800);
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Tip Creators" subtitle="Support commentators, analysts, and community voices directly." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {SEED_CREATORS.map((c) => (
          <Card key={c.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: c.color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: c.color }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--chalk-dim)" }}>{c.handle}</div>
              </div>
            </div>
            <span className="fw-badge fw-badge-grey" style={{ marginBottom: 14 }}>{c.category}</span>
            <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%" }} onClick={() => { setSelected(c); setAmount("5"); }}>
              <Heart size={14} /> Send tip
            </button>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => !busy && setSelected(null)} title={selected ? `Tip ${selected.name}` : ""}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {presets.map((p) => (
            <button key={p} className="fw-btn fw-focus" style={{
              flex: 1, background: amount === String(p) ? "var(--kit-gold)" : "transparent",
              color: amount === String(p) ? "#16210F" : "var(--touchline)", border: "1px solid var(--pitch-line)",
            }} onClick={() => setAmount(String(p))}>{p}</button>
          ))}
        </div>
        <Field label="Custom amount (USD₮)">
          <input className="fw-input fw-focus" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: 12 }} disabled={busy} onClick={submit}>
          {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : <Heart size={15} />} {busy ? "Sending…" : `Send ${fmtUSDT(parseFloat(amount) || 0)} USD₮`}
        </button>
      </Modal>
    </div>
  );
}
