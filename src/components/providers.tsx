"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SonnerToaster position="bottom-right" richColors />
    </>
  );
}