import { PortfolioSummary, AgentRecommendation, AgentExecutionResult, AgentSkillDefinition } from '../types/portfolio';

export const SUI_AGENT_SKILLS: AgentSkillDefinition[] = [
  {
    name: 'risk_audit',
    title: 'Portfolio Risk Audit',
    description: 'Deep scan of asset concentration, liquidation thresholds, and idle capital.',
    iconName: 'ShieldAlert',
    execute: async (portfolio: PortfolioSummary): Promise<AgentExecutionResult> => {
      const recommendations: AgentRecommendation[] = [];
      const totalValue = portfolio.netWorthUsd || 1;

      // 1. Concentration Check
      const highExposureTokens = portfolio.tokens.filter(
        (t) => (t.valueUsd / totalValue) > 0.45 && t.symbol !== 'USDC'
      );
      if (highExposureTokens.length > 0) {
        for (const token of highExposureTokens) {
          const pct = Math.round((token.valueUsd / totalValue) * 100);
          recommendations.push({
            id: `risk-conc-${token.symbol}`,
            category: 'risk',
            severity: 'warning',
            title: `High ${token.symbol} Concentration (${pct}%)`,
            description: `Over ${pct}% of your portfolio value is tied to ${token.name}. Consider taking partial profits into USDC or diversifying across stable yield pools.`,
            actionLabel: `Diversify ${token.symbol}`,
            estimatedImpact: 'Reduces volatility drawdown by up to ~28%',
          });
        }
      }

      // 2. Health factor check for lending
      if (portfolio.healthFactor !== null) {
        if (portfolio.healthFactor < 1.4) {
          recommendations.push({
            id: 'risk-hf-critical',
            category: 'risk',
            severity: 'warning',
            title: 'Critical Health Factor Alert (< 1.4)',
            description: `Your lending health factor is currently ${portfolio.healthFactor.toFixed(2)}. A sharp market dip in SUI could trigger partial liquidation.`,
            actionLabel: 'Repay Debt / Add Collateral',
            protocol: 'Navi',
            estimatedImpact: 'Prevents liquidation liquidation penalties (up to 8%)',
          });
        } else if (portfolio.healthFactor >= 2.0) {
          recommendations.push({
            id: 'risk-hf-healthy',
            category: 'hygiene',
            severity: 'info',
            title: 'Healthy Lending Margin',
            description: `Your collateral health factor is robust at ${portfolio.healthFactor.toFixed(2)}. Your positions can withstand a ~42% SUI market drop before reaching liquidation threshold.`,
            actionLabel: 'View Positions',
            protocol: 'Navi',
          });
        }
      }

      // 3. Idle liquid SUI check
      const suiToken = portfolio.tokens.find((t) => t.symbol === 'SUI');
      if (suiToken && suiToken.balance > 500) {
        const potentialApy = 3.4;
        const annualYieldSui = (suiToken.balance * (potentialApy / 100)).toFixed(1);
        const annualYieldUsd = (Number(annualYieldSui) * (suiToken.priceUsd || 2.24)).toFixed(0);

        recommendations.push({
          id: 'risk-idle-sui',
          category: 'yield',
          severity: 'opportunity',
          title: `Idle Liquid SUI Detected (${suiToken.balance.toLocaleString()} SUI)`,
          description: `You have ${suiToken.balance.toLocaleString()} liquid SUI in your wallet not earning yield. Staking with a verified Sui validator or Liquid Staking (haSUI/afSUI) can earn ~${potentialApy}% APY.`,
          actionLabel: 'Stake Liquid SUI',
          protocol: 'Mysten Labs Staking',
          estimatedImpact: `+${annualYieldSui} SUI (~$${annualYieldUsd}/yr) passive yield`,
        });
      }

      // 4. Stablecoin reserve check
      const usdcToken = portfolio.tokens.find((t) => t.symbol === 'USDC');
      const stableShare = usdcToken ? (usdcToken.valueUsd / totalValue) * 100 : 0;
      if (stableShare < 10 && totalValue > 1000) {
        recommendations.push({
          id: 'risk-low-stables',
          category: 'rebalance',
          severity: 'warning',
          title: 'Low Stablecoin Buffer (< 10%)',
          description: `Your current stablecoin allocation is only ${stableShare.toFixed(1)}%. Keeping 15-25% in USDC provides dry powder for market corrections and cushions drawdowns.`,
          actionLabel: 'Swap to USDC',
          estimatedImpact: 'Improves portfolio resilience during market volatility',
        });
      }

      const score = Math.max(30, Math.min(98, Math.round(85 - (recommendations.filter(r => r.severity === 'warning').length * 15))));

      return {
        summary: `Risk Audit completed: Portfolio health score is ${score}/100 with ${recommendations.length} action items found.`,
        recommendations,
        metrics: {
          'Safety Score': `${score}/100`,
          'Health Factor': portfolio.healthFactor ? portfolio.healthFactor.toFixed(2) : 'N/A (No Debt)',
          'Stablecoin Allocation': `${stableShare.toFixed(1)}%`,
          'Identified Opportunities': recommendations.filter(r => r.severity === 'opportunity').length,
        },
      };
    },
  },
  {
    name: 'yield_hunter',
    title: 'DeFi Yield Hunter',
    description: 'Finds top yield opportunities across Navi, Scallop, Cetus, and Native Staking.',
    iconName: 'TrendingUp',
    execute: async (portfolio: PortfolioSummary): Promise<AgentExecutionResult> => {
      const recommendations: AgentRecommendation[] = [];

      // Navi USDC lending
      recommendations.push({
        id: 'yield-navi-usdc',
        category: 'yield',
        severity: 'opportunity',
        title: 'Navi Protocol USDC Supply (7.20% APY)',
        description: 'Earn 7.20% net APY (4.1% base USDC interest + 3.1% NAVX token distribution). Fully audited and highest TVL market on Sui.',
        actionLabel: 'Deposit on Navi',
        protocol: 'Navi Protocol',
        estimatedImpact: '7.20% APY on USD capital',
      });

      // Cetus SUI/USDC CLMM
      recommendations.push({
        id: 'yield-cetus-clmm',
        category: 'yield',
        severity: 'opportunity',
        title: 'Cetus Concentrated Pool SUI/USDC (32.8% APY)',
        description: 'High-volume trading pair on Sui. Providing concentrated liquidity within a ±15% price band yields superior trading fee compounding.',
        actionLabel: 'Provide Liquidity',
        protocol: 'Cetus Protocol',
        estimatedImpact: '~32.8% projected APR from swap fees',
      });

      // Scallop SUI lending
      recommendations.push({
        id: 'yield-scallop-sui',
        category: 'yield',
        severity: 'opportunity',
        title: 'Scallop sSUI Market + veSCA Boost (4.85% APY)',
        description: 'Single-sided SUI deposit on Scallop with zero impermanent loss risk. Receive sSUI and lock veSCA for boosted tier rewards.',
        actionLabel: 'Supply to Scallop',
        protocol: 'Scallop',
        estimatedImpact: '+1.45% above native staking baseline',
      });

      // Native Sui Validator Staking
      recommendations.push({
        id: 'yield-native-stake',
        category: 'yield',
        severity: 'info',
        title: 'Native Sui Validator Delegation (3.42% APY)',
        description: 'Zero smart-contract risk. Stake directly with high-performance community validators. Auto-compounds at epoch boundaries.',
        actionLabel: 'Delegate SUI',
        protocol: 'Sui Network System',
        estimatedImpact: 'Secures Sui network with 0 contract risk',
      });

      return {
        summary: 'Identified 4 optimized yield channels across Sui with APYs ranging from 3.42% to 32.80%.',
        recommendations,
        metrics: {
          'Top Stable APY': '7.20% (Navi USDC)',
          'Top LP APY': '32.80% (Cetus CLMM)',
          'Zero-Risk APY': '3.42% (Native Staking)',
        },
      };
    },
  },
  {
    name: 'rebalance_plan',
    title: 'Optimal Rebalancer',
    description: 'Generates targeted PTB rebalancing steps for balanced risk-adjusted returns.',
    iconName: 'Scale',
    execute: async (portfolio: PortfolioSummary): Promise<AgentExecutionResult> => {
      const total = portfolio.netWorthUsd || 1000;
      const recommendations: AgentRecommendation[] = [];

      // Target allocation model:
      // - 40% Staked / Native SUI
      // - 30% USDC Stable Yield
      // - 20% DeFi Liquidity Pools
      // - 10% Ecosystem Governance (CETUS, NAVX, DEEP)

      const targetStaked = total * 0.40;
      const targetStable = total * 0.30;
      const currentStaked = portfolio.totalStakedSuiUsd;
      const currentStable = (portfolio.tokens.find(t => t.symbol === 'USDC')?.valueUsd || 0);

      const stakedDiff = targetStaked - currentStaked;
      const stableDiff = targetStable - currentStable;

      recommendations.push({
        id: 'reb-ptb-1',
        category: 'rebalance',
        severity: 'opportunity',
        title: 'Step 1: Programmable Transaction Block (PTB) Setup',
        description: 'Construct a batch transaction that splits liquid coins and deposits into high-yield venues in a single atomic execution on Sui.',
        actionLabel: 'Preview PTB',
        protocol: 'Sui PTB Builder',
      });

      if (stakedDiff > 200) {
        recommendations.push({
          id: 'reb-ptb-2',
          category: 'rebalance',
          severity: 'opportunity',
          title: `Step 2: Stake $${stakedDiff.toFixed(0)} SUI into Native Validator`,
          description: `Delegate to Mysten Labs or Chorus One to reach target 40% core reserve. Generates predictable network staking yield.`,
          actionLabel: 'Execute Stake PTB',
          protocol: 'Sui System',
          estimatedImpact: `Target 40% allocation achieved`,
        });
      }

      if (stableDiff > 200) {
        recommendations.push({
          id: 'reb-ptb-3',
          category: 'rebalance',
          severity: 'opportunity',
          title: `Step 3: Route $${stableDiff.toFixed(0)} to Navi USDC Lending`,
          description: `Swap excess token exposure to USDC and deposit into Navi 7.2% lending pool to establish capital protection buffer.`,
          actionLabel: 'Execute Navi Supply',
          protocol: 'Navi Protocol',
          estimatedImpact: `Lock in 7.2% APY with minimal drawdowns`,
        });
      }

      return {
        summary: `Strategic rebalance target model: 40% Core SUI, 30% Stable Yield, 20% DeFi LP, 10% Ecosystem.`,
        recommendations,
        metrics: {
          'Target SUI Allocation': '40%',
          'Target USDC Allocation': '30%',
          'Target DeFi Pools': '20%',
          'Target Ecosystem': '10%',
        },
      };
    },
  },
];

