import React, { useState } from 'react';
import { ExternalLink, ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Copy, Check, Fuel, Clock } from 'lucide-react';
import { ActivityItem } from '../types/portfolio';

interface ActivityLogProps {
  activities: ActivityItem[];
  network: string;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, network }) => {
  const [copiedDigest, setCopiedDigest] = useState<string | null>(null);

  const handleCopy = (digest: string) => {
    navigator.clipboard.writeText(digest);
    setCopiedDigest(digest);
    setTimeout(() => setCopiedDigest(null), 2000);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />;
      case 'stake':
      case 'deposit':
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
      case 'unstake':
      case 'borrow':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent On-Chain Activity</h3>
          <p className="text-xs text-zinc-400">Programmable transaction blocks executed on Sui</p>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {activities.length} Recorded
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-6 text-center text-xs text-zinc-400">
          No recent transaction blocks found for this address.
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((item) => {
            const explorerUrl =
              network === 'mainnet'
                ? `https://suiscan.xyz/mainnet/tx/${item.digest}`
                : `https://suiscan.xyz/testnet/tx/${item.digest}`;

            return (
              <div
                key={item.digest}
                className="bg-zinc-950/70 border border-zinc-850/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Left: type icon & description */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-200">
                      {item.description}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-zinc-500 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400/90 capitalize">{item.status}</span>
                    </div>
                  </div>
                </div>

                {/* Right: amount, gas, digest links */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 pl-11 sm:pl-0">
                  <div className="text-right">
                    <span className="font-semibold text-zinc-100 block mono-num">
                      {item.amount}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center space-x-1 sm:justify-end mono-num">
                      <Fuel className="w-2.5 h-2.5 text-zinc-500" />
                      <span>{item.gasFeeSui.toFixed(4)} SUI</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-zinc-400 font-mono text-[11px]">
                    <button
                      onClick={() => handleCopy(item.digest)}
                      className="p-1.5 hover:text-zinc-200 hover:bg-zinc-850 rounded transition"
                      title="Copy transaction digest"
                    >
                      {copiedDigest === item.digest ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 hover:text-sky-400 hover:bg-zinc-850 rounded transition"
                      title="View PTB on SuiScan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

