import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function compileTestUSDT() {
  const source = fs.readFileSync(path.join(__dirname, "../contracts/TestUSDT.sol"), "utf8");
  const input = {
    language: "Solidity",
    sources: { "TestUSDT.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = (output.errors || []).filter((e) => e.severity === "error");
  if (errors.length) {
    throw new Error("Solidity compile failed:\n" + errors.map((e) => e.formattedMessage).join("\n"));
  }

  const contract = output.contracts["TestUSDT.sol"].TestUSDT;
  return { abi: contract.abi, bytecode: "0x" + contract.evm.bytecode.object };
}
