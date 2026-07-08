import express from "express";
import cors from "cors";

import { config } from "./config.js";
import * as walletService from "./walletService.js";
import { getPolicy } from "./policy.js";

// Wallet-execution service. Holds keys and signs; the React app calls it over
// /api and contains no wallet/signing logic of its own — clean separation.

// A rejection from a background chain call (RPC hiccup, dropped batch, etc.)
// that isn't tied to a specific request should never take the whole service
// down for every user — log it and keep serving.
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection (service continues running):", err);
});

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (fn) => async (req, res) => {
  try {
    const out = await fn(req, res);
    res.json(out);
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: err.message, code: err.code });
  }
};

app.get("/api/health", wrap(async () => ({
  ok: true,
  chain: config.chainName,
  token: { symbol: config.token.symbol, address: config.token.address, decimals: config.token.decimals },
  explorer: config.explorerUrl,
})));

app.post("/api/wallet", wrap(async () => walletService.createWallet()));

app.post("/api/wallet/import", wrap(async (req) => {
  const { phrase } = req.body || {};
  if (!phrase) { const e = new Error("A recovery phrase is required."); e.status = 400; throw e; }
  return walletService.importWallet(phrase);
}));

app.get("/api/wallet/:id/balance", wrap(async (req) => walletService.getBalance(req.params.id)));

app.post("/api/wallet/:id/send", wrap(async (req) => {
  const { to, amount } = req.body || {};
  if (!to || !amount) { const e = new Error("Recipient and amount are required."); e.status = 400; throw e; }
  return walletService.send(req.params.id, to, amount);
}));

app.get("/api/wallet/:id/transactions", wrap(async (req) => ({
  transactions: walletService.transactions(req.params.id),
})));

app.get("/api/wallet/:id/policy", wrap(async (req) => getPolicy(req.params.id)));

app.listen(config.port, () => {
  console.log(`Fan Wallet execution service → http://localhost:${config.port}`);
  console.log(`Chain: ${config.chainName} · Token: ${config.token.symbol} (${config.token.address || "not set"})`);
  if (!config.token.address || !config.treasury.privateKey) {
    console.warn("No test token/treasury configured yet — run `npm run deploy:token` (see README).");
  }
});
