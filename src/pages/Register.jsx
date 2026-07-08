import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { AuthShell } from "../components/layout/AuthShell";
import { Field } from "../components/ui/Field";

export function Register({ goto, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!name || !email || !password) { setErr("Fill in every field to continue."); return; }
    if (password.length < 6) { setErr("Use a password with at least 6 characters."); return; }
    setBusy(true);
    setTimeout(() => { setBusy(false); onRegister({ name, email }); }, 650);
  };

  return (
    <AuthShell title="Create your account" subtitle="Authentication is separate from your wallet — you'll create or import your self-custodial wallet next." back={() => goto("landing")}>
      <form onSubmit={submit}>
        <Field label="Full name">
          <input className="fw-input fw-focus" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <input className="fw-input fw-focus" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input className="fw-input fw-focus" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {err && <div style={{ color: "var(--red-card)", fontSize: 12.5, marginBottom: 12, fontWeight: 600 }}>{err}</div>}
        <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: "12px" }} disabled={busy}>
          {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : <UserPlus size={15} />} {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--chalk-dim)" }}>
        Already have an account? <span style={{ color: "var(--kit-gold)", fontWeight: 700, cursor: "pointer" }} onClick={() => goto("login")}>Sign in</span>
      </div>
    </AuthShell>
  );
}
