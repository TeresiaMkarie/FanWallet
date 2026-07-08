import crypto from "node:crypto";
import * as bip39 from "bip39";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import { SeedSignerEvm } from "@tetherto/wdk-wallet-evm/signers";

import { config } from "./config.js";
import { parseUnits, toNumber } from "./units.js";
import { checkPolicy } from "./policy.js";
import { saveWallet, getSeed, getRecord, recordSend, getSends } from "./store.js";
import { fundNewWallet } from "./treasury.js";
import { makeEip1193Provider } from "./rpcProvider.js";

// Thin wrapper over the real WDK EVM SDK. This is the ONLY module that ever
// touches a seed phrase or signs — the rest of the app never sees keys.

function newId() {
  return crypto.randomBytes(8).toString("hex");
}

// Build a live WDK account (index 0) from a stored seed. Caller must dispose.
async function openAccount(mnemonic) {
  const root = new SeedSignerEvm(mnemonic);
  const wallet = new WalletManagerEvm(root, { provider: makeEip1193Provider(config.rpcUrl) });
  const account = await wallet.getAccount(0);
  return { wallet, account };
}

async function deriveAddress(mnemonic) {
  const { wallet, account } = await openAccount(mnemonic);
  try {
    return await account.getAddress();
  } finally {
    account.dispose();
    wallet.dispose();
  }
}

export async function createWallet() {
  const mnemonic = bip39.generateMnemonic(); // 12-word BIP-39 phrase
  const address = await deriveAddress(mnemonic);
  const id = newId();
  saveWallet({ id, address, mnemonic });
  // No public testnet USD₮ faucet exists, so the app's own treasury mints test
  // USD₮ and sends a little gas to every wallet it creates — best-effort.
  const funding = await fundNewWallet(address);
  // seedPhrase is returned ONCE so the user can back it up; never persisted plaintext.
  return { walletId: id, address, seedPhrase: mnemonic.split(" "), funding };
}

export async function importWallet(words) {
  const mnemonic = Array.isArray(words) ? words.join(" ") : String(words).trim();
  if (!bip39.validateMnemonic(mnemonic)) {
    const err = new Error("That doesn't look like a valid recovery phrase.");
    err.status = 400;
    throw err;
  }
  const address = await deriveAddress(mnemonic);
  const id = newId();
  saveWallet({ id, address, mnemonic });
  return { walletId: id, address };
}

export async function getBalance(walletId) {
  const rec = getRecord(walletId);
  if (!rec) return notFound();
  const mnemonic = getSeed(walletId);
  const { wallet, account } = await openAccount(mnemonic);
  try {
    const [native, token] = await Promise.all([
      account.getBalance(),
      account.getTokenBalance(config.token.address),
    ]);
    return {
      address: rec.address,
      balance: toNumber(token, config.token.decimals), // USD₮ (token) balance
      symbol: config.token.symbol,
      nativeWei: native.toString(), // for gas visibility
      decimals: config.token.decimals,
    };
  } finally {
    account.dispose();
    wallet.dispose();
  }
}

export async function send(walletId, to, amount) {
  const rec = getRecord(walletId);
  if (!rec) return notFound();

  // Enforce the programmable spending policy BEFORE signing.
  const verdict = checkPolicy(walletId, amount);
  if (!verdict.ok) {
    const err = new Error(verdict.reason);
    err.status = 403;
    err.code = "POLICY_BLOCKED";
    throw err;
  }

  const value = parseUnits(amount, config.token.decimals);
  const mnemonic = getSeed(walletId);
  const { wallet, account } = await openAccount(mnemonic);
  try {
    let result;
    try {
      result = await account.transfer({
        token: config.token.address,
        recipient: to,
        amount: value,
      });
    } catch (e) {
      throw friendlyTransferError(e);
    }
    const record = {
      hash: result.hash,
      to,
      amount: Number(amount),
      feeWei: result.fee ? result.fee.toString() : null,
      at: Date.now(),
      status: "confirmed",
      explorer: `${config.explorerUrl}/tx/${result.hash}`,
    };
    recordSend(walletId, record);
    return record;
  } finally {
    account.dispose();
    wallet.dispose();
  }
}

export function transactions(walletId) {
  return getSends(walletId);
}

function notFound() {
  const err = new Error("Wallet not found.");
  err.status = 404;
  throw err;
}

// Translate noisy ethers/RPC errors into short, user-facing messages.
function friendlyTransferError(e) {
  const raw = `${e?.shortMessage || e?.reason || e?.message || e}`;
  let message = "Transfer failed. Please try again.";
  if (/exceeds balance/i.test(raw)) {
    message = `Not enough ${config.token.symbol} in your wallet for this transfer.`;
  } else if (/insufficient funds/i.test(raw)) {
    message = "Not enough testnet gas (native coin) to cover the network fee. Fund your address from the faucet.";
  } else if (/invalid address|bad address|unconfigured name|ENS/i.test(raw)) {
    message = "The recipient address is invalid.";
  } else if (/could not detect network|network|timeout|ETIMEDOUT|fetch/i.test(raw)) {
    message = "Couldn't reach the network. Check the RPC connection and try again.";
  }
  const err = new Error(message);
  err.status = 400;
  err.code = "TRANSFER_FAILED";
  return err;
}
