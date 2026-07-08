import { useState } from "react";
import { Wallet, Plus, RefreshCw, ChevronRight, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { api } from "../lib/api";

export function WalletSetup({ onDone, toast, theme, onToggleTheme }) {
  const [mode, setMode] = useState(null); // 'create' | 'import'
  const [phrase, setPhrase] = useState([]);
  const [walletId, setWalletId] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [funding, setFunding] = useState(null);

  // Generate a real BIP-39 wallet via WDK (in the execution service), then show
  // the phrase once for the user to back up. The service also auto-funds the
  // wallet with test USD₮ + gas (no public testnet USD₮ faucet exists).
  const startCreate = async () => {
    setMode("create");
    setStep(1);
    setBusy(true);
    try {
      const { walletId, address, seedPhrase, funding } = await api.createWallet();
      setWalletId(walletId);
      setAddress(address);
      setPhrase(seedPhrase);
      setFunding(funding || null);
    } catch (e) {
      toast(e.message || "Couldn't create a wallet — is the wallet service running?", "error");
      setMode(null);
    } finally {
      setBusy(false);
    }
  };

  const finishCreate = () => {
    onDone({ walletId, address, phrase });
    toast(
      funding?.funded
        ? `Wallet created — funded with ${funding.usdtAmount} test USD₮ and gas.`
        : "Wallet created — you hold the keys."
    );
  };

  const finishImport = async () => {
    const words = importValue.trim().split(/\s+/);
    if (words.length < 12) { toast("Enter your full 12-word recovery phrase.", "error"); return; }
    setBusy(true);
    try {
      const { walletId, address } = await api.importWallet(words);
      onDone({ walletId, address, phrase: words });
      toast("Wallet imported successfully.");
    } catch (e) {
      toast(e.message || "Couldn't import that phrase.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fw-fade-in" style={{ width: 480, maxWidth: "100%" }}>
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="fw-badge fw-badge-gold"><Wallet size={11} /> Powered by Tether WDK</div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <h2 className="fw-display" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>Set up your wallet</h2>
          <p style={{ fontSize: 13.5, color: "var(--chalk-dim)", marginBottom: 22 }}>
            A real BIP-39 wallet, created with WDK. You get the recovery phrase — the app and wallet
            execution stay cleanly separated. Choose how you'd like to begin.
          </p>

          {!mode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="fw-btn fw-btn-primary fw-focus" style={{ justifyContent: "space-between", padding: "16px 18px" }} onClick={startCreate} disabled={busy}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{busy ? <Loader2 size={16} className="fw-pulse-dot" /> : <Plus size={16} />} Create a new wallet</span> <ChevronRight size={16} />
              </button>
              <button className="fw-btn fw-btn-ghost fw-focus" style={{ justifyContent: "space-between", padding: "16px 18px" }} onClick={() => setMode("import")}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><RefreshCw size={16} /> Import an existing wallet</span> <ChevronRight size={16} />
              </button>
            </div>
          )}

          {mode === "create" && step === 1 && (
            <div>
              <div className="fw-badge fw-badge-red" style={{ marginBottom: 12 }}><ShieldAlert size={11} /> Write this down — shown only once</div>
              {busy || phrase.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 12, padding: 28, marginBottom: 16, color: "var(--chalk-dim)", fontSize: 13 }}>
                  <Loader2 size={16} className="fw-pulse-dot" /> Generating your keys…
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "var(--pitch-night)", border: "1px solid var(--pitch-line)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  {phrase.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }} className="fw-mono">
                      <span style={{ color: "var(--chalk-dim)", width: 18 }}>{i + 1}</span>{w}
                    </div>
                  ))}
                </div>
              )}
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
                <button className="fw-btn fw-btn-ghost fw-focus" onClick={() => setMode(null)} style={{ flex: 1 }} disabled={busy}>Back</button>
                <button className="fw-btn fw-btn-primary fw-focus" onClick={finishImport} style={{ flex: 2 }} disabled={busy}>
                  {busy ? <Loader2 size={15} className="fw-pulse-dot" /> : null} {busy ? "Importing…" : "Import wallet"} {!busy && <ArrowRight size={15} />}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
