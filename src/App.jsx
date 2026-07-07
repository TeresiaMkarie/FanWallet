import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Wallet, Send, Download, Ticket, Users, Heart, History as HistoryIcon,
  Shield, User, LogOut, Copy, QrCode, ChevronRight, ChevronLeft, Plus,
  ArrowUpRight, ArrowDownLeft, Trophy, CheckCircle2, AlertTriangle,
  Eye, EyeOff, Menu, X, Search, Filter, Sun, Moon, Sparkles, Lock,
  Smartphone, Bell, Mail, KeyRound, RefreshCw, ChevronDown, MapPin,
  Calendar, Check, ArrowRight, LayoutDashboard, LogIn, UserPlus,
  Loader2, ShieldCheck, ShieldAlert, Landmark, Coins
} from "lucide-react";

const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

const GlobalStyle = () => (
  <style>{`
    @import url('${FONT_IMPORT}');

    .fw-root {
      --pitch-night: #0B1F17;
      --pitch-deep: #10301F;
      --pitch-panel: #143726;
      --pitch-line: #234E3B;
      --touchline: #F4F6F0;
      --kit-gold: #E8B54A;
      --kit-gold-dim: #B98B2E;
      --chalk-dim: #9FB3A9;
      --yellow-card: #F2C230;
      --red-card: #E15B5B;
      --pitch-accent: #45B884;
      --font-display: 'Big Shoulders Display', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      font-family: var(--font-body);
      background: var(--pitch-night);
      color: var(--touchline);
      min-height: 100vh;
      position: relative;
    }
    .fw-root * { box-sizing: border-box; }
    .fw-display { font-family: var(--font-display); letter-spacing: 0.01em; }
    .fw-mono { font-family: var(--font-mono); }

    .fw-scoreboard {
      font-family: var(--font-display);
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: var(--kit-gold);
      text-shadow: 0 0 18px rgba(232,181,74,0.45), 0 0 2px rgba(232,181,74,0.8);
      letter-spacing: 0.02em;
    }

    .fw-pitch-divider {
      height: 6px;
      width: 100%;
      background: linear-gradient(90deg, var(--pitch-accent) 0%, var(--pitch-accent) 100%);
      position: relative;
      border-radius: 2px;
      overflow: hidden;
    }
    .fw-pitch-divider::after {
      content: '';
      position: absolute; left: 0; right: 0; top: 2px; height: 2px;
      background: var(--kit-gold);
      opacity: 0.9;
    }
    .fw-pitch-divider.thin { height: 3px; }
    .fw-pitch-divider.thin::after { top: 1px; height: 1px; }

    .fw-card {
      background: var(--pitch-panel);
      border: 1px solid var(--pitch-line);
      border-radius: 14px;
      position: relative;
    }
    .fw-card-top {
      position: absolute; left: 14px; right: 14px; top: 0; height: 4px;
      background: linear-gradient(90deg, var(--pitch-accent), var(--kit-gold));
      border-radius: 0 0 4px 4px;
    }

    .fw-btn {
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 14px;
      border-radius: 10px;
      padding: 11px 18px;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      cursor: pointer;
      transition: transform 0.12s ease, filter 0.12s ease, background 0.12s ease;
      border: 1px solid transparent;
      user-select: none;
    }
    .fw-btn:active { transform: scale(0.97); }
    .fw-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .fw-btn-primary { background: var(--kit-gold); color: #16210F; }
    .fw-btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
    .fw-btn-ghost { background: transparent; color: var(--touchline); border-color: var(--pitch-line); }
    .fw-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.04); }
    .fw-btn-danger { background: rgba(214,69,69,0.12); color: var(--red-card); border-color: rgba(214,69,69,0.35); }
    .fw-btn-danger:hover:not(:disabled) { background: rgba(214,69,69,0.2); }
    .fw-btn-sm { padding: 7px 12px; font-size: 12.5px; border-radius: 8px; }

    .fw-input {
      width: 100%;
      background: var(--pitch-night);
      border: 1px solid var(--pitch-line);
      color: var(--touchline);
      border-radius: 10px;
      padding: 12px 14px;
      font-family: var(--font-body);
      font-size: 14px;
      outline: none;
      transition: border-color 0.12s ease, box-shadow 0.12s ease;
    }
    .fw-input:focus {
      border-color: var(--kit-gold);
      box-shadow: 0 0 0 3px rgba(232,181,74,0.18);
    }
    .fw-input::placeholder { color: var(--chalk-dim); }
    .fw-label {
      font-size: 11.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--chalk-dim); margin-bottom: 6px; display: block;
    }

    .fw-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: 10px; cursor: pointer;
      color: var(--chalk-dim); font-weight: 600; font-size: 13.5px;
      transition: background 0.12s ease, color 0.12s ease;
      border-left: 3px solid transparent;
    }
    .fw-nav-item:hover { background: rgba(255,255,255,0.04); color: var(--touchline); }
    .fw-nav-item.active {
      background: rgba(232,181,74,0.1); color: var(--kit-gold);
      border-left: 3px solid var(--kit-gold);
    }

    .fw-badge {
      font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
      display: inline-flex; align-items: center; gap: 5px; letter-spacing: 0.02em;
    }
    .fw-badge-green { background: rgba(69,184,132,0.15); color: var(--pitch-accent); }
    .fw-badge-gold { background: rgba(232,181,74,0.15); color: var(--kit-gold); }
    .fw-badge-red { background: rgba(214,69,69,0.15); color: var(--red-card); }
    .fw-badge-grey { background: rgba(159,179,169,0.15); color: var(--chalk-dim); }

    .fw-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .fw-scroll::-webkit-scrollbar-track { background: transparent; }
    .fw-scroll::-webkit-scrollbar-thumb { background: var(--pitch-line); border-radius: 8px; }

    .fw-fade-in { animation: fwFadeIn 0.28s ease both; }
    @keyframes fwFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

    .fw-pulse-dot { animation: fwPulse 2s ease-in-out infinite; }
    @keyframes fwPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    .fw-qr-cell { background: var(--pitch-night); }
    .fw-qr-cell.on { background: var(--touchline); }

    .fw-jersey-num {
      font-family: var(--font-display); font-weight: 900; font-size: 64px;
      color: rgba(244,246,240,0.06); line-height: 1; position: absolute; right: 10px; top: -6px;
      pointer-events: none; user-select: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .fw-fade-in, .fw-pulse-dot { animation: none !important; }
    }

    .fw-focus:focus-visible {
      outline: 2px solid var(--kit-gold); outline-offset: 2px;
    }
  `}</style>
);


