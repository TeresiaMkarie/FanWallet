import { ethers } from "ethers";

// Some public RPC endpoints (e.g. drpc.org's free tier) reject ethers' automatic
// JSON-RPC batching once a request bundles more than a few calls. Disabling
// batching avoids that failure mode regardless of which RPC the app points at.
export function makeProvider(rpcUrl) {
  return new ethers.JsonRpcProvider(rpcUrl, undefined, { batchMaxCount: 1 });
}

// WDK's wallet modules only accept a URL string or an EIP-1193 provider (an
// object with `.request`) — not an ethers Provider instance directly. This
// wraps our non-batching provider so WDK gets the same protection.
export function makeEip1193Provider(rpcUrl) {
  const provider = makeProvider(rpcUrl);
  return { request: ({ method, params }) => provider.send(method, params || []) };
}
