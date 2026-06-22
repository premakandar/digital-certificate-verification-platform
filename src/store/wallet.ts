import { create } from 'zustand';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';

interface WalletState {
  address: string | null;
  kit: StellarWalletsKit;
  setAddress: (address: string | null) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  kit: new StellarWalletsKit({
    network: 'TESTNET' as any,
    selectedWalletId: 'freighter',
    modules: [new FreighterModule()],
  }),
  setAddress: (address) => set({ address }),
  connect: async () => {
    try {
      const { kit } = get();
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          set({ address });
        },
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },
  disconnect: () => {
    set({ address: null });
  },
}));
