import {
  Wallet, Sparkles, ArrowRight, CheckCircle2, ShieldCheck,
  Ticket, Heart, Trophy, Users,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { PitchDivider } from "../components/ui/PitchDivider";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { fmtUSDT } from "../lib/format";

export function Landing({ goto, theme, onToggleTheme }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-20%", right: "-10%", width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,181,74,0.14), transparent 70%)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "24px 24px 80px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--kit-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={18} color="#16210F" />
            </div>
            <span className="fw-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.02em" }}>FAN WALLET</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => goto("login")}>Sign in</button>
            <button className="fw-btn fw-btn-primary fw-focus" onClick={() => goto("register")}>Create account</button>
          </div>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }} className="fw-hero-grid">
          <div className="fw-fade-in">
            <div className="fw-badge fw-badge-gold" style={{ marginBottom: 20 }}>
              <Sparkles size={11} /> Tether Wallet 
            </div>
            <h1 className="fw-display" style={{ fontSize: "clamp(40px, 5.4vw, 68px)", fontWeight: 900, lineHeight: 0.98, margin: "0 0 20px" }}>
              YOUR CLUB.<br />YOUR CROWD.<br /><span style={{ color: "var(--kit-gold)" }}>YOUR WALLET.</span>
            </h1>
            <p style={{ fontSize: 16.5, color: "var(--chalk-dim)", maxWidth: 460, lineHeight: 1.6, marginBottom: 32 }}>
              A self-custodial USD₮ wallet built for football fans — buy match tickets, tip creators,
              split watch-party bills, and collect tournament prizes. You hold the keys. Always.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="fw-btn fw-btn-primary fw-focus" style={{ padding: "13px 24px", fontSize: 15 }} onClick={() => goto("register")}>
                Get started <ArrowRight size={16} />
              </button>
              <button className="fw-btn fw-btn-ghost fw-focus" style={{ padding: "13px 24px", fontSize: 15 }} onClick={() => goto("login")}>
                I already have a wallet
              </button>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
              {[["100%", "Self-custodial"], ["0", "Custody of your funds, ever"], ["<2s", "Typical send time"]].map(([n, l]) => (
                <div key={l}>
                  <div className="fw-scoreboard" style={{ fontSize: 26 }}>{n}</div>
                  <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", maxWidth: 110, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fw-fade-in" style={{ animationDelay: "0.1s" }}>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "22px 22px 18px", position: "relative" }}>
                <div className="fw-jersey-num">10</div>
                <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Wallet balance</div>
                <div className="fw-scoreboard" style={{ fontSize: 44, marginTop: 6 }}>{fmtUSDT(1284.5)} <span style={{ fontSize: 18, color: "var(--chalk-dim)", fontFamily: "var(--font-body)", fontWeight: 700 }}>USD₮</span></div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <span className="fw-badge fw-badge-green"><CheckCircle2 size={11} /> Self-custodial</span>
                  <span className="fw-badge fw-badge-gold"><ShieldCheck size={11} /> Keys on-device</span>
                </div>
              </div>
              <PitchDivider />
              <div style={{ padding: 18 }}>
                {[
                  { icon: Ticket, label: "Continental Cup QF ticket", amt: -45, color: "var(--kit-gold)" },
                  { icon: Heart, label: "Tip to @dejitalks", amt: -8, color: "var(--kit-gold)" },
                  { icon: Trophy, label: "Predictor reward", amt: 25, color: "var(--pitch-accent)" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--overlay-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <r.icon size={15} color={r.color} />
                    </div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                    <div className="fw-mono" style={{ fontSize: 13, fontWeight: 700, color: r.amt < 0 ? "var(--red-card)" : "var(--pitch-accent)" }}>
                      {r.amt < 0 ? "−" : "+"}{Math.abs(r.amt)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <PitchDivider thin style={{ margin: "80px 0 40px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="fw-feature-grid">
          {[
            [Ticket, "Match tickets", "Buy and store digital tickets with entry QR codes."],
            [Heart, "Tip creators", "Send USD₮ straight to commentators & analysts."],
            [Users, "Split the bill", "Divide watch-party costs across the group, fairly."],
            [Trophy, "Win rewards", "Collect prize payouts from predictors & fantasy leagues."],
          ].map(([Icon, t, d], i) => (
            <div key={i} className="fw-card" style={{ padding: 18 }}>
              <Icon size={20} color="var(--kit-gold)" style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 14.5 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: "var(--chalk-dim)", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .fw-hero-grid { grid-template-columns: 1fr !important; }
          .fw-feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
