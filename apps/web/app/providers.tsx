// apps/web/app/providers.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { getWalletConfig } from "@/lib/wallet";

// client-only RainbowKit to avoid running during SSG
const RainbowKitProvider = dynamic(
  () => import("@rainbow-me/rainbowkit").then(m => m.RainbowKitProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const hasProjectId = Boolean(process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID);

  return (
    <WagmiProvider config={getWalletConfig()}>
      <QueryClientProvider client={queryClient}>
        {hasProjectId ? (
          <RainbowKitProvider>{children}</RainbowKitProvider>
        ) : (
          children
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
