// WDK's WalletAccountEvm already knows the standard ERC20 surface (balanceOf,
// transfer, approve). This fragment covers only the one non-standard method our
// test token adds, for the treasury's minting calls.
export const MINTABLE_ERC20_ABI = ["function mint(address to, uint256 amount) external"];
