import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || 'demo';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [injectedWallet, rainbowWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Personalized Discovery App',
    projectId: projectId,
  }
);

export const walletConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors,
  ssr: true, // Important for Next.js App Router
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});