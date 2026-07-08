import {
  CheckCircle2, Copy, Send, Download, Ticket, Heart, Users,
  History as HistoryIcon, Trophy, ChevronRight, Calendar,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { PitchDivider } from "../components/ui/PitchDivider";
import { EmptyState } from "../components/ui/EmptyState";
import { TxRow } from "../components/ui/TxRow";
import { StatusBadge } from "../components/ui/StatusBadge";
import { TopBar } from "../components/layout/TopBar";
import { SEED_MATCHES, SEED_REWARDS } from "../data/seed";
import { fmtUSDT, fmtDate, shortAddr } from "../lib/format";

export function Dashboard({ state, setView, toast }) {
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
