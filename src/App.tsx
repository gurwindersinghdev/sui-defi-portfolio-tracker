import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { Header } from './components/Header';
import { CoinList } from './components/CoinList';
import { DefiSummary } from './components/DefiSummary';
import { SkillsViewerModal } from './components/SkillsViewerModal';
import { SuiNetwork, fetchSuiPortfolio } from './services/suiClient';
import { DEFAULT_PRESET_ADDRESS, PRESET_WALLETS } from './services/mockData';
import { PortfolioSummary } from './types/portfolio';
import {
  Search,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  Coins,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export function App() {
  const currentAccount = useCurrentAccount();

  const [network, setNetwork] = useState<SuiNetwork>('mainnet');
  const [currentAddress, setCurrentAddress] = useState<string>(DEFAULT_PRESET_ADDRESS);
  const [searchInput, setSearchInput] = useState<string>('');
  const [portfolio, setPortfolio] = useState<PortfolioSummary>(
    PRESET_WALLETS[DEFAULT_PRESET_ADDRESS]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState<boolean>(false);
  const [simulatedAddress, setSimulatedAddress] = useState<string | null>(null);

  // Sync if browser wallet connects
  useEffect(() => {
    if (currentAccount?.address) {
      setCurrentAddress(currentAccount.address);
      setSimulatedAddress(currentAccount.address);
    }
  }, [currentAccount]);

  // Load portfolio on address or network change
  const loadPortfolio = async (address: string, net: SuiNetwork) => {
    setIsLoading(true);
    try {
      const data = await fetchSuiPortfolio(address, net);
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio(currentAddress, network);
  }, [currentAddress, network]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentAddress(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPositive = portfolio.netWorthChange24hPercent >= 0;
  const explorerUrl = `https://suiscan.xyz/${network}/account/${currentAddress}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Minimal Header */}
      <Header
        network={network}
        setNetwork={setNetwork}
        onOpenSkills={() => setIsSkillsModalOpen(true)}
        simulatedAddress={simulatedAddress}
        onConnectSimulated={() => setSimulatedAddress(currentAddress)}
        onDisconnectSimulated={() => setSimulatedAddress(null)}
      />

      {/* Main Single-Column Simplistic Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Address Input & Presets Bar */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Track any Sui address (0x...) or SuiNS domain (.sui)..."
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs sm:text-sm font-medium rounded-xl border border-zinc-700/60 transition"
            >
              Track
            </button>
            <button
              type="button"
              onClick={() => loadPortfolio(currentAddress, network)}
              disabled={isLoading}
              className="p-2 text-zinc-400 hover:text-zinc-200 rounded-xl border border-zinc-800 hover:bg-zinc-850 transition"
              title="Refresh on-chain data"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </form>

          {/* Presets & Active Address */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-850/60 text-xs">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-zinc-500 font-medium mr-1">Presets:</span>
              {Object.entries(PRESET_WALLETS).map(([addr, data]) => {
                const isSelected = addr.toLowerCase() === currentAddress.toLowerCase();
                return (
                  <button
                    key={addr}
                    onClick={() => setCurrentAddress(addr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {data.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px] text-zinc-400">
              <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}
              </span>
              <button
                onClick={handleCopy}
                className="hover:text-zinc-200 p-1 rounded"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 p-1 rounded"
                title="View on SuiScan"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Net Worth Display */}
        <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-5">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs uppercase tracking-wider font-medium mb-1">
              <span>Total Portfolio Value</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="flex items-baseline space-x-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mono-num">
                ${portfolio.netWorthUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>

              <div
                className={`inline-flex items-center space-x-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? '+' : ''}
                  {portfolio.netWorthChange24hPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* 3 Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-zinc-800/60">
            <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Liquid Coins</span>
                <Coins className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-white mono-num">
                ${portfolio.totalLiquidTokensUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {portfolio.tokens.length} assets held
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Staked SUI (Validators)</span>
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-white mono-num">
                ${portfolio.totalStakedSuiUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">
                ~3.40% staking APY
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>DeFi Lending & LP</span>
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-white mono-num">
                ${portfolio.totalDefiSupplyUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Navi, Scallop, Cetus
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY FOCUS: Coin List */}
        <CoinList
          tokens={portfolio.tokens}
          totalValueUsd={portfolio.totalLiquidTokensUsd}
        />

        {/* Secondary: DeFi & Validator Staking summary */}
        <DefiSummary
          defiPositions={portfolio.defiPositions}
          stakes={portfolio.stakes}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-850 bg-zinc-950/80 py-5 mt-12 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sui gRPC Fullnode</span>
            <span>•</span>
            <span className="font-mono text-zinc-400">{network}</span>
            <span>•</span>
            <span className="text-zinc-400">@mysten/dapp-kit-react 2.1</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSkillsModalOpen(true)}
              className="text-zinc-400 hover:text-sky-400 transition"
            >
              Mysten Labs Skills (31)
            </button>
            <span>•</span>
            <span className="font-mono text-zinc-400">pnpm</span>
          </div>
        </div>
      </footer>

      {/* Skills Viewer Modal */}
      <SkillsViewerModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
      />
    </div>
  );
}

export default App;
