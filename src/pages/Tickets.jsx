import { useState } from "react";
import { Ticket, Calendar, MapPin, Check, Loader2, QrCode } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PitchDivider } from "../components/ui/PitchDivider";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { QRBlock } from "../components/ui/QRBlock";
import { TopBar } from "../components/layout/TopBar";
import { SEED_MATCHES } from "../data/seed";
import { fmtUSDT, fmtDate } from "../lib/format";

export function Tickets({ state, addTx, buyTicket, toast }) {
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
