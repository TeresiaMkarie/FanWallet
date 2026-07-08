import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { AuthShell } from "../components/layout/AuthShell";
import { Field } from "../components/ui/Field";

export function Login({ goto, onLogin, existingUser, theme, onToggleTheme }) {
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) { setErr("Enter your email and password."); return; }
    if (existingUser && existingUser.email.toLowerCase() !== email.toLowerCase()) {
      setErr("No account found for that email on this device.");
      return;
    }
    setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(email); }, 550);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to reach your dashboard." back={() => goto("landing")} theme={theme} onToggleTheme={onToggleTheme}>
      <form onSubmit={submit}>
        <Field label="Email">
          <input className="fw-input fw-focus" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <div style={{ position: "relative" }}>
            <input className="fw-input fw-focus" style={{ paddingRight: 40 }} type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 10, top: 10, background: "none", border: "none", color: "var(--chalk-dim)", cursor: "pointer" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        {err && <div style={{ color: "var(--red-card)", fontSize: 12.5, marginBottom: 12, fontWeight: 600 }}>{err}</div>}
        <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: "12px" }} disabled={busy}>
          {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : <LogIn size={15} />} {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--chalk-dim)" }}>
        New to Fan Wallet? <span style={{ color: "var(--kit-gold)", fontWeight: 700, cursor: "pointer" }} onClick={() => goto("register")}>Create an account</span>
      </div>
    </AuthShell>
  );
}
