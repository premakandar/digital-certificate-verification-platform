import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';

interface WalletState {
  address: string | null;
  setAddress: (address: string | null) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

let initialized = false;

export function initWalletKit() {
  if (typeof window !== 'undefined' && !initialized) {
    StellarWalletsKit.init({
      network: 'TESTNET' as any,
      selectedWalletId: 'freighter',
      modules: [new FreighterModule()],
    });
    initialized = true;
  }
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      connect: async () => {
        initWalletKit();
        try {
          const { address } = await StellarWalletsKit.authModal();
          set({ address });
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          throw error;
        }
      },
      disconnect: () => {
        StellarWalletsKit.disconnect().catch(console.error);
        set({ address: null });
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
