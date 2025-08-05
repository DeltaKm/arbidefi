export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export interface DEX {
  name: string;
  router: string;
  factory: string;
  fee: number;
}

export interface ArbitrageOpportunity {
  id: string;
  tokenA: Token;
  tokenB: Token;
  dexA: DEX;
  dexB: DEX;
  priceA: number;
  priceB: number;
  priceDifference: number;
  profitability: number;
  gasEstimate: number;
  timestamp: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface FlashLoanProvider {
  name: string;
  address: string;
  fee: number;
  maxAmount: string;
}

export interface ArbitrageConfig {
  minProfitThreshold: number;
  maxGasPrice: number;
  slippageTolerance: number;
  flashLoanProvider: FlashLoanProvider;
  enabledDEXs: DEX[];
  monitoredTokens: Token[];
}
