import React from 'react';
import { useCurrentAccount, useDAppKit, useWallets } from '@mysten/dapp-kit-react';
import { SuiNetwork } from '../services/suiClient';
import { Sparkles, ExternalLink } from 'lucide-react';

interface HeaderProps {
  network: SuiNetwork;
  setNetwork: (net: SuiNetwork) => void;
  onOpenSkills: () => void;
  simulatedAddress: string | null;
  onConnectSimulated: () => void;
  onDisconnectSimulated: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  network,
  setNetwork,
  onOpenSkills,
  simulatedAddress,
  onConnectSimulated,
  onDisconnectSimulated,
}) => {
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const wallets = useWallets();

  const activeAddress = account?.address || simulatedAddress;

  const handleWalletClick = () => {
    if (activeAddress) {
      if (account) {
        dAppKit.disconnectWallet();
      }
      onDisconnectSimulated();
    } else {
      if (wallets.length > 0) {
        dAppKit.connectWallet({ wallet: wallets[0] });
      } else {
        onConnectSimulated();
      }
    }
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-sky-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.5C12 2.5 5 11.5 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11.5 12 2.5 12 2.5ZM12 20.5C9.515 20.5 7.5 18.485 7.5 16C7.5 13.2 10.5 7.8 12 5.5C13.5 7.8 16.5 13.2 16.5 16C16.5 18.485 14.485 20.5 12 20.5Z" />
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-base tracking-tight text-white">
              Sui<span className="text-sky-400">Portfolio</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              DeFi
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5">
          {/* Mysten Labs Agent Skills badge button */}
          <button
            onClick={onOpenSkills}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-sky-950/30 border border-sky-800/50 text-sky-300 hover:bg-sky-900/40 text-xs transition"
            title="View 31 Mysten Labs Skills"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Sui Agent Skills (31)</span>
          </button>

          {/* Network Switcher */}
          <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-xs">
            {(['mainnet', 'testnet'] as SuiNetwork[]).map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={`px-2.5 py-1 rounded-md capitalize transition font-medium ${
                  network === net
                    ? 'bg-zinc-800 text-sky-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {net}
              </button>
            ))}
          </div>

          {/* Wallet Button */}
          <button
            onClick={handleWalletClick}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeAddress
                ? 'bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-rose-500/50 font-mono'
                : 'bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold shadow-sm'
            }`}
          >
            {activeAddress ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
                </span>
              </>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
