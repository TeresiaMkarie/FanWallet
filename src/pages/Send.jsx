import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { TopBar } from "../components/layout/TopBar";
import { api } from "../lib/api";
import { fmtUSDT, shortAddr } from "../lib/format";

export function Send({ state, addTx, toast, refreshBalance }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const amt = parseFloat(amount) || 0;
  const validAddr = /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());
  const valid = validAddr && amt > 0 && amt <= state.balance;

  // Real ERC-20 (USD₮) transfer on the testnet, signed by the wallet-execution
  // service via WDK. The spending policy is checked server-side before signing.
  const submit = async () => {
    setBusy(true);
    try {
      const res = await api.send(state.wallet.walletId, recipient.trim(), String(amt));
      addTx({ type: "send", amount: amt, title: `Sent to ${shortAddr(recipient)}`, status: "completed", hash: res.hash });
      setConfirming(false); setRecipient(""); setAmount(""); setNote("");
      toast(`Sent ${fmtUSDT(amt)} USD₮ — confirmed on-chain.`);
      refreshBalance();
    } catch (e) {
      toast(e.message || "Transfer failed.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Send USD₮" subtitle="Transfers settle directly, wallet to wallet." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 24, maxWidth: 520 }}>
          <Field label="Recipient wallet address">
            <input className="fw-input fw-focus fw-mono" placeholder="0x… or paste an address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </Field>
          <Field label="Amount (USD₮)">
            <input className="fw-input fw-focus" type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", marginTop: 6 }}>Available: {fmtUSDT(state.balance)} USD₮</div>
          </Field>
          <Field label="Note (optional)">
            <input className="fw-input fw-focus" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: 13 }} disabled={!valid} onClick={() => setConfirming(true)}>
            Review transfer <ArrowRight size={15} />
          </button>
          {amt > state.balance && amount && <div style={{ color: "var(--red-card)", fontSize: 12, marginTop: 8, fontWeight: 600 }}>Amount exceeds your available balance.</div>}
          {recipient.trim() && !validAddr && <div style={{ color: "var(--red-card)", fontSize: 12, marginTop: 8, fontWeight: 600 }}>Enter a valid 0x… wallet address (42 characters).</div>}
        </Card>
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 10 }}>Send tips</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--chalk-dim)", lineHeight: 1.9 }}>
            <li>Double-check the address — transfers can't be reversed.</li>
            <li>Real USD₮ transfer, settled on-chain on the testnet.</li>
            <li>Every send is checked against your spending limits first.</li>
          </ul>
        </Card>
      </div>

      <Modal open={confirming} onClose={() => !busy && setConfirming(false)} title="Confirm transfer">
        <div style={{ marginBottom: 16 }}>
          <div className="fw-scoreboard" style={{ fontSize: 34, textAlign: "center" }}>{fmtUSDT(amt)} <span style={{ fontSize: 15, fontFamily: "var(--font-body)", color: "var(--chalk-dim)" }}>USD₮</span></div>
        </div>
        <div style={{ background: "var(--pitch-night)", borderRadius: 10, padding: 14, marginBottom: 16, border: "1px solid var(--pitch-line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0" }}>
            <span style={{ color: "var(--chalk-dim)" }}>To</span><span className="fw-mono">{shortAddr(recipient) || recipient}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0" }}>
            <span style={{ color: "var(--chalk-dim)" }}>Network</span><span>Testnet · gas paid in native coin</span>
          </div>
          {note && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0" }}>
            <span style={{ color: "var(--chalk-dim)" }}>Note</span><span>{note}</span>
          </div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="fw-btn fw-btn-ghost fw-focus" style={{ flex: 1 }} onClick={() => setConfirming(false)} disabled={busy}>Cancel</button>
          <button className="fw-btn fw-btn-primary fw-focus" style={{ flex: 2 }} onClick={submit} disabled={busy}>
            {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : <Check size={15} />} {busy ? "Sending…" : "Confirm & send"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
