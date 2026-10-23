import React from 'react';
import { Layers, ShieldCheck, Sparkles, AlertCircle, ArrowUpRight, CheckCircle, ExternalLink } from 'lucide-react';
import { DeFiPosition, StakedSuiPosition } from '../types/portfolio';

interface DefiPositionsProps {
  defiPositions: DeFiPosition[];
  stakes: StakedSuiPosition[];
}

export const DefiPositions: React.FC<DefiPositionsProps> = ({ defiPositions, stakes }) => {
  const suiPrice = 2.24;

  return (
    <div className="space-y-6">
      {/* 1. Native Sui Validator Staking */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sui Native Validator Staking</h3>
              <p className="text-xs text-zinc-400">Direct on-chain PoS delegation with 0 smart-contract risk</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            ~3.40% Net APY
          </span>
        </div>

        {stakes.length === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-5 text-center text-xs text-zinc-400">
            No active validator stakes found for this wallet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stakes.map((stake) => (
              <div
                key={stake.id}
                className="bg-zinc-950/70 border border-zinc-850/90 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-zinc-200">
                      {stake.validatorName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Epoch #{stake.stakeActiveEpoch}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-850/60">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Principal Staked</span>
                    <span className="text-sm font-semibold text-white mono-num">
                      {stake.principal.toLocaleString()} SUI
                    </span>
                    <span className="text-[10px] text-zinc-400 block mono-num">
                      ≈ ${(stake.principal * suiPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Accrued Reward</span>
                    <span className="text-sm font-semibold text-emerald-400 mono-num">
                      +{stake.estimatedReward.toFixed(2)} SUI
                    </span>
                    <span className="text-[10px] text-emerald-400/80 block mono-num">
                      ≈ +${(stake.estimatedReward * suiPrice).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. DeFi Protocol Positions (Navi, Cetus, Scallop) */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">DeFi Protocol Positions</h3>
            <p className="text-xs text-zinc-400">Lending, borrowing, and concentrated liquidity pools</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {defiPositions.length} Active Venues
          </span>
        </div>

        {defiPositions.length === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-6 text-center text-xs text-zinc-400">
            No active positions detected in Navi, Scallop, or Cetus for this account.
          </div>
        ) : (
          <div className="space-y-3">
            {defiPositions.map((pos) => (
              <div
                key={pos.id}
                className="bg-zinc-950/70 border border-zinc-850/90 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center overflow-hidden shrink-0">
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
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-zinc-100">{pos.protocol}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 border border-zinc-700/60">
                        {pos.type}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300 font-medium mt-0.5">
                      {pos.asset}
                    </div>
                    {pos.details && (
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {pos.details}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right stats */}
                <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Supplied</span>
                    <span className="text-sm font-semibold text-white mono-num">
                      ${pos.suppliedValueUsd.toLocaleString()}
                    </span>
                  </div>

                  {pos.borrowedValueUsd && pos.borrowedValueUsd > 0 && (
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Borrowed</span>
                      <span className="text-sm font-semibold text-rose-400 mono-num">
                        ${pos.borrowedValueUsd.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-zinc-500 block text-[11px]">Net APY</span>
                    <span className="text-sm font-semibold text-emerald-400 mono-num">
                      {pos.apy.toFixed(1)}%
                    </span>
                  </div>

                  {pos.rewardsPendingUsd && (
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Pending Rewards</span>
                      <span className="text-xs font-semibold text-amber-300 mono-num">
                        +${pos.rewardsPendingUsd.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {pos.healthFactor && (
                    <div className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block">Health Factor</span>
                      <span className="text-xs font-bold text-emerald-400 mono-num">
                        {pos.healthFactor.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

