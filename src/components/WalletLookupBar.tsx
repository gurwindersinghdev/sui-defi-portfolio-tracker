import React, { useState } from 'react';
import { Search, RotateCw, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { PRESET_WALLETS, DEFAULT_PRESET_ADDRESS } from '../services/mockData';

interface WalletLookupBarProps {
  currentAddress: string;
  onSelectAddress: (addr: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  network: string;
}

export const WalletLookupBar: React.FC<WalletLookupBarProps> = ({
  currentAddress,
  onSelectAddress,
  onRefresh,
  isLoading,
  network,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSelectAddress(inputVal.trim());
      setInputVal('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl =
    network === 'mainnet'
      ? `https://suiscan.xyz/mainnet/account/${currentAddress}`
      : `https://suiscan.xyz/testnet/account/${currentAddress}`;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl space-y-3.5">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search any Sui address (0x...) or SuiNS domain (.sui)..."
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50 transition font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition border border-zinc-700/60 active:scale-95 shrink-0"
        >
          Inspect
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition border border-zinc-800 shrink-0 disabled:opacity-50"
          title="Refresh On-Chain Data"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </form>

      {/* Preset Quick Selectors & Active Account metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-zinc-850 text-xs">
        {/* Presets */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-zinc-500 font-medium mr-1 hidden sm:inline">Presets:</span>
          {Object.entries(PRESET_WALLETS).map(([addr, data]) => {
            const isSelected = addr.toLowerCase() === currentAddress.toLowerCase();
            return (
              <button
                key={addr}
                type="button"
                onClick={() => onSelectAddress(addr)}
                className={`px-2.5 py-1 rounded-lg text-xs transition border font-medium flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 font-semibold shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span>{data.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Address Actions */}
        <div className="flex items-center space-x-2 text-zinc-400 font-mono text-[11px]">
          <span className="text-zinc-500 hidden md:inline">Tracking:</span>
          <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80 text-zinc-300">
            {currentAddress.slice(0, 8)}...{currentAddress.slice(-6)}
          </span>
          <button
            onClick={handleCopy}
            className="hover:text-zinc-200 p-1 hover:bg-zinc-800 rounded transition"
            title="Copy address"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-400 p-1 hover:bg-zinc-800 rounded transition"
            title="View on SuiScan"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

