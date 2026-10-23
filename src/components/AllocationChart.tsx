import React from 'react';
import { PieChart, Layers } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';

interface AllocationChartProps {
  portfolio: PortfolioSummary;
}

const PALETTE = [
  '#38bdf8', // sky-400
  '#34d399', // emerald-400
  '#818cf8', // indigo-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#2dd4bf', // teal-400
  '#94a3b8', // slate-400
];

export const AllocationChart: React.FC<AllocationChartProps> = ({ portfolio }) => {
  const total = portfolio.netWorthUsd || 1;

  // Aggregate segments
  const segments: { label: string; value: number; color: string; sub?: string }[] = [];

  // 1. SUI Liquid
  const suiToken = portfolio.tokens.find((t) => t.symbol === 'SUI');
  if (suiToken && suiToken.valueUsd > 1) {
    segments.push({
      label: 'SUI (Liquid)',
      value: suiToken.valueUsd,
      color: PALETTE[0],
      sub: `${suiToken.balance.toLocaleString()} SUI`,
    });
  }

  // 2. Staked SUI
  if (portfolio.totalStakedSuiUsd > 1) {
    segments.push({
      label: 'Staked SUI (Validators)',
      value: portfolio.totalStakedSuiUsd,
      color: PALETTE[2],
      sub: `${portfolio.stakes.length} positions`,
    });
  }

  // 3. USDC Stable
  const usdcToken = portfolio.tokens.find((t) => t.symbol === 'USDC');
  if (usdcToken && usdcToken.valueUsd > 1) {
    segments.push({
      label: 'USDC (Stable)',
      value: usdcToken.valueUsd,
      color: PALETTE[1],
      sub: `$${usdcToken.balance.toLocaleString()}`,
    });
  }

  // 4. DeFi Protocols
  for (let i = 0; i < portfolio.defiPositions.length; i++) {
    const pos = portfolio.defiPositions[i];
    segments.push({
      label: `${pos.protocol} ${pos.type === 'Lending' ? 'Lend' : 'LP'}`,
      value: pos.suppliedValueUsd,
      color: PALETTE[(3 + i) % PALETTE.length],
      sub: `${pos.apy}% APY`,
    });
  }

  // 5. Other tokens
  const otherTokens = portfolio.tokens.filter(
    (t) => t.symbol !== 'SUI' && t.symbol !== 'USDC' && t.valueUsd > 1
  );
  for (let i = 0; i < otherTokens.length; i++) {
    const t = otherTokens[i];
    segments.push({
      label: t.symbol,
      value: t.valueUsd,
      color: PALETTE[(5 + i) % PALETTE.length],
      sub: `${t.balance.toLocaleString()} ${t.symbol}`,
    });
  }

  // Sort descending
  segments.sort((a, b) => b.value - a.value);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-white tracking-tight">Asset Allocation</h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {segments.length} Components
        </span>
      </div>

      {/* Visual Multi-segment Progress Bar */}
      <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800/80 p-0.5">
        {segments.map((seg, idx) => {
          const pct = Math.max(1, (seg.value / total) * 100);
          return (
            <div
              key={idx}
              style={{
                width: `${pct}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${pct.toFixed(1)}% ($${seg.value.toLocaleString()})`}
              className="h-full rounded-sm transition-all hover:opacity-85"
            />
          );
        })}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1 text-xs">
        {segments.slice(0, 8).map((seg, idx) => {
          const pct = ((seg.value / total) * 100).toFixed(1);
          return (
            <div
              key={idx}
              className="bg-zinc-950/70 border border-zinc-850/80 rounded-lg p-2 flex flex-col justify-between"
            >
              <div className="flex items-center space-x-1.5 mb-1 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-medium text-zinc-300 truncate" title={seg.label}>
                  {seg.label}
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-[11px]">
                <span className="text-white font-semibold">{pct}%</span>
                <span className="text-zinc-500">${seg.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

