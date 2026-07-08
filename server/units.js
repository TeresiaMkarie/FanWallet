// Minimal, dependency-free conversion between human decimal strings and
// integer base units (BigInt), for ERC-20 amounts with a given number of decimals.

export function parseUnits(amount, decimals) {
  const s = String(amount).trim();
  if (!/^\d*(\.\d*)?$/.test(s) || s === "" || s === ".") {
    throw new Error(`Invalid amount: ${amount}`);
  }
  const [whole, frac = ""] = s.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const combined = `${whole}${fracPadded}`.replace(/^0+(?=\d)/, "");
  return BigInt(combined === "" ? "0" : combined);
}

export function formatUnits(value, decimals) {
  const v = BigInt(value);
  const negative = v < 0n;
  const abs = negative ? -v : v;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = (abs % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  const out = frac ? `${whole}.${frac}` : `${whole}`;
  return negative ? `-${out}` : out;
}

// Format base units to a Number (for UI convenience — safe for typical balances).
export function toNumber(value, decimals) {
  return Number(formatUnits(value, decimals));
}