const STORAGE_KEY = "fanwallet:v1:state";

const WORDLIST = ["pitch","corner","striker","keeper","offside","tackle","header","derby","final","trophy","kickoff","winger","fullback","captain","whistle","stadium","floodlight","volley","penalty","assist","dribble","crossbar","extratime","matchday","rebound","freekick","hattrick","counter","press","overlap"];

function genWords(n = 12) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(WORDLIST[Math.floor(Math.random() * WORDLIST.length)] + (Math.random() > 0.7 ? Math.floor(Math.random()*9) : ""));
  return out;
}

function genAddress() {
  const chars = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function genTxId() {
  const chars = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < 64; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function fmtUSDT(n) {
  const sign = n < 0 ? "-" : "";
  return sign + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " · " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function shortAddr(a) {
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}

/* Deterministic fake QR pattern from a string, purely decorative/demo */
function pseudoQR(seed, size = 11) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const cells = [];
  for (let i = 0; i < size * size; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push((h >> 16) % 3 === 0);
  }
  return cells;
}

const SEED_MATCHES = [
  { id: "m1", home: "Vertex United", away: "Coral City FC", date: "2026-07-18T19:00:00", venue: "Meridian Arena", price: 45, comp: "Continental Cup · QF" },
  { id: "m2", home: "Northgate Athletic", away: "Ironbridge SC", date: "2026-07-21T16:30:00", venue: "Northgate Park", price: 28, comp: "League · Matchday 34" },
  { id: "m3", home: "Coral City FC", away: "Sabana Rovers", date: "2026-07-27T20:15:00", venue: "Bahia Stadium", price: 62, comp: "Continental Cup · SF" },
  { id: "m4", home: "Riverside Wanderers", away: "Vertex United", date: "2026-08-02T18:00:00", venue: "Riverside Grounds", price: 33, comp: "League · Matchday 35" },
];

const SEED_CREATORS = [
  { id: "c1", name: "Mara Solis", handle: "@marasolis", category: "Match Commentary", color: "#E8B54A" },
  { id: "c2", name: "Deji Okoro", handle: "@dejitalks", category: "Tactics Analyst", color: "#45B884" },
  { id: "c3", name: "The Ultras Pod", handle: "@ultraspod", category: "Fan Podcast", color: "#7BA7E8" },
  { id: "c4", name: "Kim Rae-won", handle: "@kimrfootball", category: "Highlights", color: "#E17BB0" },
  { id: "c5", name: "Sam Alu", handle: "@samalu", category: "Community Admin", color: "#E17B5B" },
];

const SEED_REWARDS = [
  { id: "r1", title: "Matchday Predictor — Week 34", prize: 25, status: "won", date: "2026-06-29T21:00:00" },
  { id: "r2", title: "Continental Cup Fantasy League", prize: 120, status: "won", date: "2026-06-15T21:00:00" },
  { id: "r3", title: "Trivia Night: Derby Edition", prize: 15, status: "pending", date: "2026-07-09T20:00:00" },
];

function seedInitialState() {
  return {
    user: null,
    wallet: null,
    balance: 0,
    transactions: [],
    ownedTickets: [],
    splitGroups: [],
    twoFA: false,
    devices: [
      { id: "d1", name: "This device — Chrome, macOS", lastActive: Date.now(), current: true },
    ],
    onboarded: false,
  };
}

/* localStorage-backed persistence hook with debounce + graceful fallback */
function usePersistentState() {
  const [state, setState] = useState(seedInitialState());
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch (e) {
      // no existing state yet, or storage unavailable — that's fine
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // storage unavailable — app still works in-memory
      }
    }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded]);

  return [state, setState, loaded];
}


