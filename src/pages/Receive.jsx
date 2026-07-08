import { useState } from "react";
import { Copy, QrCode } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { QRBlock } from "../components/ui/QRBlock";
import { TopBar } from "../components/layout/TopBar";
import { fmtUSDT } from "../lib/format";

export function Receive({ state, toast }) {
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
