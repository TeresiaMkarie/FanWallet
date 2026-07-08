# Fan Wallet — Plan & Roadmap

Hackathon entry for Tether's **Wallet Development Kit (WDK)** track. Theme: football / the
global tournament moment — fans, teams, matches, predictions, watch-parties, tipping, ticketing.

This file tracks what's done and what's next so work can resume cleanly in a new session.

## Judging angle

- **Real use of WDK**: `@tetherto/wdk-wallet-evm` does actual wallet create/import/sign/transfer
  on a live testnet — not simulated.
- **Clean separation**: app/business logic (React) never touches keys; only the Node
  wallet-execution service does.
- **Flagship differentiator**: programmable spending limits today, ERC-4337 smart account next
  (account abstraction, gas paid in USD₮, on-chain rules).

## Architecture (current)

```
React (Vite) UI  ──HTTP /api──►  Node wallet-execution service  ──►  EVM testnet (Sepolia)
 app + business logic             @tetherto/wdk-wallet-evm             TestUSDT ERC-20
 (no keys, no signing)            wallet create/import, balance,           ▲
                                  real ERC-20 transfer, spending policy     │ mint + gas
                                        │                                   │ on wallet creation
                                        └──────► Treasury wallet (server/treasury.js) ──┘
                                                 owns TestUSDT, holds native gas
```

- Frontend: `src/` — modularized into `pages/`, `components/{ui,layout}/`, `hooks/`, `lib/`,
  `data/`, `styles/`. `App.jsx` is a thin router/state shell.
- Backend: `server/` — Express service (`index.js`), WDK wrapper (`walletService.js`),
  spending policy (`policy.js`), encrypted seed store (`store.js`), treasury/faucet
  (`treasury.js`), non-batching RPC helper (`rpcProvider.js`).
- Contract: `contracts/TestUSDT.sol` — our own minimal ERC-20 stand-in for USD₮ (no public
  testnet USDt faucet exists), deployed via `scripts/deploy-token.mjs`.

## Done

- [x] **Real WDK wallet MVP**: create/import (real BIP-39 seed via WDK), real balance reads,
  real ERC-20 send with on-chain confirmation, friendly error mapping for common revert reasons.
- [x] **Programmable spending policy**: per-transfer + rolling-24h daily limit enforced
  server-side before signing; surfaced on the Security page. Foundation for the smart-account
  phase.
- [x] **Frontend modularization**: single 1,650-line `App.jsx` split into ~30 focused files.
- [x] **Own test USD₮ token + auto-faucet**: `TestUSDT.sol` deployed to Sepolia at
  `0xdb892289B778Ab97b40A3C759c0238842543F071`. A treasury wallet
  (`0xd510e0665047C2E069aA6f5768556ba19b30945c`) mints 1,000 test USD₮ + sends 0.003 native ETH
  to every wallet the app creates — nobody needs a testnet faucet.
- [x] **Light/dark theme**: CSS-var-driven, system-preference default, persisted, toggle
  reachable from every screen.
- [x] **Reliability fix**: disabled ethers' automatic JSON-RPC batching (`rpcProvider.js`) after
  discovering the public Sepolia RPC's free tier rejects batches >3 requests and was crashing the
  service; added an `unhandledRejection` safety net so one bad RPC call can't take the whole
  service down again.
- [x] **Verified end-to-end on real Sepolia**: created two wallets, sent 25 USD₮ between them,
  confirmed real tx hash + balances moved on-chain + policy correctly tracked spend and blocked
  an over-limit send.

## Next up (prioritized)

1. **Wire Tips / Tickets / Split Payments through the real `send` endpoint.**
   Currently these three flows (`src/pages/TipCreators.jsx`, `Tickets.jsx`, `SplitPayments.jsx`)
   still simulate their transaction effect locally instead of calling `api.send(...)`. Route them
   through the same real transfer path `Send.jsx` already uses, so every money-movement feature in
   the app is real, not just the Send page.

2. **ERC-4337 smart account (the flagship feature).**
   Package: `@tetherto/wdk-wallet-evm-erc-4337`. Move the spending policy from
   app-server-enforced (current) to actually on-chain:
   - Smart account per user (account abstraction), deployed lazily on first use.
   - Gas paid in USD₮ (paymaster / fee-in-token) instead of native ETH — would let us stop
     funding new wallets with native gas entirely.
   - On-chain spending limits / role separation, batched transactions.
   - This directly answers the brief's "smart accounts or account abstraction... are a plus."

3. **Polish / stretch, roughly in order of effort vs. payoff:**
   - Recovery / social-recovery story for the smart account (brief calls out "recovery").
   - Group tipping pools / smart splits between creators (brief's Rumble-style example) — natural
     extension once Tips route through real transfers.
   - Real transaction history from chain (currently only local `transactions` in app state) —
     could read from `getTransactions`-style indexing once volume matters.
   - Consider XAU₮ (Tether Gold) as a second asset for prize payouts, matching the brief's mention
     of USDt/USAt/XAUt.

## Operational notes for resuming

- Run: `npm install`, ensure `.env` has `TREASURY_PRIVATE_KEY` + `USDT_TOKEN_ADDRESS` set (already
  deployed — see above), then `npm run dev:all`.
- If ever redeploying the token: `npm run deploy:token` (idempotent-ish — bootstraps a treasury
  key first if missing, then deploys once a balance is present).
- Keep `FAUCET_NATIVE_AMOUNT` small (currently `0.003`) — it's paid out of the treasury's own
  balance on every wallet creation; don't let it exceed what the treasury actually holds.
- If choosing a different RPC than the current default (`https://sepolia.drpc.org`), no code
  changes needed — `server/rpcProvider.js` already disables batching defensively for any RPC.
