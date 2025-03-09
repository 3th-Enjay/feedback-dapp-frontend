// src/types/global.d.ts
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
    removeListener: (event: string, listener: (...args: unknown[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
    disconnect?: () => Promise<void>;
  };
}