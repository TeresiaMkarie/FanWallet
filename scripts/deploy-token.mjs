import "dotenv/config";
import { ethers } from "ethers";
import { compileTestUSDT } from "./compileToken.mjs";
import { setEnvVar } from "./envFile.mjs";
import { makeProvider } from "../server/rpcProvider.js";

// One-off deploy of our own test USD₮ stand-in (see contracts/TestUSDT.sol),
// since public testnet USDt faucets aren't reliably available. The same key
// deployed here becomes the app's treasury wallet (server/treasury.js), which
// mints test USD₮ and sends a little native gas to every wallet the app creates.

const RPC_URL = process.env.RPC_URL || "https://sepolia.drpc.org";
const CHAIN = process.env.CHAIN || "Sepolia";

async function main() {
  const provider = makeProvider(RPC_URL);

  let privateKey = process.env.TREASURY_PRIVATE_KEY;
  if (!privateKey) {
    const wallet = ethers.Wallet.createRandom();
    setEnvVar("TREASURY_PRIVATE_KEY", wallet.privateKey);
    console.log(`
No treasury wallet configured — generated one and saved it to .env.

  Treasury address: ${wallet.address}

Fund this address with ${CHAIN} test ETH (any public ${CHAIN} ETH faucet) so it
can pay gas to deploy the token and later to mint + fund new wallets. Once
funded, run this script again:

  npm run deploy:token
`);
    return;
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const ethBalance = await provider.getBalance(wallet.address);
  console.log(`Treasury address: ${wallet.address}`);
  console.log(`Treasury balance: ${ethers.formatEther(ethBalance)} native ETH on ${CHAIN}`);
  if (ethBalance === 0n) {
    console.log(`\nThis wallet has no gas yet. Fund it from a ${CHAIN} ETH faucet, then re-run this script.`);
    return;
  }

  console.log("Compiling TestUSDT.sol...");
  const { abi, bytecode } = compileTestUSDT();

  console.log("Deploying...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  setEnvVar("USDT_TOKEN_ADDRESS", address);
  setEnvVar("USDT_DECIMALS", "6");

  console.log(`
Deployed TestUSDT to ${address} and saved USDT_TOKEN_ADDRESS to .env.

The treasury wallet is the token's owner and can mint. Restart the wallet
service (npm run dev:all) — new wallets will be auto-funded with test USD₮
and a little gas.
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
