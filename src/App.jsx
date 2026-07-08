import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

import { api } from "./lib/api";
import { uid } from "./lib/format";
import { usePersistentState } from "./hooks/usePersistentState";
import { useToasts } from "./hooks/useToasts";
import { useTheme } from "./hooks/useTheme";
import { GlobalStyle } from "./styles/GlobalStyle";

import { ToastStack } from "./components/ui/ToastStack";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { WalletSetup } from "./pages/WalletSetup";
import { Dashboard } from "./pages/Dashboard";
import { Send } from "./pages/Send";
import { Receive } from "./pages/Receive";
import { TipCreators } from "./pages/TipCreators";
import { Tickets } from "./pages/Tickets";
import { SplitPayments } from "./pages/SplitPayments";
import { History } from "./pages/History";
import { Security } from "./pages/Security";
import { Profile } from "./pages/Profile";

export default function App() {
  const [state, setState, loaded] = usePersistentState();
  const [route, setRoute] = useState("landing"); // landing | login | register | walletSetup | app
  const [view, setView] = useState("dashboard");
  const [toasts, toast] = useToasts();
  const [theme, toggleTheme] = useTheme();
  // Recovery phrase is kept in memory for this session only — never persisted.
  const [sessionPhrase, setSessionPhrase] = useState(null);

  // Pull the real on-chain USD₮ balance from the wallet-execution service.
  const refreshBalance = useCallback(async () => {
    const walletId = state.wallet?.walletId;
    if (!walletId) return;
    try {
      const { balance } = await api.getBalance(walletId);
      setState((s) => ({ ...s, balance }));
    } catch {
      // leave the last known balance in place if the service is unreachable
    }
  }, [state.wallet?.walletId, setState]);

  useEffect(() => {
    if (!loaded) return;
    if (state.user && state.wallet) setRoute("app");
    else if (state.user && !state.wallet) setRoute("walletSetup");
  }, [loaded]); // eslint-disable-line

  // Fetch the real balance whenever we land in the app with a wallet.
  useEffect(() => {
    if (route === "app") refreshBalance();
  }, [route, refreshBalance]);

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

  const onWalletDone = ({ walletId, address, phrase }) => {
    setSessionPhrase(phrase || null);
    // Persist only the wallet id + public address — never the seed phrase.
    setState((s) => ({ ...s, wallet: { walletId, address }, balance: 0 }));
    setRoute("app");
  };

  const onLogout = () => {
    setRoute("landing");
    setView("dashboard");
  };

  if (!loaded) {
    return (
      <div className="fw-root" data-theme={theme} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <GlobalStyle />
        <Loader2 size={22} className="fw-pulse-dot" color="var(--kit-gold)" />
      </div>
    );
  }

  return (
    <div className="fw-root" data-theme={theme}>
      <GlobalStyle />
      <ToastStack toasts={toasts} />

      {route === "landing" && <Landing goto={setRoute} theme={theme} onToggleTheme={toggleTheme} />}
      {route === "login" && <Login goto={setRoute} onLogin={onLogin} existingUser={state.user} theme={theme} onToggleTheme={toggleTheme} />}
      {route === "register" && <Register goto={setRoute} onRegister={onRegister} theme={theme} onToggleTheme={toggleTheme} />}
      {route === "walletSetup" && <WalletSetup onDone={onWalletDone} toast={toast} theme={theme} onToggleTheme={toggleTheme} />}

      {route === "app" && state.user && state.wallet && (
        <div style={{ display: "flex" }}>
          <div className="fw-shell-sidebar">
            <Sidebar view={view} setView={setView} user={state.user} onLogout={onLogout} theme={theme} onToggleTheme={toggleTheme} />
          </div>
          <main className="fw-scroll" style={{ flex: 1, padding: "26px 28px 90px", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
            {view === "dashboard" && <Dashboard state={state} setView={setView} toast={toast} />}
            {view === "send" && <Send state={state} addTx={addTx} toast={toast} refreshBalance={refreshBalance} />}
            {view === "receive" && <Receive state={state} toast={toast} />}
            {view === "tip" && <TipCreators state={state} addTx={addTx} toast={toast} />}
            {view === "tickets" && <Tickets state={state} addTx={addTx} buyTicket={buyTicket} toast={toast} />}
            {view === "split" && <SplitPayments state={state} setState={setState} addTx={addTx} toast={toast} />}
            {view === "history" && <History state={state} />}
            {view === "security" && <Security state={state} setState={setState} toast={toast} sessionPhrase={sessionPhrase} />}
            {view === "profile" && <Profile state={state} setState={setState} toast={toast} />}
          </main>
          <MobileNav view={view} setView={setView} />
        </div>
      )}
    </div>
  );
}
