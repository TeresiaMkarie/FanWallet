import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { config } from "./config.js";

// Encrypted-at-rest JSON store for wallet records.
//
// DEMO CUSTODY: for this hackathon build the wallet-execution service holds each
// user's seed phrase, encrypted with AES-256-GCM under a key derived from
// SERVER_SECRET. This is NOT production key management (no HSM, no per-user
// passphrase) — it exists so the app logic can stay fully separate from wallet
// execution while we sign real testnet transactions. See README.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, ".data");
const DATA_FILE = path.join(DATA_DIR, "wallets.json");

const KEY = crypto.scryptSync(config.serverSecret, "fanwallet-store-v1", 32);

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decrypt(blob) {
  const [ivHex, tagHex, dataHex] = blob.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(obj) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

// Persist a wallet. The seed phrase is encrypted; everything else is plain.
export function saveWallet({ id, address, mnemonic }) {
  const all = readAll();
  all[id] = {
    id,
    address,
    seed: encrypt(mnemonic),
    createdAt: Date.now(),
    sends: [], // rolling record of outbound transfers (for policy + history)
  };
  writeAll(all);
}

export function getRecord(id) {
  return readAll()[id] || null;
}

// Return the decrypted seed phrase for signing. Kept out of every other path.
export function getSeed(id) {
  const rec = getRecord(id);
  if (!rec) return null;
  return decrypt(rec.seed);
}

export function recordSend(id, send) {
  const all = readAll();
  if (!all[id]) return;
  all[id].sends.unshift(send);
  writeAll(all);
}

export function getSends(id) {
  return getRecord(id)?.sends || [];
}
