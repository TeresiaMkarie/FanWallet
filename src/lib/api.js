// Client for the wallet-execution service (server/). The React app talks to
// real WDK only through these calls — it never handles keys or signing itself.
// In dev, Vite proxies /api → http://localhost:8787 (see vite.config.js).

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON / empty */
  }
  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = body?.code;
    throw err;
  }
  return body;
}

export const api = {
  health: () => request("/health"),
  createWallet: () => request("/wallet", { method: "POST" }),
  importWallet: (phrase) =>
    request("/wallet/import", { method: "POST", body: JSON.stringify({ phrase }) }),
  getBalance: (walletId) => request(`/wallet/${walletId}/balance`),
  send: (walletId, to, amount) =>
    request(`/wallet/${walletId}/send`, {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),
  getTransactions: (walletId) => request(`/wallet/${walletId}/transactions`),
  getPolicy: (walletId) => request(`/wallet/${walletId}/policy`),
};
