import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Copy, Check, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { TokenBalance } from '../types/portfolio';

interface TokenListProps {
  tokens: TokenBalance[];
  totalValueUsd: number;
}

export const TokenList: React.FC<TokenListProps> = ({ tokens, totalValueUsd }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (coinType: string) => {
    navigator.clipboard.writeText(coinType);
    setCopiedType(coinType);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const sortedTokens = [...tokens].sort((a, b) => b.valueUsd - a.valueUsd);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Liquid Assets</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Tokens held directly in the wallet</p>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {sortedTokens.length} Tokens
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-950/40 text-zinc-400 font-medium">
              <th className="py-3 px-4 sm:px-6">Asset</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">24h Change</th>
              <th className="py-3 px-4 text-right">Balance</th>
              <th className="py-3 px-4 text-right">Value (USD)</th>
              <th className="py-3 px-4 text-right">Share</th>
              <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850/60">
            {sortedTokens.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  No liquid tokens found for this address.
                </td>
              </tr>
            ) : (
              sortedTokens.map((token) => {
                const sharePct = totalValueUsd > 0 ? ((token.valueUsd / totalValueUsd) * 100).toFixed(1) : '0.0';
                const isPositive = token.change24h >= 0;

                return (
                  <tr
                    key={token.coinType}
                    className="hover:bg-zinc-850/30 transition group"
                  >
                    {/* Asset Name & Icon */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center overflow-hidden shrink-0">
                          {token.iconUrl ? (
                            <img
                              src={token.iconUrl}
                              alt={token.symbol}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-bold text-[10px] text-sky-400">
                              {token.symbol.slice(0, 3)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-semibold text-zinc-100">{token.symbol}</span>
                            {token.verified && (
                              <span title="Verified Sui Asset">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 block truncate max-w-[120px] sm:max-w-[180px]">
                            {token.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right mono-num font-medium text-zinc-200">
                      ${token.priceUsd < 0.01 ? token.priceUsd.toFixed(5) : token.priceUsd.toFixed(2)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 px-4 text-right mono-num">
                      <span
                        className={`inline-flex items-center space-x-0.5 text-xs font-medium ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{Math.abs(token.change24h).toFixed(2)}%</span>
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 text-right mono-num">
                      <div className="font-semibold text-zinc-100">
                        {token.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {token.symbol}
                      </div>
                    </td>

                    {/* USD Value */}
                    <td className="py-3.5 px-4 text-right mono-num font-semibold text-zinc-100">
                      ${token.valueUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Portfolio Share */}
                    <td className="py-3.5 px-4 text-right mono-num text-zinc-400">
                      {sharePct}%
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center space-x-1 text-zinc-400">
                        <button
                          onClick={() => handleCopy(token.coinType)}
                          className="p-1.5 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
                          title="Copy Coin Type"
                        >
                          {copiedType === token.coinType ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={`https://suiscan.xyz/mainnet/coin/${token.coinType}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:text-sky-400 hover:bg-zinc-800 rounded transition"
                          title="View on Explorer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
