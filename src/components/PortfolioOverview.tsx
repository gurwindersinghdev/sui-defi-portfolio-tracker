import React from 'react';
import { TrendingUp, TrendingDown, Layers, Shield, Coins, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';

interface PortfolioOverviewProps {
  portfolio: PortfolioSummary;
  currency: 'USD' | 'SUI' | 'EUR';
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio, currency }) => {
  const suiPrice = 2.24;
  const eurRate = 0.92;

  const formatValue = (usd: number) => {
    if (currency === 'SUI') {
      const suiVal = usd / suiPrice;
      return `${suiVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SUI`;
    }
    if (currency === 'EUR') {
      const eurVal = usd * eurRate;
      return `€${eurVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isPositive = portfolio.netWorthChange24hPercent >= 0;

  return (
    <div className="space-y-4">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs uppercase tracking-wider font-medium mb-1.5">
              <span>Total Net Worth</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-500 normal-case">Live On-Chain</span>
            </div>

            <div className="flex items-baseline space-x-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mono-num">
                {formatValue(portfolio.netWorthUsd)}
              </h1>
            </div>

            {/* 24h Change */}
            <div className="flex items-center space-x-2.5 mt-2.5">
              <div
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {portfolio.netWorthChange24hPercent.toFixed(2)}%
                </span>
                <span className="opacity-75">
                  ({isPositive ? '+' : ''}
                  {formatValue(Math.abs(portfolio.netWorthChange24hUsd))})
                </span>
              </div>
              <span className="text-xs text-zinc-500">past 24 hours</span>
            </div>
          </div>

          {/* Health factor & Quick Stat summary */}
          <div className="flex flex-wrap items-center gap-3">
            {portfolio.healthFactor !== null ? (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 min-w-[140px]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Health Factor</span>
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className={`text-xl font-bold mono-num ${
                      portfolio.healthFactor >= 2.0
                        ? 'text-emerald-400'
                        : portfolio.healthFactor >= 1.4
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {portfolio.healthFactor.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">
                    {portfolio.healthFactor >= 2.0 ? 'Safe' : 'Watch'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 min-w-[140px]">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Borrow Risk</span>
                  <Shield className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <span className="text-sm font-medium text-zinc-300">No Active Debt</span>
              </div>
            )}

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 min-w-[140px]">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Active Protocols</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-xl font-bold text-white mono-num">
                {portfolio.defiPositions.length + (portfolio.stakes.length > 0 ? 1 : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Bottom Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/60">
          {/* 1. Liquid Tokens */}
          <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Liquid Tokens</span>
              <Coins className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-base sm:text-lg font-semibold text-white mono-num">
              {formatValue(portfolio.totalLiquidTokensUsd)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              {portfolio.tokens.length} assets held
            </div>
          </div>

          {/* 2. Staked SUI */}
          <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Staked SUI</span>
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-base sm:text-lg font-semibold text-white mono-num">
              {formatValue(portfolio.totalStakedSuiUsd)}
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-0.5">
              ~3.40% avg APY
            </div>
          </div>

          {/* 3. DeFi Supply / LP */}
          <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>DeFi Supply & LP</span>
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-base sm:text-lg font-semibold text-white mono-num">
              {formatValue(portfolio.totalDefiSupplyUsd)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Navi, Scallop, Cetus
            </div>
          </div>

          {/* 4. Total Debt */}
          <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Total Borrowed</span>
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-base sm:text-lg font-semibold text-white mono-num">
              {formatValue(portfolio.totalDefiBorrowUsd)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              {portfolio.totalDefiBorrowUsd > 0 ? 'Active lending obligation' : 'Zero debt'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

