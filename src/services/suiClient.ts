import { SuiGrpcClient } from '@mysten/sui/grpc';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { PortfolioSummary, TokenBalance, StakedSuiPosition, ActivityItem } from '../types/portfolio';
import { KNOWN_SUI_TOKENS, PRESET_WALLETS, DEFAULT_PRESET_ADDRESS } from './mockData';
import { GRPC_URLS } from '../dapp-kit';

export type SuiNetwork = 'mainnet' | 'testnet';

const clientCache: Record<string, SuiGrpcClient> = {};

export function getGrpcClient(network: SuiNetwork = 'mainnet'): SuiGrpcClient {
  if (!clientCache[network]) {
    clientCache[network] = new SuiGrpcClient({
      network,
      baseUrl: GRPC_URLS[network],
    });
  }
  return clientCache[network];
}

export async function fetchSuiPortfolio(
  address: string,
  network: SuiNetwork = 'mainnet'
): Promise<PortfolioSummary> {
  const normalizedAddress = address.trim().toLowerCase();

  // If it's a preset demo wallet, return instant enriched profile
  if (PRESET_WALLETS[normalizedAddress]) {
    return {
      ...PRESET_WALLETS[normalizedAddress],
      address: normalizedAddress,
    };
  }

  // Query live Sui network via modern SuiGrpcClient
  try {
    const client = getGrpcClient(network);

    // 1. Fetch coin balances via listBalances (v2 SDK API)
    const balancesResponse = await client.listBalances({ owner: normalizedAddress });
    const rawBalances = balancesResponse.balances || [];

    const tokens: TokenBalance[] = [];
    let totalLiquidTokensUsd = 0;

    for (const item of rawBalances) {
      const coinType = item.coinType;
      const known = KNOWN_SUI_TOKENS.find(
        (t) => t.coinType.toLowerCase() === coinType.toLowerCase()
      );

      const decimals = known ? known.decimals : 9;
      const rawBalance = item.balance || item.coinBalance || '0';
      const numericBalance = Number(rawBalance) / Math.pow(10, decimals);
      const priceUsd = known ? known.priceUsd : coinType.endsWith('::sui::SUI') ? 2.24 : 0;
      const valueUsd = numericBalance * priceUsd;
      const change24h = known ? known.change24h : 0;

      const symbol = known ? known.symbol : coinType.split('::').pop() || 'TOKEN';
      const name = known ? known.name : symbol;
      const iconUrl = known?.iconUrl;

      tokens.push({
        coinType,
        symbol,
        name,
        decimals,
        rawBalance,
        balance: numericBalance,
        priceUsd,
        valueUsd,
        change24h,
        iconUrl,
        verified: !!known,
      });

      totalLiquidTokensUsd += valueUsd;
    }

    // Default SUI token placeholder if empty wallet
    if (tokens.length === 0) {
      tokens.push({
        coinType: '0x2::sui::SUI',
        symbol: 'SUI',
        name: 'Sui',
        decimals: 9,
        rawBalance: '0',
        balance: 0,
        priceUsd: 2.24,
        valueUsd: 0,
        change24h: 4.82,
        iconUrl: 'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png',
        verified: true,
      });
    }

    return {
      address: normalizedAddress,
      netWorthUsd: totalLiquidTokensUsd,
      netWorthChange24hUsd: totalLiquidTokensUsd * 0.035,
      netWorthChange24hPercent: 3.5,
      totalLiquidTokensUsd,
      totalStakedSuiUsd: 0,
      totalDefiSupplyUsd: 0,
      totalDefiBorrowUsd: 0,
      tokens,
      stakes: [],
      defiPositions: [],
      recentActivity: [],
      healthFactor: null,
    };
  } catch (error) {
    console.warn('Falling back to default profile:', error);
    return PRESET_WALLETS[DEFAULT_PRESET_ADDRESS];
  }
}
