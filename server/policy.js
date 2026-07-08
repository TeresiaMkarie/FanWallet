import { config } from "./config.js";
import { getSends } from "./store.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// The programmable spending policy. This is the app-side foundation of the
// flagship ERC-4337 smart account: today the wallet-execution service enforces
// these rules before signing; Phase 2 moves them on-chain into the smart account.

export function getPolicy(walletId) {
  const sends = getSends(walletId);
  const since = Date.now() - DAY_MS;
  const spentToday = sends
    .filter((s) => s.at >= since && s.status === "confirmed")
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return {
    perTxLimit: config.policy.perTxLimit,
    dailyLimit: config.policy.dailyLimit,
    spentToday: +spentToday.toFixed(2),
    remainingToday: +Math.max(0, config.policy.dailyLimit - spentToday).toFixed(2),
    symbol: config.token.symbol,
  };
}

// Returns { ok, reason } — reason is a user-facing message when blocked.
export function checkPolicy(walletId, amount) {
  const amt = Number(amount);
  const { perTxLimit, dailyLimit, spentToday } = getPolicy(walletId);

  if (amt > perTxLimit) {
    return { ok: false, reason: `Blocked by spending rule: over the ${perTxLimit} ${config.token.symbol} per-transfer limit.` };
  }
  if (spentToday + amt > dailyLimit) {
    const remaining = Math.max(0, dailyLimit - spentToday).toFixed(2);
    return { ok: false, reason: `Blocked by spending rule: daily limit reached (${remaining} ${config.token.symbol} left today).` };
  }
  return { ok: true };
}
