"use client";

import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { AckDialog, FeedbackSheet, ToastHost } from "@/components/overlays";
import { Round2Provider } from "@/lib/round2/context";
import { Round3Provider } from "@/lib/round3/store";
import { Round4Provider } from "@/lib/round4/store";
import { AppStoreProvider } from "@/lib/store";

function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* Install still works from the manifest in supporting browsers. */
    });
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AppStoreProvider>
        <Round2Provider>
          <Round3Provider>
            <Round4Provider>
              <AppShell>{children}</AppShell>
            </Round4Provider>
          </Round3Provider>
        </Round2Provider>
        <AckDialog />
        <FeedbackSheet />
        <ToastHost />
        <PwaRegister />
      </AppStoreProvider>
    </TooltipProvider>
  );
}
