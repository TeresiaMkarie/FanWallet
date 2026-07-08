# Fan Wallet

A self-custodial, football-themed USD₮ wallet for fans — buy match tickets, tip creators,
split watch-party bills, and collect tournament prizes. Built on **Tether's Wallet
Development Kit (WDK)** with real testnet transactions.

## Architecture

```
React (Vite) UI  ──HTTP /api──►  Node wallet-execution service  ──►  EVM testnet
 app + business logic             @tetherto/wdk-wallet-evm             (RPC + USD₮ ERC-20)
 (no keys, no signing)            wallet create/import, balance,
                                  real ERC-20 transfer, spending policy
```

- **Real WDK.** The service uses `@tetherto/wdk-wallet-evm` (`SeedSignerEvm` +
  `WalletManagerEvm`) to generate BIP-39 wallets, read native + ERC-20 balances, and send
  real ERC-20 (USD₮) transfers on a testnet.
- **Clean separation.** The React app contains no signing logic — it only calls `/api`. All
  key handling lives in [server/](server/).
- **Programmable spending limits.** Every transfer is checked against a per-transfer and a
  rolling-24h daily limit *before* it's signed ([server/policy.js](server/policy.js)) — the
  foundation for the planned ERC-4337 smart account.

### ⚠️ Demo custody

For this hackathon build the execution service stores each seed phrase **encrypted at rest**
(AES-256-GCM under `SERVER_SECRET`) so it can sign on the user's behalf. The user is shown the
recovery phrase once at creation and it is **never** written to the browser. This is *demo
custody*, not production key management (no HSM, no per-user passphrase). The phrase is the
only thing that isn't stored in the browser; the app persists just the wallet id + public
address.

## Run it locally

```bash
npm install
cp .env.example .env        # then set a random SERVER_SECRET (see the file)
npm run dev:all             # runs the Vite UI (:5173) + wallet service (:8787) together
```

Open **http://localhost:5173**. (Or run them separately: `npm run dev` and `npm run server`.)

### Configuration

All chain/wallet settings live in `.env` (see [.env.example](.env.example)):
`RPC_URL`, `CHAIN`, `EXPLORER_URL`, `USDT_TOKEN_ADDRESS` / `USDT_DECIMALS` / `USDT_SYMBOL`,
`SERVER_SECRET`, and the spending policy (`POLICY_PER_TX_LIMIT`, `POLICY_DAILY_LIMIT`).

Defaults target **Sepolia** with a test USDC (6 decimals) standing in for USD₮ — swap the token
address for a real testnet USD₮/XAU₮ when available.

## Try it end-to-end

1. Register → **Create a new wallet**. You get a real 0x address and a real 12-word phrase
   (shown once — back it up).
2. Fund the address from a testnet faucet: you need **both** native coin (for gas) and the
   USD₮/test-token. The Dashboard balance then reflects the real on-chain balance.
3. **Send** USD₮ to another address → the service signs and broadcasts a real ERC-20 transfer;
   verify the tx hash on the block explorer.
4. Try a send above the per-transfer or daily limit → the spending policy blocks it before
   signing. See the limits on the **Security** page.

## Deferred / roadmap

Tickets, tips, and split payments still simulate their transaction effects (they'll route
through the same real `send` endpoint next). The flagship **ERC-4337 smart account**
(`@tetherto/wdk-wallet-evm-erc-4337`: on-chain spending rules, gas paid in USD₮, batched
operations) is the next phase — the server-side policy here is its foundation.

## Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder is the deployable static UI; it expects the wallet service reachable at
`/api`.
