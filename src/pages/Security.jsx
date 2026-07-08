import { useState, useEffect } from "react";
import {
  Lock, KeyRound, Eye, EyeOff, ShieldCheck, ShieldAlert, Sparkles,
  Smartphone, Bell, CheckCircle2, Loader2,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { TopBar } from "../components/layout/TopBar";
import { api } from "../lib/api";
import { fmtUSDT, fmtDate } from "../lib/format";

export function Security({ state, setState, toast, sessionPhrase }) {
  const [revealPhrase, setRevealPhrase] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    if (!state.wallet?.walletId) return;
    api.getPolicy(state.wallet.walletId).then(setPolicy).catch(() => {});
  }, [state.wallet?.walletId]);

  const toggle2FA = () => {
    setState((s) => ({ ...s, twoFA: !s.twoFA }));
    toast(state.twoFA ? "Two-factor authentication disabled." : "Two-factor authentication enabled.");
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Security Center" subtitle="Your keys, your rules — manage protections for your account and wallet." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><Lock size={16} color="var(--kit-gold)" /><div style={{ fontWeight: 800, fontSize: 14.5 }}>Two-factor authentication</div></div>
          <p style={{ fontSize: 12.5, color: "var(--chalk-dim)", margin: "6px 0 14px" }}>Add a second layer of protection to your account sign-in.</p>
          <button className={`fw-btn fw-focus ${state.twoFA ? "fw-btn-danger" : "fw-btn-primary"}`} onClick={toggle2FA}>
            {state.twoFA ? <><ShieldAlert size={14} /> Disable 2FA</> : <><ShieldCheck size={14} /> Enable 2FA</>}
          </button>
          <div style={{ marginTop: 10 }}><StatusBadge status={state.twoFA ? "completed" : "pending"} /></div>
        </Card>

        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><KeyRound size={16} color="var(--kit-gold)" /><div style={{ fontWeight: 800, fontSize: 14.5 }}>Recovery phrase</div></div>
          <p style={{ fontSize: 12.5, color: "var(--chalk-dim)", margin: "6px 0 14px" }}>The only way to recover your wallet. Never share it with anyone.</p>
          {!sessionPhrase ? (
            <div style={{ fontSize: 12.5, color: "var(--chalk-dim)", background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 10, padding: 12, lineHeight: 1.6 }}>
              Your phrase is shown only once, at wallet creation. For your security it isn't stored in this browser and can't be re-displayed here — restore from the backup you saved.
            </div>
          ) : !revealPhrase ? (
            <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => setConfirmReveal(true)}><Eye size={14} /> Reveal phrase</button>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                {sessionPhrase.map((w, i) => (
                  <div key={i} className="fw-mono" style={{ fontSize: 12 }}><span style={{ color: "var(--chalk-dim)" }}>{i + 1}.</span> {w}</div>
                ))}
              </div>
              <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => setRevealPhrase(false)}><EyeOff size={13} /> Hide</button>
            </>
          )}
        </Card>

        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><ShieldCheck size={16} color="var(--kit-gold)" /><div style={{ fontWeight: 800, fontSize: 14.5 }}>Spending limits</div><span className="fw-badge fw-badge-gold" style={{ marginLeft: "auto" }}><Sparkles size={11} /> Smart account</span></div>
          <p style={{ fontSize: 12.5, color: "var(--chalk-dim)", margin: "6px 0 14px" }}>Programmable rules the wallet enforces on every transfer before it's signed.</p>
          {policy ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--pitch-line)", fontSize: 13 }}>
                <span style={{ color: "var(--chalk-dim)" }}>Per-transfer limit</span>
                <span className="fw-mono">{fmtUSDT(policy.perTxLimit)} {policy.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--pitch-line)", fontSize: 13 }}>
                <span style={{ color: "var(--chalk-dim)" }}>Daily limit</span>
                <span className="fw-mono">{fmtUSDT(policy.dailyLimit)} {policy.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--pitch-line)", fontSize: 13 }}>
                <span style={{ color: "var(--chalk-dim)" }}>Spent today</span>
                <span className="fw-mono">{fmtUSDT(policy.spentToday)} {policy.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--pitch-line)", fontSize: 13 }}>
                <span style={{ color: "var(--chalk-dim)" }}>Remaining today</span>
                <span className="fw-mono" style={{ color: "var(--pitch-accent)" }}>{fmtUSDT(policy.remainingToday)} {policy.symbol}</span>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--chalk-dim)", fontSize: 12.5 }}><Loader2 size={14} className="fw-pulse-dot" /> Loading limits…</div>
          )}
        </Card>

        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><Smartphone size={16} color="var(--kit-gold)" /><div style={{ fontWeight: 800, fontSize: 14.5 }}>Connected devices</div></div>
          {state.devices.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--pitch-line)" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "var(--chalk-dim)" }}>Active {fmtDate(d.lastActive)}</div>
              </div>
              {d.current && <span className="fw-badge fw-badge-green">This device</span>}
            </div>
          ))}
        </Card>

        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><Bell size={16} color="var(--kit-gold)" /><div style={{ fontWeight: 800, fontSize: 14.5 }}>Security notifications</div></div>
          <p style={{ fontSize: 12.5, color: "var(--chalk-dim)", margin: "6px 0 14px" }}>We'll flag anything unusual — new devices, large sends, or failed sign-ins.</p>
          <span className="fw-badge fw-badge-green"><CheckCircle2 size={11} /> Active for {state.user.email}</span>
        </Card>
      </div>

      <Modal open={confirmReveal} onClose={() => setConfirmReveal(false)} title="Reveal recovery phrase?">
        <p style={{ fontSize: 13, color: "var(--chalk-dim)", marginBottom: 18, lineHeight: 1.6 }}>
          Make sure nobody can see your screen. Anyone with these 12 words can take full control of your wallet.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="fw-btn fw-btn-ghost fw-focus" style={{ flex: 1 }} onClick={() => setConfirmReveal(false)}>Cancel</button>
          <button className="fw-btn fw-btn-danger fw-focus" style={{ flex: 1 }} onClick={() => { setRevealPhrase(true); setConfirmReveal(false); }}>Reveal</button>
        </div>
      </Modal>
    </div>
  );
}
