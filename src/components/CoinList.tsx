import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, CheckCircle2, ExternalLink } from 'lucide-react';
import { TokenBalance } from '../types/portfolio';

interface CoinListProps {
  tokens: TokenBalance[];
  totalValueUsd: number;
}

export const CoinList: React.FC<CoinListProps> = ({ tokens, totalValueUsd }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'change'>('value');

  const filteredAndSortedTokens = useMemo(() => {
    return tokens
      .filter(
        (t) =>
          t.symbol.toLowerCase().includes(search.toLowerCase()) ||
          t.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.symbol.localeCompare(b.symbol);
        if (sortBy === 'change') return b.change24h - a.change24h;
        return b.valueUsd - a.valueUsd;
      });
  }, [tokens, search, sortBy]);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Top search & sorting toolbar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Coins & Tokens</h2>
          <p className="text-xs text-zinc-400">All fungible tokens in this portfolio</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coin..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 transition"
            />
          </div>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500/80"
          >
            <option value="value">Sort: Value</option>
            <option value="name">Sort: Name</option>
            <option value="change">Sort: 24h Change</option>
          </select>
        </div>
      </div>

      {/* Coins Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-950/40 text-zinc-400 font-medium">
              <th className="py-3 px-4 sm:px-6">Coin</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">24h Change</th>
              <th className="py-3 px-4 text-right">Holdings</th>
              <th className="py-3 px-4 text-right">Value (USD)</th>
              <th className="py-3 px-4 sm:px-6 text-right">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850/50">
            {filteredAndSortedTokens.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  No coins found matching "{search}"
                </td>
              </tr>
            ) : (
              filteredAndSortedTokens.map((token) => {
                const sharePct =
                  totalValueUsd > 0
                    ? ((token.valueUsd / totalValueUsd) * 100).toFixed(1)
                    : '0.0';
                const isPositive = token.change24h >= 0;

                return (
                  <tr
                    key={token.coinType}
                    className="hover:bg-zinc-850/20 transition group"
                  >
                    {/* Coin details */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-850 border border-zinc-750 flex items-center justify-center overflow-hidden shrink-0">
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
                            <span className="font-semibold text-zinc-100 text-sm">
                              {token.symbol}
                            </span>
                            {token.verified && (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-sky-400 shrink-0"
                              />
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 block truncate max-w-[120px] sm:max-w-[200px]">
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

                    {/* Holdings Balance */}
                    <td className="py-3.5 px-4 text-right mono-num">
                      <div className="font-semibold text-zinc-100">
                        {token.balance.toLocaleString(undefined, {
                          minimumFractionDigits: token.balance < 1 ? 4 : 2,
                          maximumFractionDigits: 4,
                        })}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {token.symbol}
                      </div>
                    </td>

                    {/* Value in USD */}
                    <td className="py-3.5 px-4 text-right mono-num font-semibold text-white text-sm">
                      ${token.valueUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Share & Visual Progress bar */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex flex-col items-end space-y-1">
                        <span className="mono-num text-zinc-300 font-medium">
                          {sharePct}%
                        </span>
                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-400 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(2, Number(sharePct)))}%` }}
                          />
                        </div>
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

