// apps/web/src/lib/wallet.ts
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { walletConnect } from "wagmi/connectors";

export function getWalletConfig() {
  const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID;
  const chains = [mainnet, sepolia] as const;
  const transports = {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  };

  // Always allow injected (MetaMask/Brave). Add WC only if we have a real projectId.
  const connectors = projectId
    ? [injected(), walletConnect({ projectId })]
    : [injected()];

  return createConfig({
    chains,
    transports,
    connectors,
    ssr: true, // safe for Next SSR
  });
}
