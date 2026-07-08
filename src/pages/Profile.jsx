import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { TopBar } from "../components/layout/TopBar";
import { fmtUSDT, shortAddr } from "../lib/format";

export function Profile({ state, setState, toast }) {
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);

  const save = () => {
    setState((s) => ({ ...s, user: { ...s.user, name, email } }));
    toast("Profile updated.");
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Profile" subtitle="Manage your Fan Wallet account details." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--pitch-line)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{name}</div>
              <div style={{ fontSize: 12, color: "var(--chalk-dim)" }}>{email}</div>
            </div>
          </div>
          <Field label="Full name"><input className="fw-input fw-focus" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><input className="fw-input fw-focus" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button className="fw-btn fw-btn-primary fw-focus" onClick={save}>Save changes</button>
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 14 }}>Wallet summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--pitch-line)", fontSize: 13 }}>
            <span style={{ color: "var(--chalk-dim)" }}>Address</span><span className="fw-mono">{shortAddr(state.wallet.address)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--pitch-line)", fontSize: 13 }}>
            <span style={{ color: "var(--chalk-dim)" }}>Balance</span><span className="fw-mono">{fmtUSDT(state.balance)} USD₮</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--pitch-line)", fontSize: 13 }}>
            <span style={{ color: "var(--chalk-dim)" }}>Tickets owned</span><span>{state.ownedTickets.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontSize: 13 }}>
            <span style={{ color: "var(--chalk-dim)" }}>Total transactions</span><span>{state.transactions.length}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
