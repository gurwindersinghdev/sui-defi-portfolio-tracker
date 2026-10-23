import React from 'react';
import { Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { DeFiPosition, StakedSuiPosition } from '../types/portfolio';

interface DefiSummaryProps {
  defiPositions: DeFiPosition[];
  stakes: StakedSuiPosition[];
}

export const DefiSummary: React.FC<DefiSummaryProps> = ({ defiPositions, stakes }) => {
  const suiPrice = 2.24;

  if (defiPositions.length === 0 && stakes.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">DeFi & Staking Positions</h3>
          <p className="text-xs text-zinc-400">Active validator delegations and protocol venues</p>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {stakes.length + defiPositions.length} Positions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Native Staking Card */}
        {stakes.map((stake) => (
          <div
            key={stake.id}
            className="bg-zinc-950/70 border border-zinc-850 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-semibold text-zinc-100">
                    {stake.validatorName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                    PoS
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {stake.principal.toLocaleString()} SUI staked
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-white mono-num block">
                ${(stake.principal * suiPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-emerald-400 font-semibold mono-num">
                {stake.apy.toFixed(2)}% APY
              </span>
            </div>
          </div>
        ))}

        {/* DeFi Positions (Navi, Cetus, Scallop) */}
        {defiPositions.map((pos) => (
          <div
            key={pos.id}
            className="bg-zinc-950/70 border border-zinc-850 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={pos.protocolIcon}
                  alt={pos.protocol}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-semibold text-zinc-100">{pos.protocol}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-sky-400">
                    {pos.type}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 truncate block max-w-[140px] sm:max-w-[180px]">
                  {pos.asset}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-white mono-num block">
                ${pos.suppliedValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-emerald-400 font-semibold mono-num">
                {pos.apy.toFixed(1)}% APY
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

