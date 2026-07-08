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

  // The ERC-20 that the app treats as "USD₮". Since public testnet USDt faucets
  // aren't reliably available, this points at our own TestUSDT (contracts/TestUSDT.sol),
  // deployed via `npm run deploy:token` — see .env.example.
  token: {
    address: process.env.USDT_TOKEN_ADDRESS || "",
    decimals: num(process.env.USDT_DECIMALS, 6),
    symbol: process.env.USDT_SYMBOL || "USD₮",
  },

  // At-rest encryption key for stored seed phrases (demo custody — see README).
  serverSecret: process.env.SERVER_SECRET || "dev-only-insecure-secret-change-me",

  // Treasury wallet: owns the TestUSDT token and auto-funds every wallet the app
  // creates with test USD₮ + a little native gas, so users never need a faucet.
  treasury: {
    privateKey: process.env.TREASURY_PRIVATE_KEY || "",
    fundUsdtAmount: num(process.env.FAUCET_USDT_AMOUNT, 1000), // USD₮ minted to each new wallet
    fundNativeEth: process.env.FAUCET_NATIVE_AMOUNT || "0.05", // native gas sent to each new wallet
  },

  // Programmable spending policy — the foundation of the smart-account story.
  // Enforced by the service before any transfer is signed.
  policy: {
    perTxLimit: num(process.env.POLICY_PER_TX_LIMIT, 500), // max USD₮ per transfer
    dailyLimit: num(process.env.POLICY_DAILY_LIMIT, 1000), // max USD₮ per rolling 24h
  },
};
