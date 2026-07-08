import "dotenv/config";

// Central config for the wallet-execution service.
// All wallet/chain settings come from the environment so nothing is hardcoded.
// See .env.example for the full list and sensible testnet defaults.

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 8787),

  // EVM testnet the service talks to.
  rpcUrl: process.env.RPC_URL || "https://sepolia.drpc.org",
  chainName: process.env.CHAIN || "Sepolia",
  explorerUrl: process.env.EXPLORER_URL || "https://sepolia.etherscan.io",

  // The ERC-20 that the app treats as "USD₮". On a testnet this is a stand-in
  // stablecoin (default: Sepolia test USDC, 6 decimals). Override for another chain.
  token: {
    address: process.env.USDT_TOKEN_ADDRESS || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: num(process.env.USDT_DECIMALS, 6),
    symbol: process.env.USDT_SYMBOL || "USD₮",
  },

  // At-rest encryption key for stored seed phrases (demo custody — see README).
  serverSecret: process.env.SERVER_SECRET || "dev-only-insecure-secret-change-me",

  // Programmable spending policy — the foundation of the smart-account story.
  // Enforced by the service before any transfer is signed.
  policy: {
    perTxLimit: num(process.env.POLICY_PER_TX_LIMIT, 500), // max USD₮ per transfer
    dailyLimit: num(process.env.POLICY_DAILY_LIMIT, 1000), // max USD₮ per rolling 24h
  },
};