export async function askSuiAgent(
  query: string,
  portfolio: PortfolioSummary
): Promise<AgentExecutionResult> {
  const q = query.toLowerCase();

  if (q.includes('risk') || q.includes('safe') || q.includes('health') || q.includes('audit')) {
    const skill = SUI_AGENT_SKILLS.find((s) => s.name === 'risk_audit')!;
    return skill.execute(portfolio);
  }

  if (q.includes('yield') || q.includes('apy') || q.includes('earn') || q.includes('stake') || q.includes('farm')) {
    const skill = SUI_AGENT_SKILLS.find((s) => s.name === 'yield_hunter')!;
    return skill.execute(portfolio);
  }

  if (q.includes('rebalance') || q.includes('allocate') || q.includes('ptb') || q.includes('swap') || q.includes('plan')) {
    const skill = SUI_AGENT_SKILLS.find((s) => s.name === 'rebalance_plan')!;
    return skill.execute(portfolio);
  }

  // General query answer
  const riskSkill = SUI_AGENT_SKILLS.find((s) => s.name === 'risk_audit')!;
  const auditResult = await riskSkill.execute(portfolio);

  return {
    summary: `Portfolio Analysis for ${portfolio.address.slice(0, 8)}...${portfolio.address.slice(-4)}: Net worth is $${portfolio.netWorthUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} across ${portfolio.tokens.length} assets and ${portfolio.defiPositions.length} DeFi protocols.`,
    recommendations: auditResult.recommendations.slice(0, 2),
    metrics: {
      'Net Worth': `$${portfolio.netWorthUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      'Liquid Assets': `$${portfolio.totalLiquidTokensUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      'Staked Assets': `$${portfolio.totalStakedSuiUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      'DeFi Active Collateral': `$${portfolio.totalDefiSupplyUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    },
  };
}

