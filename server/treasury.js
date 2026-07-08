import { ethers } from "ethers";
import { config } from "./config.js";
import { MINTABLE_ERC20_ABI } from "./erc20Abi.js";
import { parseUnits } from "./units.js";
import { makeProvider } from "./rpcProvider.js";

// The treasury is the app's own faucet: it owns the TestUSDT contract (minter)
// and holds native gas, so every wallet the app creates can be funded without
// relying on a public testnet faucet. This is separate from user wallet
// execution (walletService.js) — WDK doesn't model minting (it's not a
// standard ERC20 method), so this uses ethers directly against the treasury key.

let cached = null;

function treasury() {
  if (!config.treasury.privateKey) return null;
  if (!cached) {
    const provider = makeProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.treasury.privateKey, provider);
    const token = new ethers.Contract(config.token.address, MINTABLE_ERC20_ABI, wallet);
    cached = { provider, wallet, token };
  }
  return cached;
}

// Mint test USD₮ and send a little native gas to a freshly created wallet.
// Best-effort: failures are logged and swallowed so a treasury hiccup never
// blocks wallet creation — the user can still fund manually if this fails.
export async function fundNewWallet(address) {
  const t = treasury();
  if (!t || !config.token.address) {
    console.warn("Treasury not configured — skipping auto-fund. See .env.example (npm run deploy:token).");
    return { funded: false };
  }

  try {
    const usdtAmount = parseUnits(config.treasury.fundUsdtAmount, config.token.decimals);
    const mintTx = await t.token.mint(address, usdtAmount);
    await mintTx.wait();

    const nativeTx = await t.wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(String(config.treasury.fundNativeEth)),
    });
    await nativeTx.wait();

    return { funded: true, usdtAmount: config.treasury.fundUsdtAmount, nativeEth: config.treasury.fundNativeEth };
  } catch (err) {
    console.warn("Auto-funding new wallet failed:", err.message);
    return { funded: false };
  }
}
