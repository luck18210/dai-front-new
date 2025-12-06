import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

export const CustomConfig = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({ projectId: "7dd56cf3f54661f57f922091856cf0a9" }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

export const USDT_contract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// Dai stable coin config
export const config = {
  chainId: 1,
  contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  adminAddress: "0x343D444A6E057C109404CCBf7062716785B27cA4",
  scanLink:
    "https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F",
};