function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return [toasts, push];
}

function ToastStack({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 18, right: 18, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, maxWidth: 340 }}>
      {toasts.map((t) => (
        <div key={t.id} className="fw-fade-in" style={{
          background: "var(--pitch-panel)", border: `1px solid ${t.kind === "error" ? "var(--red-card)" : "var(--pitch-line)"}`,
          borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)", fontSize: 13.5, fontWeight: 600,
        }}>
          {t.kind === "error" ? <AlertTriangle size={16} color="var(--red-card)" /> : <CheckCircle2 size={16} color="var(--pitch-accent)" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
function Card({ children, style, top = true, className = "" }) {
  return (
    <div className={`fw-card ${className}`} style={{ padding: 20, ...style }}>
      {top && <div className="fw-card-top" />}
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label className="fw-label">{label}</label>}
      {children}
    </div>
  );
}

function PitchDivider({ thin = false, style }) {
  return <div className={`fw-pitch-divider ${thin ? "thin" : ""}`} style={style} />;
}

function Modal({ open, onClose, title, children, width = 440 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(4,10,7,0.65)", backdropFilter: "blur(3px)",
      zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div className="fw-fade-in fw-card fw-scroll" style={{ width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", padding: 24 }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="fw-display" style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{title}</h3>
          <button className="fw-btn fw-btn-ghost fw-btn-sm" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function QRBlock({ seed, size = 160 }) {
  const cells = useMemo(() => pseudoQR(seed || "fanwallet"), [seed]);
  const n = 11;
  const cellSize = size / n;
  return (
    <div style={{ width: size, height: size, background: "var(--touchline)", borderRadius: 12, padding: 10, display: "flex" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, width: "100%", height: "100%", borderRadius: 4, overflow: "hidden" }}>
        {cells.map((on, i) => (
          <div key={i} style={{ background: on ? "var(--pitch-night)" : "var(--touchline)" }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  const Icon = icon || Sparkles;
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--chalk-dim)" }}>
      <Icon size={30} style={{ marginBottom: 12, opacity: 0.6 }} />
      <div style={{ fontWeight: 700, color: "var(--touchline)", marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, marginBottom: action ? 16 : 0 }}>{subtitle}</div>}
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: ["fw-badge-green", <CheckCircle2 size={11} key="i" />],
    won: ["fw-badge-green", <Trophy size={11} key="i" />],
    pending: ["fw-badge-gold", <Loader2 size={11} className="fw-pulse-dot" key="i" />],
    failed: ["fw-badge-red", <AlertTriangle size={11} key="i" />],
  };
  const [cls, icon] = map[status] || ["fw-badge-grey", null];
  return <span className={`fw-badge ${cls}`}>{icon}{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

const TX_META = {
  send: { icon: ArrowUpRight, label: "Sent", color: "var(--red-card)" },
  receive: { icon: ArrowDownLeft, label: "Received", color: "var(--pitch-accent)" },
  ticket: { icon: Ticket, label: "Ticket purchase", color: "var(--kit-gold)" },
  tip: { icon: Heart, label: "Creator tip", color: "var(--kit-gold)" },
  split: { icon: Users, label: "Split payment", color: "var(--red-card)" },
  reward: { icon: Trophy, label: "Reward received", color: "var(--pitch-accent)" },
};

function TxRow({ tx }) {
  const meta = TX_META[tx.type] || TX_META.send;
  const Icon = meta.icon;
  const negative = tx.type === "send" || tx.type === "ticket" || tx.type === "tip" || tx.type === "split";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: "1px solid var(--pitch-line)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
function Landing({ goto }) {
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
          <div style={{ display: "flex", gap: 10 }}>
            <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => goto("login")}>Sign in</button>
            <button className="fw-btn fw-btn-primary fw-focus" onClick={() => goto("register")}>Create account</button>
          </div>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }} className="fw-hero-grid">
          <div className="fw-fade-in">
            <div className="fw-badge fw-badge-gold" style={{ marginBottom: 20 }}>
              <Sparkles size={11} /> Powered by Tether Wallet Development Kit
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
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
function AuthShell({ children, title, subtitle, back }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div className="fw-fade-in" style={{ width: 420, maxWidth: "100%", position: "relative" }}>
        <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={back} style={{ marginBottom: 18 }}>
          <ChevronLeft size={14} /> Back
        </button>
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--kit-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={15} color="#16210F" />
            </div>
            <span className="fw-display" style={{ fontSize: 16, fontWeight: 800 }}>FAN WALLET</span>
          </div>
          <h2 className="fw-display" style={{ fontSize: 28, fontWeight: 800, margin: "14px 0 4px" }}>{title}</h2>
          <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", marginBottom: 24 }}>{subtitle}</p>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Login({ goto, onLogin, existingUser }) {
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
    <AuthShell title="Welcome back" subtitle="Sign in to reach your dashboard." back={() => goto("landing")}>
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

function Register({ goto, onRegister }) {
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
function WalletSetup({ onDone, toast }) {
  const [mode, setMode] = useState(null); // 'create' | 'import'
  const [phrase, setPhrase] = useState([]);
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [step, setStep] = useState(1);

  const startCreate = () => {
    setMode("create");
    setPhrase(genWords(12));
    setAddress(genAddress());
    setStep(1);
  };

  const finishCreate = () => {
    onDone({ address, phrase });
    toast("Wallet created — keys are stored on this device only.");
  };

  const finishImport = () => {
    const words = importValue.trim().split(/\s+/);
    if (words.length < 12) { toast("Enter your full 12-word recovery phrase.", "error"); return; }
    onDone({ address: genAddress(), phrase: words.slice(0, 12) });
    toast("Wallet imported successfully.");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fw-fade-in" style={{ width: 480, maxWidth: "100%" }}>
        <Card style={{ padding: 28 }}>
          <div className="fw-badge fw-badge-gold" style={{ marginBottom: 14 }}><Wallet size={11} /> Wallet Development Kit</div>
          <h2 className="fw-display" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>Set up your wallet</h2>
          <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", marginBottom: 22 }}>
            Fan Wallet never sees your private keys. Choose how you'd like to begin.
          </p>

          {!mode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="fw-btn fw-btn-primary fw-focus" style={{ justifyContent: "space-between", padding: "16px 18px" }} onClick={startCreate}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Plus size={16} /> Create a new wallet</span> <ChevronRight size={16} />
              </button>
              <button className="fw-btn fw-btn-ghost fw-focus" style={{ justifyContent: "space-between", padding: "16px 18px" }} onClick={() => setMode("import")}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><RefreshCw size={16} /> Import an existing wallet</span> <ChevronRight size={16} />
              </button>
            </div>
          )}

          {mode === "create" && step === 1 && (
            <div>
              <div className="fw-badge fw-badge-red" style={{ marginBottom: 12 }}><ShieldAlert size={11} /> Write this down — shown only once</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                {phrase.map((w, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }} className="fw-mono">
                    <span style={{ color: "var(--chalk-dim)", width: 18 }}>{i + 1}</span>{w}
                  </div>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, color: "var(--chalk-dim)", marginBottom: 18, cursor: "pointer" }}>
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
                I've stored my recovery phrase somewhere safe. Anyone with these words can access my funds.
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => setMode(null)} style={{ flex: 1 }}>Back</button>
                <button className="fw-btn fw-btn-primary fw-focus" disabled={!confirmed} onClick={finishCreate} style={{ flex: 2 }}>
                  Continue to dashboard <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {mode === "import" && (
            <div>
              <Field label="12-word recovery phrase">
                <textarea className="fw-input fw-focus" rows={4} placeholder="word1 word2 word3 ..." value={importValue} onChange={(e) => setImportValue(e.target.value)} style={{ resize: "none", fontFamily: "var(--font-mono)" }} />
              </Field>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => setMode(null)} style={{ flex: 1 }}>Back</button>
                <button className="fw-btn fw-btn-primary fw-focus" onClick={finishImport} style={{ flex: 2 }}>Import wallet <ArrowRight size={15} /></button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "send", label: "Send", icon: Send },
  { id: "receive", label: "Receive", icon: Download },
  { id: "tip", label: "Tip Creators", icon: Heart },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "split", label: "Split Payments", icon: Users },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "security", label: "Security", icon: Shield },
  { id: "profile", label: "Profile", icon: User },
];

function Sidebar({ view, setView, user, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className="fw-scroll" style={{
        width: 232, flexShrink: 0, borderRight: "1px solid var(--pitch-line)", padding: 18,
        display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--kit-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={15} color="#16210F" />
          </div>
          <span className="fw-display" style={{ fontSize: 16, fontWeight: 800 }}>FAN WALLET</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className={`fw-nav-item fw-focus ${view === item.id ? "active" : ""}`} tabIndex={0}
              onClick={() => setView(item.id)} onKeyDown={(e) => e.key === "Enter" && setView(item.id)}>
              <item.icon size={16} /> {item.label}
            </div>
          ))}
        </div>
        <PitchDivider thin style={{ margin: "12px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--pitch-line)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
            {(user?.name || "F").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "var(--chalk-dim)" }}>Fan account</div>
          </div>
          <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={onLogout} aria-label="Log out"><LogOut size={14} /></button>
        </div>
      </aside>
      <style>{`
        @media (max-width: 900px) {
          .fw-shell-sidebar { display: none !important; }
        }
      `}</style>
    </>
  );
}

function MobileNav({ view, setView }) {
  const items = NAV_ITEMS.slice(0, 5);
  return (
    <div className="fw-mobile-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--pitch-deep)",
      borderTop: "1px solid var(--pitch-line)", display: "none", zIndex: 90,
      padding: "6px 4px calc(6px + env(safe-area-inset-bottom))",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {items.map((item) => (
          <button key={item.id} onClick={() => setView(item.id)} className="fw-focus" style={{
            background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: view === item.id ? "var(--kit-gold)" : "var(--chalk-dim)", padding: 6, cursor: "pointer",
          }}>
            <item.icon size={18} />
            <span style={{ fontSize: 9.5, fontWeight: 700 }}>{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <style>{`@media (max-width: 900px) { .fw-mobile-nav { display: block !important; } }`}</style>
    </div>
  );
}

function TopBar({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 className="fw-display" style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
function Dashboard({ state, setView, toast }) {
  const { user, wallet, balance, transactions, ownedTickets, splitGroups } = state;
  const recent = transactions.slice(0, 5);
  const upcomingTickets = ownedTickets.slice(0, 2);

  const copyAddr = () => {
    navigator.clipboard?.writeText(wallet.address).then(() => toast("Address copied to clipboard."));
  };

  return (
    <div className="fw-fade-in">
      <TopBar title={`Hey, ${user.name.split(" ")[0]}`} subtitle="Here's what's happening across your football wallet." />

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total balance</div>
              <div className="fw-scoreboard" style={{ fontSize: 46, marginTop: 6 }}>
                {fmtUSDT(balance)} <span style={{ fontSize: 18, fontFamily: "var(--font-body)", color: "var(--chalk-dim)", fontWeight: 700 }}>USD₮</span>
              </div>
            </div>
            <span className="fw-badge fw-badge-green"><CheckCircle2 size={11} /> Self-custodial</span>
          </div>
          <div className="fw-mono" style={{ marginTop: 14, fontSize: 12.5, color: "var(--chalk-dim)", display: "flex", alignItems: "center", gap: 8 }}>
            {shortAddr(wallet.address)}
            <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={copyAddr}><Copy size={12} /></button>
          </div>
          <PitchDivider style={{ margin: "20px 0 16px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }} className="fw-quick-actions">
            {[
              ["send", Send, "Send"],
              ["receive", Download, "Receive"],
              ["tickets", Ticket, "Buy Ticket"],
              ["tip", Heart, "Tip Creator"],
              ["split", Users, "Split Bill"],
            ].map(([id, Icon, label]) => (
              <button key={id} className="fw-btn fw-btn-ghost fw-focus" style={{ flexDirection: "column", gap: 6, padding: "12px 6px", height: 74 }} onClick={() => setView(id)}>
                <Icon size={17} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>{label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>Rewards & prizes</div>
            <Trophy size={16} color="var(--kit-gold)" />
          </div>
          {SEED_REWARDS.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--pitch-line)" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--chalk-dim)" }}>{fmtDate(r.date)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="fw-mono" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--pitch-accent)" }}>+{r.prize}</div>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>Recent transactions</div>
            <span className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" style={{ cursor: "pointer" }} onClick={() => setView("history")}>View all <ChevronRight size={13} /></span>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={HistoryIcon} title="No activity yet" subtitle="Send, receive, or buy a ticket to see it here." />
          ) : recent.map((tx) => <TxRow key={tx.id} tx={tx} />)}
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>Your tickets</div>
            <Ticket size={16} color="var(--kit-gold)" />
          </div>
          {upcomingTickets.length === 0 ? (
            <EmptyState icon={Ticket} title="No tickets yet" subtitle="Browse upcoming matches and grab a seat."
              action={<button className="fw-btn fw-btn-primary fw-btn-sm fw-focus" onClick={() => setView("tickets")}>Browse matches</button>} />
          ) : upcomingTickets.map((t) => {
            const m = SEED_MATCHES.find((mm) => mm.id === t.matchId);
            if (!m) return null;
            return (
              <div key={t.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--pitch-line)" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{m.home} vs {m.away}</div>
                <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", display: "flex", gap: 6, alignItems: "center", marginTop: 3 }}>
                  <Calendar size={11} /> {fmtDate(m.date)}
                </div>
              </div>
            );
          })}
          {splitGroups.length > 0 && (
            <>
              <PitchDivider thin style={{ margin: "14px 0" }} />
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Open split groups</div>
              {splitGroups.slice(0, 2).map((g) => (
                <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12.5 }}>
                  <span>{g.title}</span>
                  <span className="fw-mono" style={{ color: "var(--chalk-dim)" }}>{fmtUSDT(g.total)}</span>
                </div>
              ))}
            </>
          )}
        </Card>
      </div>
      <style>{`@media (max-width: 900px) { .fw-dash-grid { grid-template-columns: 1fr !important; } .fw-quick-actions { grid-template-columns: repeat(5, 1fr) !important; } }`}</style>
    </div>
  );
}
function Send_({ state, addTx, toast }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const amt = parseFloat(amount) || 0;
  const valid = recipient.trim().length >= 6 && amt > 0 && amt <= state.balance;

  const submit = () => {
    setBusy(true);
    setTimeout(() => {
      addTx({ type: "send", amount: amt, title: `Sent to ${shortAddr(recipient) || recipient.slice(0, 12)}`, status: "completed" });
      setBusy(false); setConfirming(false); setRecipient(""); setAmount(""); setNote("");
      toast(`Sent ${fmtUSDT(amt)} USD₮.`);
    }, 900);
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
        </Card>
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 10 }}>Send tips</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--chalk-dim)", lineHeight: 1.9 }}>
            <li>Double-check the address — transfers can't be reversed.</li>
            <li>Sends usually confirm in under two seconds.</li>
            <li>Your keys never leave this device.</li>
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
            <span style={{ color: "var(--chalk-dim)" }}>Network fee</span><span>~0.00 (gas-sponsored)</span>
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
function Receive({ state, toast }) {
  const [reqAmount, setReqAmount] = useState("");
  const copy = () => navigator.clipboard?.writeText(state.wallet.address).then(() => toast("Address copied to clipboard."));

  return (
    <div className="fw-fade-in">
      <TopBar title="Receive USD₮" subtitle="Share your address or QR code to get paid instantly." />
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 18 }} className="fw-dash-grid">
        <Card style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <QRBlock seed={state.wallet.address + reqAmount} size={190} />
          <div className="fw-mono" style={{ marginTop: 18, fontSize: 12.5, color: "var(--chalk-dim)", textAlign: "center", wordBreak: "break-all" }}>{state.wallet.address}</div>
          <button className="fw-btn fw-btn-primary fw-focus" style={{ marginTop: 14, width: "100%" }} onClick={copy}><Copy size={14} /> Copy address</button>
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 14 }}>Request a specific amount</div>
          <Field label="Amount (USD₮)">
            <input className="fw-input fw-focus" type="number" min="0" placeholder="0.00" value={reqAmount} onChange={(e) => setReqAmount(e.target.value)} />
          </Field>
          <div style={{ fontSize: 12.5, color: "var(--chalk-dim)", lineHeight: 1.7, marginBottom: 16 }}>
            Adding an amount encodes it into your QR code so the sender's wallet pre-fills it. Leave blank to share an open-amount address.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 10, padding: 12 }}>
            <QrCode size={16} color="var(--kit-gold)" />
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>
              {reqAmount ? `Requesting ${fmtUSDT(parseFloat(reqAmount) || 0)} USD₮` : "Open-amount request"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
function TipCreators({ state, addTx, toast }) {
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
function Tickets({ state, addTx, buyTicket, toast }) {
  const [tab, setTab] = useState("browse");
  const [buying, setBuying] = useState(null);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);

  const owned = state.ownedTickets;

  const confirmBuy = () => {
    setBusy(true);
    setTimeout(() => {
      buyTicket(buying);
      addTx({ type: "ticket", amount: buying.price, title: `Ticket · ${buying.home} vs ${buying.away}`, status: "completed" });
      setBusy(false); setBuying(null);
      toast("Ticket secured — find it under My Tickets.");
    }, 850);
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Match Tickets" subtitle="Buy and store digital tickets with entry QR codes." />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button className={`fw-btn fw-focus ${tab === "browse" ? "fw-btn-primary" : "fw-btn-ghost"}`} onClick={() => setTab("browse")}>Browse matches</button>
        <button className={`fw-btn fw-focus ${tab === "owned" ? "fw-btn-primary" : "fw-btn-ghost"}`} onClick={() => setTab("owned")}>My tickets ({owned.length})</button>
      </div>

      {tab === "browse" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {SEED_MATCHES.map((m) => {
            const already = owned.some((t) => t.matchId === m.id);
            return (
              <Card key={m.id} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: 16, position: "relative" }}>
                  <div className="fw-jersey-num" style={{ fontSize: 46, top: -2 }}>{m.id.replace("m", "")}</div>
                  <span className="fw-badge fw-badge-gold" style={{ marginBottom: 10 }}>{m.comp}</span>
                  <div style={{ fontWeight: 800, fontSize: 15.5 }}>{m.home}</div>
                  <div style={{ fontSize: 11.5, color: "var(--chalk-dim)", margin: "2px 0" }}>vs</div>
                  <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 12 }}>{m.away}</div>
                  <div style={{ fontSize: 12, color: "var(--chalk-dim)", display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={12} /> {fmtDate(m.date)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} /> {m.venue}</span>
                  </div>
                </div>
                <PitchDivider thin />
                <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="fw-scoreboard" style={{ fontSize: 20 }}>{fmtUSDT(m.price)} <span style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--chalk-dim)" }}>USD₮</span></div>
                  <button className="fw-btn fw-btn-primary fw-btn-sm fw-focus" disabled={already} onClick={() => setBuying(m)}>
                    {already ? <><Check size={13} /> Owned</> : "Buy ticket"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "owned" && (
        owned.length === 0 ? (
          <Card style={{ padding: 0 }}><EmptyState icon={Ticket} title="No tickets yet" subtitle="Browse upcoming matches and grab your seat." action={<button className="fw-btn fw-btn-primary fw-focus" onClick={() => setTab("browse")}>Browse matches</button>} /></Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {owned.map((t) => {
              const m = SEED_MATCHES.find((mm) => mm.id === t.matchId);
              const upcoming = m && new Date(m.date).getTime() > Date.now();
              return (
                <Card key={t.id} style={{ padding: 16 }}>
                  <span className={`fw-badge ${upcoming ? "fw-badge-green" : "fw-badge-grey"}`} style={{ marginBottom: 10 }}>{upcoming ? "Upcoming" : "Past"}</span>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{m ? `${m.home} vs ${m.away}` : "Match"}</div>
                  {m && <div style={{ fontSize: 12, color: "var(--chalk-dim)", margin: "6px 0 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={12} /> {fmtDate(m.date)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} /> {m.venue}</span>
                  </div>}
                  <button className="fw-btn fw-btn-ghost fw-focus" style={{ width: "100%" }} onClick={() => setViewing(t)}><QrCode size={14} /> View entry QR</button>
                </Card>
              );
            })}
          </div>
        )
      )}

      <Modal open={!!buying} onClose={() => !busy && setBuying(null)} title="Confirm ticket purchase">
        {buying && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{buying.home} vs {buying.away}</div>
              <div style={{ fontSize: 12.5, color: "var(--chalk-dim)", marginTop: 4 }}>{buying.venue} · {fmtDate(buying.date)}</div>
            </div>
            <div style={{ background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--chalk-dim)" }}>Total</span>
              <span className="fw-mono" style={{ fontWeight: 700 }}>{fmtUSDT(buying.price)} USD₮</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="fw-btn fw-btn-ghost fw-focus" style={{ flex: 1 }} onClick={() => setBuying(null)} disabled={busy}>Cancel</button>
              <button className="fw-btn fw-btn-primary fw-focus" style={{ flex: 2 }} disabled={busy || buying.price > state.balance} onClick={confirmBuy}>
                {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : <Ticket size={15} />} {busy ? "Processing…" : "Confirm purchase"}
              </button>
            </div>
            {buying.price > state.balance && <div style={{ color: "var(--red-card)", fontSize: 12, marginTop: 8 }}>Insufficient balance for this ticket.</div>}
          </>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Entry QR code">
        {viewing && (
          <div style={{ textAlign: "center" }}>
            <QRBlock seed={viewing.id} size={200} />
            <div style={{ fontSize: 12, color: "var(--chalk-dim)", marginTop: 14 }}>Present this code at the stadium gate. Ticket ID: <span className="fw-mono">{viewing.id}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
function SplitPayments({ state, setState, addTx, toast }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [members, setMembers] = useState(["You", ""]);

  const addMemberField = () => setMembers((m) => [...m, ""]);
  const updateMember = (i, v) => setMembers((m) => m.map((x, idx) => (idx === i ? v : x)));
  const removeMember = (i) => setMembers((m) => m.filter((_, idx) => idx !== i));

  const create = () => {
    const validMembers = members.map((m) => m.trim()).filter(Boolean);
    const t = parseFloat(total) || 0;
    if (!title || t <= 0 || validMembers.length < 2) { toast("Add a title, total, and at least two people.", "error"); return; }
    const share = +(t / validMembers.length).toFixed(2);
    const group = {
      id: uid(), title, total: t, createdAt: Date.now(),
      members: validMembers.map((name, i) => ({ name, share, paid: i === 0 })),
    };
    setState((s) => ({ ...s, splitGroups: [group, ...s.splitGroups] }));
    setCreating(false); setTitle(""); setTotal(""); setMembers(["You", ""]);
    toast("Split group created.");
  };

  const markPaid = (groupId, idx) => {
    setState((s) => ({
      ...s,
      splitGroups: s.splitGroups.map((g) => g.id === groupId
        ? { ...g, members: g.members.map((m, i) => i === idx ? { ...m, paid: true } : m) }
        : g),
    }));
    const group = state.splitGroups.find((g) => g.id === groupId);
    if (group) {
      addTx({ type: "split", amount: group.members[idx].share, title: `Split · ${group.title} (${group.members[idx].name})`, status: "completed" });
    }
    toast("Marked as paid.");
  };

  return (
    <div className="fw-fade-in">
      <TopBar title="Split Payments" subtitle="Divide watch-party costs across the group, fairly." right={
        <button className="fw-btn fw-btn-primary fw-focus" onClick={() => setCreating(true)}><Plus size={15} /> New split</button>
      } />

      {state.splitGroups.length === 0 ? (
        <Card style={{ padding: 0 }}><EmptyState icon={Users} title="No split groups yet" subtitle="Create one for your next watch party." action={<button className="fw-btn fw-btn-primary fw-focus" onClick={() => setCreating(true)}>Create a split</button>} /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {state.splitGroups.map((g) => {
            const paidCount = g.members.filter((m) => m.paid).length;
            return (
              <Card key={g.id} style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>{g.title}</div>
                  <span className="fw-badge fw-badge-gold">{paidCount}/{g.members.length} paid</span>
                </div>
                <div className="fw-mono" style={{ fontSize: 12.5, color: "var(--chalk-dim)", marginBottom: 12 }}>Total {fmtUSDT(g.total)} USD₮ · {fmtUSDT(g.total / g.members.length)} each</div>
                {g.members.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: "1px solid var(--pitch-line)" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="fw-mono" style={{ fontSize: 12 }}>{fmtUSDT(m.share)}</span>
                      {m.paid ? <span className="fw-badge fw-badge-green"><Check size={10} /> Paid</span> :
                        <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => markPaid(g.id, i)}>Mark paid</button>}
                    </div>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New split group">
        <Field label="What's this for?">
          <input className="fw-input fw-focus" placeholder="Derby watch party" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Total amount (USD₮)">
          <input className="fw-input fw-focus" type="number" min="0" placeholder="0.00" value={total} onChange={(e) => setTotal(e.target.value)} />
        </Field>
        <Field label="Split between">
          {members.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input className="fw-input fw-focus" placeholder={`Person ${i + 1}`} value={m} onChange={(e) => updateMember(i, e.target.value)} disabled={i === 0} />
              {i > 0 && <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => removeMember(i)}><X size={13} /></button>}
            </div>
          ))}
          <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={addMemberField}><Plus size={13} /> Add person</button>
        </Field>
        <button className="fw-btn fw-btn-primary fw-focus" style={{ width: "100%", padding: 12 }} onClick={create}>Create split group</button>
      </Modal>
    </div>
  );
}

function History({ state }) {
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
function Security({ state, setState, toast }) {
  const [revealPhrase, setRevealPhrase] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);

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
          {!revealPhrase ? (
            <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => setConfirmReveal(true)}><Eye size={14} /> Reveal phrase</button>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                {state.wallet.phrase.map((w, i) => (
                  <div key={i} className="fw-mono" style={{ fontSize: 12 }}><span style={{ color: "var(--chalk-dim)" }}>{i + 1}.</span> {w}</div>
                ))}
              </div>
              <button className="fw-btn fw-btn-ghost fw-btn-sm fw-focus" onClick={() => setRevealPhrase(false)}><EyeOff size={13} /> Hide</button>
            </>
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
function Profile({ state, setState, toast }) {
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


export default function App() {
  const [state, setState, loaded] = usePersistentState();
  const [route, setRoute] = useState("landing"); // landing | login | register | walletSetup | app
  const [view, setView] = useState("dashboard");
  const [toasts, toast] = useToasts();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    if (state.user && state.wallet) setRoute("app");
    else if (state.user && !state.wallet) setRoute("walletSetup");
  }, [loaded]); // eslint-disable-line

  const addTx = useCallback((partial) => {
    setState((s) => {
      const isCredit = partial.type === "receive" || partial.type === "reward";
      const delta = isCredit ? Math.abs(partial.amount) : -Math.abs(partial.amount);
      return {
        ...s,
        balance: +(s.balance + delta).toFixed(2),
        transactions: [{ id: uid(), date: Date.now(), status: "completed", ...partial }, ...s.transactions],
      };
    });
  }, [setState]);

  const buyTicket = useCallback((match) => {
    setState((s) => ({ ...s, ownedTickets: [{ id: uid(), matchId: match.id, purchasedAt: Date.now() }, ...s.ownedTickets] }));
  }, [setState]);

  const onRegister = ({ name, email }) => {
    setState((s) => ({ ...s, user: { name, email } }));
    setRoute("walletSetup");
  };

  const onLogin = (email) => {
    setState((s) => ({ ...s, user: s.user || { name: email.split("@")[0], email } }));
    setRoute(state.wallet ? "app" : "walletSetup");
    setView("dashboard");
  };

  const onWalletDone = (wallet) => {
    setState((s) => ({
      ...s, wallet, balance: 250.0,
      transactions: [
        { id: uid(), type: "receive", amount: 250, title: "Welcome bonus — funded from faucet", status: "completed", date: Date.now() - 1000 * 60 * 40 },
      ],
    }));
    setRoute("app");
  };

  const onLogout = () => {
    setRoute("landing");
    setView("dashboard");
  };

  if (!loaded) {
    return (
      <div className="fw-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <GlobalStyle />
        <Loader2 size={22} className="fw-pulse-dot" color="var(--kit-gold)" />
      </div>
    );
  }

  return (
    <div className="fw-root">
      <GlobalStyle />
      <ToastStack toasts={toasts} />

      {route === "landing" && <Landing goto={setRoute} />}
      {route === "login" && <Login goto={setRoute} onLogin={onLogin} existingUser={state.user} />}
      {route === "register" && <Register goto={setRoute} onRegister={onRegister} />}
      {route === "walletSetup" && <WalletSetup onDone={onWalletDone} toast={toast} />}

      {route === "app" && state.user && state.wallet && (
        <div style={{ display: "flex" }}>
          <div className="fw-shell-sidebar">
            <Sidebar view={view} setView={setView} user={state.user} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
          <main className="fw-scroll" style={{ flex: 1, padding: "26px 28px 90px", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
            {view === "dashboard" && <Dashboard state={state} setView={setView} toast={toast} />}
            {view === "send" && <Send_ state={state} addTx={addTx} toast={toast} />}
            {view === "receive" && <Receive state={state} toast={toast} />}
            {view === "tip" && <TipCreators state={state} addTx={addTx} toast={toast} />}
            {view === "tickets" && <Tickets state={state} addTx={addTx} buyTicket={buyTicket} toast={toast} />}
            {view === "split" && <SplitPayments state={state} setState={setState} addTx={addTx} toast={toast} />}
            {view === "history" && <History state={state} />}
            {view === "security" && <Security state={state} setState={setState} toast={toast} />}
            {view === "profile" && <Profile state={state} setState={setState} toast={toast} />}
          </main>
          <MobileNav view={view} setView={setView} />
        </div>
      )}
    </div>
  );
}
