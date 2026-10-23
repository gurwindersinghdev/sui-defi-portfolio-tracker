export interface TokenBalance {
  coinType: string;
  symbol: string;
  name: string;
  decimals: number;
  rawBalance: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
  iconUrl?: string;
  verified: boolean;
}

export interface StakedSuiPosition {
  id: string;
  validatorAddress: string;
  validatorName: string;
  principal: number; // in SUI
  estimatedReward: number; // in SUI
  apy: number; // percentage
  status: 'Active' | 'Pending' | 'Unstaked';
  stakeActiveEpoch: number;
}

export type ProtocolType = 'Navi' | 'Scallop' | 'Cetus' | 'Turbos' | 'Suilend' | 'DeepBook';

export interface DeFiPosition {
  id: string;
  protocol: ProtocolType;
  protocolIcon: string;
  type: 'Lending' | 'Borrowing' | 'LiquidityPool' | 'Orderbook';
  asset: string;
  suppliedAmount: number;
  suppliedValueUsd: number;
  borrowedAmount?: number;
  borrowedValueUsd?: number;
  apy: number;
  rewardsPendingUsd?: number;
  healthFactor?: number;
  details?: string;
}

export interface ActivityItem {
  digest: string;
  timestamp: number;
  type: 'swap' | 'stake' | 'unstake' | 'deposit' | 'borrow' | 'repay' | 'transfer';
  status: 'success' | 'failure';
  description: string;
  amount: string;
  gasFeeSui: number;
}

export interface PortfolioSummary {
  address: string;
  name?: string;
  netWorthUsd: number;
  netWorthChange24hUsd: number;
  netWorthChange24hPercent: number;
  totalLiquidTokensUsd: number;
  totalStakedSuiUsd: number;
  totalDefiSupplyUsd: number;
  totalDefiBorrowUsd: number;
  tokens: TokenBalance[];
  stakes: StakedSuiPosition[];
  defiPositions: DeFiPosition[];
  recentActivity: ActivityItem[];
  healthFactor: number | null;
}

export interface AgentRecommendation {
  id: string;
  category: 'yield' | 'risk' | 'rebalance' | 'hygiene';
  severity: 'info' | 'warning' | 'opportunity';
  title: string;
  description: string;
  actionLabel?: string;
  estimatedImpact?: string;
  protocol?: string;
}

export interface AgentSkillDefinition {
  name: string;
  title: string;
  description: string;
  iconName: string;
  execute: (portfolio: PortfolioSummary, input?: string) => Promise<AgentExecutionResult>;
}

export interface AgentExecutionResult {
  summary: string;
  recommendations: AgentRecommendation[];
  metrics?: Record<string, string | number>;
  rawOutput?: string;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
  skillUsed?: string;
  result?: AgentExecutionResult;
}

